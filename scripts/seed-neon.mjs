import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('❌ Error: DATABASE_URL is not set in .env');
  process.exit(1);
}

const sql = neon(databaseUrl);

const INITIAL_PROJECTS = [
  {
    id: "carkit",
    index: "01",
    name: "CarKit",
    category: "mobile & full-stack",
    short_blurb:
      "Full-scale automotive marketplace for Egypt — customer app, vendor dashboard, driver portal, and SOS dispatch in one platform.",
    blurb:
      "Full-scale automotive marketplace serving the Egyptian market. Customers browse and buy parts, book workshops, and track deliveries. Vendors manage inventory and orders. Drivers handle last-mile logistics. Emergency staff respond to SOS calls — all from one integrated backend.",
    tags: ["React Native Expo", "Express", "Node.js", "PostgreSQL", "Render", "Supabase"],
    stack_groups: [
      {
        label: "Mobile App",
        icon: "mobile",
        items: [
          { name: "Expo SDK", shortName: "Expo" },
          { name: "React Native", shortName: "RN" },
          { name: "TypeScript", shortName: "TS" },
        ],
      },
      {
        label: "Web Portals",
        icon: "web",
        items: [
          { name: "React", shortName: "React" },
          { name: "Tailwind CSS", shortName: "Tailwind" },
        ],
      },
      {
        label: "Backend",
        icon: "backend",
        items: [
          { name: "Node.js", shortName: "Node" },
          { name: "Express", shortName: "Express" },
          { name: "PostgreSQL", shortName: "Postgres" },
          { name: "JWT Auth", shortName: "JWT" },
          { name: "Supabase", shortName: "Supabase" },
        ],
      },
      {
        label: "Infrastructure",
        icon: "deploy",
        items: [
          { name: "Render", shortName: "Render" },
          { name: "Supabase", shortName: "Supabase" },
          { name: "Vercel", shortName: "Vercel" },
        ],
      },
    ],
    links: [
      { label: "App", href: "https://github.com/muuhamedhany/CarKitApp", icon: "github" },
      { label: "Admin", href: "https://github.com/muuhamedhany/CarKit-Admin-Web", icon: "github" },
      { label: "Driver", href: "https://github.com/muuhamedhany/CarKit-Driver-Web", icon: "github" },
    ],
    preview_video: {
      src: "/projects/CarKitVid-optimized.mp4",
      title: "CarKit project demo",
      type: "video/mp4",
    },
    preview_image: {
      src: "/projects/CarKitIPhone.png",
      alt: "CarKit Preview",
    },
    gallery_images: Array.from({ length: 47 }, (_, i) => ({
      src: `/projects/CarKit-Manual-${i + 2}.png`,
      alt: `CarKit Manual Page ${i + 2}`,
      title: `Page ${i + 1}`,
    })),
    featured: true,
    sort_order: 1,
  },
  {
    id: "nokhba",
    index: "02",
    name: "Nokhba",
    category: "web",
    short_blurb:
      "Bilingual EdTech marketplace and LMS for Egyptian secondary education — featuring code-based course monetization, automated assessments, and parent tracking.",
    blurb:
      "Commercial EdTech platform built to scale high-school education across Egypt. Educators publish and monetize curriculums via prepaid activation codes, students access interactive video lectures and timed exam engines, and parents monitor real-time academic progress — all powered by Neon Serverless Postgres and Cloudflare R2 edge storage.",
    tags: ["Next.js 16", "React 19", "Neon Postgres", "Cloudflare R2", "Prisma", "Tailwind CSS v4", "TypeScript"],
    stack_groups: [
      {
        label: "Frontend Core",
        icon: "frontend",
        items: [
          { name: "Next.js 16", shortName: "Next 16" },
          { name: "React 19", shortName: "React 19" },
          { name: "TypeScript", shortName: "TS" },
          { name: "Tailwind CSS v4", shortName: "Tailwind v4" },
        ],
      },
      {
        label: "Backend & Cloud",
        icon: "backend",
        items: [
          { name: "Neon Serverless Postgres", shortName: "Neon Postgres" },
          { name: "Cloudflare R2 Storage", shortName: "Cloudflare R2" },
          { name: "Prisma ORM", shortName: "Prisma" },
        ],
      },
      {
        label: "UI & Animations",
        icon: "web",
        items: [{ name: "Framer Motion", shortName: "Motion" }],
      },
      {
        label: "Deployment & Edge",
        icon: "deploy",
        items: [
          { name: "Vercel", shortName: "Vercel" },
          { name: "Cloudflare CDN", shortName: "Cloudflare" },
        ],
      },
    ],
    links: [
      { label: "Live", href: "https://nokhba-v2.vercel.app/", icon: "live" },
      { label: "GitHub", href: "https://github.com/muuhamedhany/nokhba-v2", icon: "github" },
    ],
    preview_image: {
      src: "/projects/Nokhba-Hero.png",
      alt: "Nokhba Educational Platform Preview",
    },
    gallery_images: [
      { src: "/projects/Nokhba-Hero.png", alt: "Nokhba Landing Page & Trust Metrics", title: "Landing Page & Live Trust Metrics" },
      { src: "/projects/Nokhba-Library.png", alt: "Nokhba Curriculum Library & Filters", title: "Curriculum Library & Smart Filters" },
      { src: "/projects/Nokhba-Teacher-Dashboard.png", alt: "Nokhba Teacher Management Studio", title: "Teacher Management Studio" },
      { src: "/projects/Nokhba-Course-Builder.png", alt: "Nokhba Course Builder & Syllabus Editor", title: "Course Builder & Syllabus Editor" },
      { src: "/projects/Nokhba-Registration.png", alt: "Nokhba Role-Based Onboarding", title: "Role-Based Registration & Onboarding" },
    ],
    featured: false,
    sort_order: 2,
  },
  {
    id: "car-rental",
    index: "03",
    name: "Car Rental Platform",
    category: "web",
    short_blurb:
      "Frontend React car rental platform optimized for vehicle reservation, rate estimation, and lead conversion.",
    blurb:
      "High-converting frontend car rental web platform engineered for instant booking and fleet exploration. Features an interactive vehicle reservation form, dynamic price calculator, vehicle specs comparison, GSAP scroll choreography, and seamless mobile responsiveness.",
    tags: ["Frontend", "React 19", "Tailwind CSS", "GSAP", "Framer Motion"],
    stack_groups: [
      {
        label: "Frontend Core",
        icon: "frontend",
        items: [
          { name: "React 19", shortName: "React" },
          { name: "Tailwind CSS", shortName: "Tailwind" },
          { name: "React Router", shortName: "Router" },
        ],
      },
      {
        label: "UI & Animations",
        icon: "web",
        items: [
          { name: "GSAP", shortName: "GSAP" },
          { name: "Framer Motion", shortName: "Motion" },
        ],
      },
      {
        label: "Deployment",
        icon: "deploy",
        items: [{ name: "Vercel", shortName: "Vercel" }],
      },
    ],
    links: [
      { label: "Live", href: "https://carrenral.vercel.app", icon: "live" },
      { label: "GitHub", href: "https://github.com/muuhamedhany/Car-Renral-REACT", icon: "github" },
    ],
    preview_image: {
      src: "/projects/CarRental.png",
      alt: "Car Rental Preview",
    },
    gallery_images: [
      { src: "/projects/CarRental.png", alt: "Car Rental Landing Page", title: "Hero & Reservation" },
      { src: "/projects/CarRentalModels.png", alt: "Car Rental Vehicle Models", title: "Fleet & Rates" },
      { src: "/projects/CarRentalTeam.png", alt: "Car Rental Team Page", title: "Team Showcase" },
    ],
    featured: false,
    sort_order: 3,
  },
  {
    id: "pure-store",
    index: "04",
    name: "Pure Store",
    category: "web",
    short_blurb:
      "Responsive React e-commerce storefront optimized for product discovery, cart management, and seamless customer checkout.",
    blurb:
      "Modern frontend e-commerce storefront designed for speed and conversion. Delivers a frictionless shopping experience with instant product filtering, persistent cart & wishlist management, interactive product showcases, and secure user account flows.",
    tags: ["Frontend", "React 19", "Tailwind CSS v4", "React Router 7", "Framer Motion"],
    stack_groups: [
      {
        label: "Frontend Core",
        icon: "frontend",
        items: [
          { name: "React 19", shortName: "React" },
          { name: "Tailwind CSS", shortName: "Tailwind" },
          { name: "React Router 7", shortName: "Router" },
        ],
      },
      {
        label: "UI & Animations",
        icon: "web",
        items: [
          { name: "Framer Motion", shortName: "Motion" },
          { name: "React Icons", shortName: "Icons" },
        ],
      },
      {
        label: "Client State & Features",
        icon: "frontend",
        items: [
          { name: "Auth Context", shortName: "Auth" },
          { name: "Cart", shortName: "Cart" },
          { name: "Wishlist", shortName: "Wishlist" },
        ],
      },
      {
        label: "Deployment",
        icon: "deploy",
        items: [{ name: "Vercel", shortName: "Vercel" }],
      },
    ],
    links: [
      { label: "Live", href: "https://pure-store.vercel.app", icon: "live" },
      { label: "GitHub", href: "https://github.com/muuhamedhany/E-Commerce-REACT", icon: "github" },
    ],
    preview_image: {
      src: "/projects/PureStore.png",
      alt: "PureStore Preview",
    },
    gallery_images: [
      { src: "/projects/PureStoreShop.png", alt: "Pure Store Shop Page", title: "Product Catalog & Filtering" },
      { src: "/projects/PureStoreDetails.png", alt: "Pure Store Product Details", title: "Product Details & Specs" },
      { src: "/projects/PureStoreCart.png", alt: "Pure Store Shopping Cart", title: "Shopping Cart & Checkout" },
    ],
    featured: false,
    sort_order: 4,
  },
  {
    id: "workout-diet-app",
    index: "05",
    name: "Workout & Diet App",
    category: "design",
    short_blurb:
      "UI/UX case study — research-driven design, user flows, and a high-fidelity prototype. NTI graduation project.",
    blurb:
      "Research-driven UI/UX case study for a fitness app. Covers user research, journey mapping, interaction design, and a high-fidelity Figma prototype. Published as a full Behance case study.",
    tags: ["Figma", "User Research", "Prototyping"],
    stack_groups: [
      {
        label: "Design & Research",
        icon: "design",
        items: [
          { name: "Figma", shortName: "Figma" },
          { name: "User Research", shortName: "Research" },
          { name: "User flows", shortName: "Flows" },
          { name: "Prototyping", shortName: "Prototype" },
        ],
      },
      {
        label: "Publishing",
        icon: "publish",
        items: [{ name: "Case study", shortName: "case study" }],
      },
    ],
    links: [
      { label: "Behance", href: "https://www.behance.net/gallery/234873613/UIUX-Workout-Diet-App", icon: "behance" },
    ],
    preview_image: {
      src: "/projects/ShapeUp.png",
      alt: "ShapeUp Preview",
    },
    featured: false,
    sort_order: 5,
  },
  {
    id: "vitality-ai",
    index: "06",
    name: "VitalityAI",
    category: "web",
    short_blurb:
      "Frontend contribution to an AI wellness platform — responsive UI, animation polish, and landing page refinement.",
    blurb:
      "Frontend contribution to an AI-powered wellness platform. Delivered responsive UI implementation, animation polish, and interaction refinements that lifted the landing-page experience from prototype to production quality.",
    tags: ["Frontend UI", "Animations", "Responsive Design"],
    stack_groups: [
      {
        label: "Frontend",
        icon: "frontend",
        items: [
          { name: "Responsive UI", shortName: "Responsive" },
          { name: "Animation polish", shortName: "Animations" },
          { name: "Landing page", shortName: "Landing" },
        ],
      },
    ],
    links: [{ label: "Live", href: "https://ai-wellness-tracker-mocha.vercel.app/", icon: "live" }],
    preview_image: {
      src: "/projects/VitalityAI.png",
      alt: "VitalityAI landing page preview",
    },
    featured: false,
    sort_order: 6,
  },
];

async function runMigration() {
  console.log('⚡ Connecting to Neon PostgreSQL...');

  // 1. Ensure Table Exists
  await sql`
    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      index TEXT NOT NULL,
      name TEXT NOT NULL,
      category TEXT NOT NULL CHECK (category IN ('mobile & full-stack', 'web', 'design')),
      short_blurb TEXT NOT NULL,
      blurb TEXT NOT NULL,
      tags JSONB NOT NULL DEFAULT '[]'::jsonb,
      stack_groups JSONB NOT NULL DEFAULT '[]'::jsonb,
      links JSONB NOT NULL DEFAULT '[]'::jsonb,
      preview_image JSONB,
      preview_video JSONB,
      gallery_images JSONB DEFAULT '[]'::jsonb,
      featured BOOLEAN DEFAULT false,
      note TEXT,
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;
  console.log('✅ Table "projects" checked/created.');

  // 2. Upsert each project
  for (const p of INITIAL_PROJECTS) {
    await sql`
      INSERT INTO projects (
        id, index, name, category, short_blurb, blurb,
        tags, stack_groups, links, preview_image, preview_video, gallery_images,
        featured, note, sort_order, updated_at
      ) VALUES (
        ${p.id},
        ${p.index},
        ${p.name},
        ${p.category},
        ${p.short_blurb},
        ${p.blurb},
        ${JSON.stringify(p.tags)},
        ${JSON.stringify(p.stack_groups)},
        ${JSON.stringify(p.links)},
        ${p.preview_image ? JSON.stringify(p.preview_image) : null},
        ${p.preview_video ? JSON.stringify(p.preview_video) : null},
        ${p.gallery_images ? JSON.stringify(p.gallery_images) : '[]'},
        ${p.featured || false},
        ${p.note || null},
        ${p.sort_order},
        NOW()
      )
      ON CONFLICT (id) DO UPDATE SET
        index = EXCLUDED.index,
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        short_blurb = EXCLUDED.short_blurb,
        blurb = EXCLUDED.blurb,
        tags = EXCLUDED.tags,
        stack_groups = EXCLUDED.stack_groups,
        links = EXCLUDED.links,
        preview_image = EXCLUDED.preview_image,
        preview_video = EXCLUDED.preview_video,
        gallery_images = EXCLUDED.gallery_images,
        featured = EXCLUDED.featured,
        note = EXCLUDED.note,
        sort_order = EXCLUDED.sort_order,
        updated_at = NOW();
    `;
    console.log(`📦 Synced project: [${p.index}] ${p.name}`);
  }

  // 3. Query back all projects to verify
  const rows = await sql`SELECT id, index, name, category, sort_order FROM projects ORDER BY sort_order ASC;`;
  console.log('\n🎉 Seed complete! Current projects in Neon PostgreSQL:');
  console.table(rows);
}

runMigration().catch((err) => {
  console.error('❌ Migration failed:', err);
  process.exit(1);
});
