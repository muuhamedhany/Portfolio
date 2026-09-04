import {
  type ContributionDay,
  type ContributionWeek,
  type GitHubContributionsResponse,
  buildContributionsResponse,
  getSnapshotContributions,
  parseJogruberResponse,
} from '../src/sections/about/githubContributionsSnapshot.ts';

export type { ContributionDay, ContributionWeek, GitHubContributionsResponse };

// In-memory cache for contribution data (1 hour TTL)
const cache = new Map<string, { timestamp: number; data: GitHubContributionsResponse }>();
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

/**
 * Fallback contribution response using authentic historical data or a clean zeroed calendar
 */
export function generateFallbackContributions(username: string, year: number): GitHubContributionsResponse {
  return getSnapshotContributions(username, year);
}

/**
 * Parse GitHub's raw HTML contribution calendar if available
 */
function parseGitHubHtml(html: string, username: string, year: number): GitHubContributionsResponse | null {
  let total = 0;
  const totalMatch = html.match(/([\d,]+)\s+contributions/i);
  if (totalMatch) {
    total = parseInt(totalMatch[1].replace(/,/g, ''), 10) || 0;
  }

  const dayRegex = /<td[^>]*data-date="([\d-]+)"[^>]*data-level="(\d+)"[^>]*>.*?<\/td>/gs;
  const daysMap = new Map<string, { level: 0 | 1 | 2 | 3 | 4; count: number }>();

  const tooltipRegex = /<tool-tip[^>]*for="([^"]+)"[^>]*>([^<]+)<\/tool-tip>/g;
  const tooltips = new Map<string, string>();
  let ttMatch;
  while ((ttMatch = tooltipRegex.exec(html)) !== null) {
    tooltips.set(ttMatch[1], ttMatch[2]);
  }

  let match;
  while ((match = dayRegex.exec(html)) !== null) {
    const date = match[1];
    const level = (parseInt(match[2], 10) || 0) as 0 | 1 | 2 | 3 | 4;
    let count = level === 0 ? 0 : level === 1 ? 1 : level === 2 ? 3 : level === 3 ? 6 : 10;

    const idMatch = match[0].match(/id="([^"]+)"/);
    if (idMatch && tooltips.has(idMatch[1])) {
      const text = tooltips.get(idMatch[1]) || '';
      const cMatch = text.match(/(\d+)\s+contribution/i);
      if (cMatch) count = parseInt(cMatch[1], 10);
    }

    daysMap.set(date, { level, count });
  }

  if (daysMap.size === 0) {
    return null;
  }

  return buildContributionsResponse(username, year, daysMap, total > 0 ? total : undefined);
}

/**
 * Fetch contribution data with resilient multi-tier fallbacks:
 * 1. Cache (1 hour)
 * 2. Dedicated public Contributions API (handles GitHub rate limiting)
 * 3. Direct GitHub HTML scraping
 * 4. Authentic verified snapshot data
 */
export async function getGitHubContributions(username = 'muuhamedhany', year = 2026): Promise<GitHubContributionsResponse> {
  const cacheKey = `${username}:${year}`;
  const cached = cache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  // Tier 1: Try dedicated contributions service
  try {
    const apiUrl = `https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(username)}?y=${year}`;
    const res = await fetch(apiUrl, {
      headers: {
        Accept: 'application/json',
      },
      signal: AbortSignal.timeout(4000),
    });

    if (res.ok) {
      const json = await res.json();
      if (json && (json.contributions || json.total !== undefined)) {
        const result = parseJogruberResponse(username, year, json);
        cache.set(cacheKey, { timestamp: Date.now(), data: result });
        return result;
      }
    }
  } catch (apiErr) {
    console.warn(`[GitHub API] Public API query failed for ${username} (${year}):`, apiErr);
  }

  // Tier 2: Try direct GitHub HTML scraping
  try {
    const htmlUrl = `https://github.com/users/${encodeURIComponent(username)}/contributions?from=${year}-01-01&to=${year}-12-31`;
    const res = await fetch(htmlUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'text/html',
      },
      signal: AbortSignal.timeout(4000),
    });

    if (res.ok) {
      const html = await res.text();
      const parsed = parseGitHubHtml(html, username, year);
      if (parsed) {
        cache.set(cacheKey, { timestamp: Date.now(), data: parsed });
        return parsed;
      }
    }
  } catch (htmlErr) {
    console.warn(`[GitHub API] HTML scraping failed for ${username} (${year}):`, htmlErr);
  }

  // Tier 3: Fallback to authentic snapshot
  const snapshot = getSnapshotContributions(username, year);
  // Cache snapshot for 5 minutes so future requests can retry live sources
  cache.set(cacheKey, { timestamp: Date.now() - (CACHE_TTL_MS - 5 * 60 * 1000), data: snapshot });
  return snapshot;
}
