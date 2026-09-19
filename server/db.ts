import { neon } from '@neondatabase/serverless';

// Safely load dotenv in local development if environment variables are not already present
if (!process.env.DATABASE_URL) {
  try {
    const dotenv = await import('dotenv');
    dotenv.default.config();
  } catch {
    // Environment variables already provided by hosting platform (Vercel)
  }
}

let _sqlInstance: ReturnType<typeof neon> | null = null;

export function getDb(): ReturnType<typeof neon> {
  if (!_sqlInstance) {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new Error('DATABASE_URL is not set in environment.');
    }
    _sqlInstance = neon(databaseUrl);
  }
  return _sqlInstance;
}

export const sql: ReturnType<typeof neon> = new Proxy((() => {}) as any, {
  apply(_target, _thisArg, args: [TemplateStringsArray, ...any[]]) {
    const db = getDb();
    return (db as any)(...args);
  },
  get(_target, prop) {
    const db = getDb();
    const val = (db as any)[prop];
    return typeof val === 'function' ? val.bind(db) : val;
  },
});

export interface DbProject {
  id: string;
  index: string;
  name: string;
  category: 'mobile & full-stack' | 'web' | 'design';
  short_blurb: string;
  blurb: string;
  tags: string[];
  stack_groups: Array<{
    label: string;
    icon: string;
    items: Array<{ name: string; shortName?: string }>;
  }>;
  links: Array<{
    label: string;
    href: string;
    icon: 'live' | 'github' | 'behance';
  }>;
  preview_image?: {
    src: string;
    alt: string;
  } | null;
  preview_video?: {
    src: string;
    title: string;
    poster?: string;
    type?: string;
  } | null;
  gallery_images?: Array<{
    src: string;
    alt: string;
    title?: string;
  }>;
  featured: boolean;
  note?: string | null;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}
