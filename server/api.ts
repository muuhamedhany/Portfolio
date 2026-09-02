import type { IncomingMessage, ServerResponse } from 'http';
import { sql, DbProject } from './db.ts';
import { verifyGoogleToken, signAdminJwt, verifyAdminSession, setAuthCookie, clearAuthCookie } from './auth.ts';
import { getGitHubContributions } from './github.ts';

/**
 * Helper to parse JSON body from incoming request
 */
async function parseBody<T = any>(req: IncomingMessage): Promise<T> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        reject(new Error('Invalid JSON payload'));
      }
    });
    req.on('error', reject);
  });
}

/**
 * Helper to send JSON response
 */
function sendJson(res: ServerResponse, status: number, data: any) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(data));
}

function resolveMediaUrl(path: string | undefined): string | undefined {
  if (!path) return undefined;
  if (/^(?:https?:|\/\/|data:)/i.test(path)) return path;
  const normalized = path.startsWith('/') ? path : `/${path}`;
  const baseUrl = (
    process.env.VITE_CLOUDFLARE_R2_PUBLIC_URL ||
    process.env.VITE_MEDIA_BASE_URL ||
    ''
  ).replace(/\/+$/, '');
  return baseUrl ? `${baseUrl}${normalized}` : normalized;
}

/**
 * Format DB row to Project object matching frontend types
 */
function formatProject(row: any) {
  const previewImage = row.preview_image
    ? typeof row.preview_image === 'string'
      ? JSON.parse(row.preview_image)
      : row.preview_image
    : undefined;
  const previewVideo = row.preview_video
    ? typeof row.preview_video === 'string'
      ? JSON.parse(row.preview_video)
      : row.preview_video
    : undefined;
  const galleryImages = row.gallery_images
    ? Array.isArray(row.gallery_images)
      ? row.gallery_images
      : JSON.parse(row.gallery_images)
    : [];

  return {
    id: row.id,
    index: row.index,
    name: row.name,
    category: row.category,
    shortBlurb: row.short_blurb,
    blurb: row.blurb,
    tags: Array.isArray(row.tags) ? row.tags : JSON.parse(row.tags || '[]'),
    stackGroups: Array.isArray(row.stack_groups) ? row.stack_groups : JSON.parse(row.stack_groups || '[]'),
    links: Array.isArray(row.links) ? row.links : JSON.parse(row.links || '[]'),
    previewImage: previewImage
      ? {
          ...previewImage,
          src: resolveMediaUrl(previewImage.src) || previewImage.src,
        }
      : undefined,
    previewVideo: previewVideo
      ? {
          ...previewVideo,
          src: resolveMediaUrl(previewVideo.src) || previewVideo.src,
          poster: resolveMediaUrl(previewVideo.poster),
        }
      : undefined,
    galleryImages: galleryImages.map((img: any) => ({
      ...img,
      src: resolveMediaUrl(img.src) || img.src,
    })),
    featured: Boolean(row.featured),
    note: row.note || undefined,
    sortOrder: Number(row.sort_order || 0),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * Main API Request Handler
 */
export async function handleApiRequest(req: IncomingMessage, res: ServerResponse): Promise<boolean> {
  const url = req.url || '';
  const parsedUrl = new URL(url, `http://${req.headers.host || 'localhost'}`);
  let pathname = parsedUrl.pathname;
  if (!pathname.startsWith('/api/') && pathname !== '/api') {
    pathname = `/api${pathname.startsWith('/') ? pathname : `/${pathname}`}`;
  }
  const method = (req.method || 'GET').toUpperCase();

  try {
    // ─── AUTH: GOOGLE LOGIN ───
    if (pathname === '/api/auth/google' && method === 'POST') {
      const body = await parseBody(req);
      const token = body.accessToken || body.access_token || body.idToken || body.credential;
      const type = (body.accessToken || body.access_token) ? 'access_token' : 'id_token';

      if (!token) {
        sendJson(res, 400, { error: 'Missing Google authentication token' });
        return true;
      }

      const user = await verifyGoogleToken(token, type);
      if (!user) {
        sendJson(res, 401, { error: 'Failed to verify Google account credentials.' });
        return true;
      }

      if (!user.isAdmin) {
        sendJson(res, 403, {
          error: 'Access restricted: this account is not authorized as portfolio administrator.',
        });
        return true;
      }

      const jwtToken = signAdminJwt(user);
      setAuthCookie(res, jwtToken);

      sendJson(res, 200, {
        success: true,
        user: {
          email: user.email,
          name: user.name,
          picture: user.picture,
          isAdmin: true,
        },
        token: jwtToken,
      });
      return true;
    }

    // ─── AUTH: CHECK ACTIVE SESSION ───
    if (pathname === '/api/auth/me' && method === 'GET') {
      const admin = verifyAdminSession(req);
      if (admin) {
        sendJson(res, 200, {
          authenticated: true,
          user: {
            email: admin.email,
            name: admin.name,
            picture: admin.picture,
            isAdmin: true,
          },
        });
      } else {
        sendJson(res, 200, {
          authenticated: false,
          user: null,
        });
      }
      return true;
    }

    // ─── AUTH: LOGOUT ───
    if (pathname === '/api/auth/logout' && method === 'POST') {
      clearAuthCookie(res);
      sendJson(res, 200, { success: true });
      return true;
    }

    // ─── GITHUB: GET CONTRIBUTIONS (PUBLIC) ───
    if (pathname === '/api/github/contributions' && method === 'GET') {
      const username = parsedUrl.searchParams.get('username') || 'muuhamedhany';
      const year = parseInt(parsedUrl.searchParams.get('year') || '2026', 10) || 2026;
      const data = await getGitHubContributions(username, year);
      sendJson(res, 200, data);
      return true;
    }

    // ─── PROJECTS: GET ALL (PUBLIC) ───
    if (pathname === '/api/projects' && method === 'GET') {
      const rows = await sql`
        SELECT * FROM projects
        ORDER BY sort_order ASC, index ASC, created_at DESC;
      `;
      const projects = rows.map(formatProject);
      sendJson(res, 200, { projects });
      return true;
    }

    // ─── PROJECTS: CREATE (ADMIN ONLY) ───
    if (pathname === '/api/projects' && method === 'POST') {
      const admin = verifyAdminSession(req);
      if (!admin) {
        sendJson(res, 401, { error: 'Unauthorized: Admin authentication required.' });
        return true;
      }

      const p = await parseBody(req);
      const id = p.id || p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `proj-${Date.now()}`;
      const index = p.index || '01';
      const name = p.name || 'Untitled Project';
      const category = p.category || 'web';
      const shortBlurb = p.shortBlurb || '';
      const blurb = p.blurb || '';
      const tags = JSON.stringify(p.tags || []);
      const stackGroups = JSON.stringify(p.stackGroups || []);
      const links = JSON.stringify(p.links || []);
      const previewImage = p.previewImage ? JSON.stringify(p.previewImage) : null;
      const previewVideo = p.previewVideo ? JSON.stringify(p.previewVideo) : null;
      const galleryImages = JSON.stringify(p.galleryImages || []);
      const featured = Boolean(p.featured);
      const note = p.note || null;
      const sortOrder = Number(p.sortOrder ?? p.sort_order ?? 99);

      const inserted = await sql`
        INSERT INTO projects (
          id, index, name, category, short_blurb, blurb,
          tags, stack_groups, links, preview_image, preview_video, gallery_images,
          featured, note, sort_order, updated_at
        ) VALUES (
          ${id}, ${index}, ${name}, ${category}, ${shortBlurb}, ${blurb},
          ${tags}, ${stackGroups}, ${links}, ${previewImage}, ${previewVideo}, ${galleryImages},
          ${featured}, ${note}, ${sortOrder}, NOW()
        )
        RETURNING *;
      `;

      sendJson(res, 201, { success: true, project: formatProject(inserted[0]) });
      return true;
    }

    // ─── PROJECTS: UPDATE (ADMIN ONLY) ───
    const matchUpdate = pathname.match(/^\/api\/projects\/([a-zA-Z0-9_-]+)$/);
    if (matchUpdate && method === 'PUT') {
      const admin = verifyAdminSession(req);
      if (!admin) {
        sendJson(res, 401, { error: 'Unauthorized: Admin authentication required.' });
        return true;
      }

      const projectId = matchUpdate[1];
      const p = await parseBody(req);

      const index = p.index;
      const name = p.name;
      const category = p.category;
      const shortBlurb = p.shortBlurb;
      const blurb = p.blurb;
      const tags = p.tags ? JSON.stringify(p.tags) : undefined;
      const stackGroups = p.stackGroups ? JSON.stringify(p.stackGroups) : undefined;
      const links = p.links ? JSON.stringify(p.links) : undefined;
      const previewImage = p.previewImage !== undefined ? (p.previewImage ? JSON.stringify(p.previewImage) : null) : undefined;
      const previewVideo = p.previewVideo !== undefined ? (p.previewVideo ? JSON.stringify(p.previewVideo) : null) : undefined;
      const galleryImages = p.galleryImages ? JSON.stringify(p.galleryImages) : undefined;
      const featured = p.featured !== undefined ? Boolean(p.featured) : undefined;
      const note = p.note !== undefined ? p.note : undefined;
      const sortOrder = p.sortOrder !== undefined ? Number(p.sortOrder) : undefined;

      const updated = await sql`
        UPDATE projects
        SET
          index = COALESCE(${index}, index),
          name = COALESCE(${name}, name),
          category = COALESCE(${category}, category),
          short_blurb = COALESCE(${shortBlurb}, short_blurb),
          blurb = COALESCE(${blurb}, blurb),
          tags = COALESCE(${tags}, tags),
          stack_groups = COALESCE(${stackGroups}, stack_groups),
          links = COALESCE(${links}, links),
          preview_image = CASE WHEN ${previewImage !== undefined} THEN ${previewImage} ELSE preview_image END,
          preview_video = CASE WHEN ${previewVideo !== undefined} THEN ${previewVideo} ELSE preview_video END,
          gallery_images = COALESCE(${galleryImages}, gallery_images),
          featured = COALESCE(${featured}, featured),
          note = CASE WHEN ${note !== undefined} THEN ${note} ELSE note END,
          sort_order = COALESCE(${sortOrder}, sort_order),
          updated_at = NOW()
        WHERE id = ${projectId}
        RETURNING *;
      `;

      if (updated.length === 0) {
        sendJson(res, 404, { error: 'Project not found' });
        return true;
      }

      sendJson(res, 200, { success: true, project: formatProject(updated[0]) });
      return true;
    }

    // ─── PROJECTS: DELETE (ADMIN ONLY) ───
    if (matchUpdate && method === 'DELETE') {
      const admin = verifyAdminSession(req);
      if (!admin) {
        sendJson(res, 401, { error: 'Unauthorized: Admin authentication required.' });
        return true;
      }

      const projectId = matchUpdate[1];
      const deleted = await sql`
        DELETE FROM projects
        WHERE id = ${projectId}
        RETURNING id, name;
      `;

      if (deleted.length === 0) {
        sendJson(res, 404, { error: 'Project not found' });
        return true;
      }

      sendJson(res, 200, { success: true, deleted: deleted[0] });
      return true;
    }

    sendJson(res, 404, { error: 'API route not found' });
    return true;
  } catch (err: any) {
    console.error('API Handler Error:', err);
    sendJson(res, 500, { error: err.message || 'Internal server error' });
    return true;
  }
}
