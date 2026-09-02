/**
 * Media resolution helper for Cloudflare R2 Storage.
 *
 * Prepends the Cloudflare R2 public base URL (configured via `VITE_CLOUDFLARE_R2_PUBLIC_URL`
 * or `VITE_MEDIA_BASE_URL`) to local asset paths.
 * Falls back to local public directory paths if no remote base URL is set.
 */

const BASE_URL = (
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_CLOUDFLARE_R2_PUBLIC_URL) ||
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_MEDIA_BASE_URL) ||
  (typeof process !== "undefined" && process.env?.VITE_CLOUDFLARE_R2_PUBLIC_URL) ||
  (typeof process !== "undefined" && process.env?.VITE_MEDIA_BASE_URL) ||
  ""
).replace(/\/+$/, "");

/**
 * Resolves a media file path to either Cloudflare R2 or local fallback.
 *
 * @param path - Relative asset path starting with `/` (e.g. `"/projects/CarKitIPhone.png"`)
 *               or a complete URL.
 * @returns Fully qualified media URL.
 */
export function getMediaUrl(path: string): string {
  if (!path) return "";
  
  // If already an absolute URL or data URI, return as-is
  if (/^(?:https?:|\/\/|data:)/i.test(path)) {
    return path;
  }

  // Ensure normalized leading slash
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  if (!BASE_URL) {
    return normalizedPath;
  }

  return `${BASE_URL}${normalizedPath}`;
}

export const MEDIA_URLS = {
  cv: getMediaUrl("/cv.pdf"),
  carKitManualPdf: getMediaUrl("/CarKit User manual.pdf"),
  avatar: getMediaUrl("/avatar.svg"),
} as const;
