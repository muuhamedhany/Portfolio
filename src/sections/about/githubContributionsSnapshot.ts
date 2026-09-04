export interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
  weekday: number; // 0 = Sunday, 6 = Saturday
}

export interface ContributionWeek {
  days: (ContributionDay | null)[];
}

export interface GitHubContributionsResponse {
  username: string;
  year: number;
  totalContributions: number;
  weeks: ContributionWeek[];
  months: { name: string; weekIndex: number }[];
  updatedAt: string;
}

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/**
 * Authentic contribution days for @muuhamedhany:
 * Record<year, { total: number, days: Record<dateString, [count, level]> }>
 */
export const MUUHAMEDHANY_SNAPSHOT: Record<
  number,
  { total: number; days: Record<string, [number, 0 | 1 | 2 | 3 | 4]> }
> = {
  2024: {
    total: 1,
    days: {
      "2024-11-10": [1, 4],
    },
  },
  2025: {
    total: 78,
    days: {
      "2025-02-01": [3, 3],
      "2025-02-28": [3, 3],
      "2025-06-29": [9, 4],
      "2025-07-12": [1, 1],
      "2025-07-19": [5, 4],
      "2025-07-22": [1, 1],
      "2025-07-23": [2, 2],
      "2025-07-27": [8, 4],
      "2025-07-29": [25, 4],
      "2025-08-01": [3, 3],
      "2025-08-06": [9, 4],
      "2025-08-13": [1, 1],
      "2025-08-17": [1, 1],
      "2025-08-21": [2, 2],
      "2025-08-29": [1, 1],
      "2025-08-31": [1, 1],
      "2025-09-01": [1, 1],
      "2025-09-09": [1, 1],
      "2025-09-21": [1, 1],
    },
  },
  2026: {
    total: 757,
    days: {
      "2026-02-07": [1, 1],
      "2026-02-19": [2, 1],
      "2026-02-21": [4, 1],
      "2026-02-22": [4, 1],
      "2026-03-06": [2, 1],
      "2026-03-14": [3, 1],
      "2026-03-15": [4, 1],
      "2026-03-17": [2, 1],
      "2026-03-18": [4, 1],
      "2026-03-23": [13, 3],
      "2026-03-25": [15, 4],
      "2026-03-27": [1, 1],
      "2026-03-28": [5, 2],
      "2026-04-01": [22, 4],
      "2026-04-02": [8, 2],
      "2026-04-03": [7, 2],
      "2026-04-06": [2, 1],
      "2026-04-07": [1, 1],
      "2026-04-08": [4, 1],
      "2026-04-10": [14, 3],
      "2026-04-11": [9, 2],
      "2026-04-12": [16, 4],
      "2026-04-13": [4, 1],
      "2026-04-14": [30, 4],
      "2026-04-15": [10, 3],
      "2026-04-16": [13, 3],
      "2026-04-18": [2, 1],
      "2026-04-19": [1, 1],
      "2026-04-20": [8, 2],
      "2026-04-22": [2, 1],
      "2026-04-25": [4, 1],
      "2026-04-26": [13, 3],
      "2026-04-27": [7, 2],
      "2026-04-28": [5, 2],
      "2026-04-29": [13, 3],
      "2026-04-30": [2, 1],
      "2026-05-01": [5, 2],
      "2026-05-02": [18, 4],
      "2026-05-04": [4, 1],
      "2026-05-05": [22, 4],
      "2026-05-06": [13, 3],
      "2026-05-07": [8, 2],
      "2026-05-08": [5, 2],
      "2026-05-10": [1, 1],
      "2026-05-11": [17, 4],
      "2026-05-12": [15, 4],
      "2026-05-13": [6, 2],
      "2026-05-14": [7, 2],
      "2026-05-15": [2, 1],
      "2026-05-16": [6, 2],
      "2026-05-17": [8, 2],
      "2026-05-18": [13, 3],
      "2026-05-19": [13, 3],
      "2026-05-20": [14, 3],
      "2026-05-21": [10, 3],
      "2026-05-22": [13, 3],
      "2026-05-23": [21, 4],
      "2026-05-24": [2, 1],
      "2026-05-25": [19, 4],
      "2026-05-26": [2, 1],
      "2026-05-27": [2, 1],
      "2026-05-28": [12, 3],
      "2026-05-29": [2, 1],
      "2026-06-08": [8, 2],
      "2026-06-09": [5, 2],
      "2026-06-11": [5, 2],
      "2026-06-13": [1, 1],
      "2026-06-14": [1, 1],
      "2026-06-15": [7, 2],
      "2026-06-16": [17, 4],
      "2026-06-17": [2, 1],
      "2026-06-19": [5, 2],
      "2026-06-21": [1, 1],
      "2026-06-22": [4, 1],
      "2026-06-23": [4, 1],
      "2026-06-24": [3, 1],
      "2026-06-25": [6, 2],
      "2026-06-27": [6, 2],
      "2026-06-29": [1, 1],
      "2026-06-30": [4, 1],
      "2026-07-01": [1, 1],
      "2026-07-05": [4, 1],
      "2026-07-06": [1, 1],
      "2026-07-07": [3, 1],
      "2026-07-10": [2, 1],
      "2026-07-14": [3, 1],
      "2026-07-15": [2, 1],
      "2026-07-16": [2, 1],
      "2026-07-17": [1, 1],
      "2026-07-18": [1, 1],
      "2026-07-19": [4, 1],
      "2026-07-20": [3, 1],
      "2026-07-21": [5, 2],
      "2026-07-22": [2, 1],
      "2026-07-24": [7, 2],
      "2026-07-25": [4, 1],
      "2026-07-26": [1, 1],
      "2026-07-27": [1, 1],
      "2026-07-29": [4, 1],
      "2026-08-03": [6, 2],
      "2026-08-04": [1, 1],
      "2026-08-05": [3, 1],
      "2026-08-06": [1, 1],
      "2026-08-07": [8, 2],
      "2026-08-08": [12, 3],
      "2026-08-12": [2, 1],
      "2026-08-13": [1, 1],
      "2026-08-14": [1, 1],
      "2026-08-15": [19, 4],
      "2026-08-16": [9, 2],
      "2026-08-17": [7, 2],
      "2026-08-21": [1, 1],
      "2026-08-22": [11, 3],
      "2026-08-24": [3, 1],
      "2026-08-26": [2, 1],
      "2026-08-27": [8, 2],
      "2026-08-28": [2, 1],
      "2026-08-31": [3, 1],
      "2026-09-01": [6, 2],
      "2026-09-02": [2, 1],
      "2026-09-03": [1, 1],
    },
  },
};

/**
 * Builds standard 7-row GitHub contribution weeks (Sunday to Saturday) and month labels
 */
export function buildContributionsResponse(
  username: string,
  year: number,
  daysMap: Map<string, { count: number; level: 0 | 1 | 2 | 3 | 4 }>,
  totalContributions?: number
): GitHubContributionsResponse {
  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year, 11, 31);
  const startDayOfWeek = startDate.getDay();

  const monthWeeks: { name: string; weekIndex: number }[] = [];
  let lastMonth = -1;

  const weeks: ContributionWeek[] = [];
  let currentWeek: (ContributionDay | null)[] = [];

  // Pad the very first week before Jan 1
  for (let i = 0; i < startDayOfWeek; i++) {
    currentWeek.push(null);
  }

  const cur = new Date(startDate);
  let calculatedTotal = 0;

  while (cur <= endDate) {
    const m = cur.getMonth();
    if (m !== lastMonth) {
      monthWeeks.push({ name: MONTH_NAMES[m], weekIndex: weeks.length });
      lastMonth = m;
    }

    const dateStr = cur.toISOString().split('T')[0];
    const item = daysMap.get(dateStr) || { level: 0, count: 0 };
    calculatedTotal += item.count;

    currentWeek.push({
      date: dateStr,
      count: item.count,
      level: item.level,
      weekday: cur.getDay(),
    });

    if (currentWeek.length === 7) {
      weeks.push({ days: currentWeek });
      currentWeek = [];
    }

    cur.setDate(cur.getDate() + 1);
  }

  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push(null);
    }
    weeks.push({ days: currentWeek });
  }

  return {
    username,
    year,
    totalContributions: typeof totalContributions === 'number' ? totalContributions : calculatedTotal,
    weeks,
    months: monthWeeks,
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Returns authentic static snapshot for known user, or a clean zeroed calendar for fallback
 */
export function getSnapshotContributions(username: string, year: number): GitHubContributionsResponse {
  const daysMap = new Map<string, { count: number; level: 0 | 1 | 2 | 3 | 4 }>();
  const snap = MUUHAMEDHANY_SNAPSHOT[year];

  let total = 0;
  if (snap) {
    total = snap.total;
    for (const [date, [count, level]] of Object.entries(snap.days)) {
      daysMap.set(date, { count, level });
    }
  }

  return buildContributionsResponse(username, year, daysMap, total);
}

/**
 * Transforms response from https://github-contributions-api.jogruber.de into GitHubContributionsResponse
 */
export function parseJogruberResponse(
  username: string,
  year: number,
  data: {
    total?: Record<string, number> | number;
    contributions?: Array<{ date: string; count: number; level: number }>;
  }
): GitHubContributionsResponse {
  const daysMap = new Map<string, { count: number; level: 0 | 1 | 2 | 3 | 4 }>();

  if (Array.isArray(data.contributions)) {
    for (const item of data.contributions) {
      if (item && item.date) {
        const level = Math.min(4, Math.max(0, item.level || 0)) as 0 | 1 | 2 | 3 | 4;
        daysMap.set(item.date, {
          count: item.count || 0,
          level,
        });
      }
    }
  }

  let total: number | undefined;
  if (typeof data.total === 'number') {
    total = data.total;
  } else if (data.total && typeof data.total[String(year)] === 'number') {
    total = data.total[String(year)];
  }

  return buildContributionsResponse(username, year, daysMap, total);
}
