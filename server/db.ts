import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.warn('⚠️ DATABASE_URL is not set in environment.');
}

export const sql = neon(databaseUrl || '');

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
