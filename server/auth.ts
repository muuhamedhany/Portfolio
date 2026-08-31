import jwt from 'jsonwebtoken';
import type { IncomingMessage, ServerResponse } from 'http';

function parseCookie(cookieStr: string): Record<string, string> {
  const list: Record<string, string> = {};
  if (!cookieStr) return list;
  cookieStr.split(';').forEach((cookie) => {
    const parts = cookie.split('=');
    if (parts.length >= 2) {
      list[parts[0].trim()] = decodeURIComponent(parts.slice(1).join('=').trim());
    }
  });
  return list;
}

function serializeCookie(
  name: string,
  val: string,
  options: { maxAge?: number; path?: string; httpOnly?: boolean; secure?: boolean; sameSite?: string } = {}
): string {
  let str = `${encodeURIComponent(name)}=${encodeURIComponent(val)}`;
  if (options.maxAge !== undefined) str += `; Max-Age=${options.maxAge}`;
  if (options.path) str += `; Path=${options.path}`;
  if (options.httpOnly) str += '; HttpOnly';
  if (options.secure) str += '; Secure';
  if (options.sameSite) str += `; SameSite=${options.sameSite}`;
  return str;
}

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-123456789-portfolio';
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
const GOOGLE_CLIENT_ID = process.env.VITE_GOOGLE_CLIENT_ID || '';

export interface AdminUser {
  email: string;
  name?: string;
  picture?: string;
  isAdmin: boolean;
}

/**
 * Verify a Google ID Token using Google's public endpoint
 */
export async function verifyGoogleToken(idToken: string): Promise<AdminUser | null> {
  try {
    const res = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`);
    if (!res.ok) {
      console.error('Google tokeninfo failed:', await res.text());
      return null;
    }
    const data = await res.json();

    // Verify audience matches our Client ID if provided
    if (GOOGLE_CLIENT_ID && data.aud !== GOOGLE_CLIENT_ID) {
      console.error('Token audience mismatch:', data.aud, 'expected:', GOOGLE_CLIENT_ID);
      return null;
    }

    const email = (data.email || '').trim().toLowerCase();
    const isEmailVerified = data.email_verified === 'true' || data.email_verified === true;

    if (!email || !isEmailVerified) {
      console.error('Email not verified or missing in Google token');
      return null;
    }

    const isAdmin = email === ADMIN_EMAIL;

    return {
      email,
      name: data.name || data.given_name || 'Admin',
      picture: data.picture || '',
      isAdmin,
    };
  } catch (err) {
    console.error('Error verifying Google token:', err);
    return null;
  }
}

/**
 * Sign JWT token for authenticated Admin
 */
export function signAdminJwt(user: AdminUser): string {
  return jwt.sign(
    {
      email: user.email,
      name: user.name,
      picture: user.picture,
      isAdmin: user.isAdmin,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

/**
 * Verify JWT from cookie or Authorization header
 */
export function verifyAdminSession(req: IncomingMessage): AdminUser | null {
  try {
    let token: string | undefined;

    // 1. Check Authorization header
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.slice(7).trim();
    }

    // 2. Check Cookie header
    if (!token && req.headers.cookie) {
      const cookies = parseCookie(req.headers.cookie);
      token = cookies['portfolio_admin_token'];
    }

    if (!token) return null;

    const decoded = jwt.verify(token, JWT_SECRET) as AdminUser;
    if (decoded && decoded.isAdmin && decoded.email.toLowerCase() === ADMIN_EMAIL) {
      return decoded;
    }

    return null;
  } catch (err) {
    return null;
  }
}

/**
 * Set HTTP-only session cookie on response
 */
export function setAuthCookie(res: ServerResponse, token: string) {
  const isProd = process.env.NODE_ENV === 'production';
  const cookieStr = serializeCookie('portfolio_admin_token', token, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
  res.setHeader('Set-Cookie', cookieStr);
}

/**
 * Clear session cookie
 */
export function clearAuthCookie(res: ServerResponse) {
  const cookieStr = serializeCookie('portfolio_admin_token', '', {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
  res.setHeader('Set-Cookie', cookieStr);
}
