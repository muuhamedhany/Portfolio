export interface CvExperience {
  title: string;
  company: string;
  period: string;
  bullets: string[];
}

export interface CvEducation {
  degree: string;
  institution: string;
  period: string;
}

export interface CvCertificate {
  name: string;
  issuer: string;
}

export interface CvProject {
  name: string;
  subtitle: string;
  description: string;
  period?: string;
}

export interface CvSocial {
  label: string;
  href: string;
}

export interface CvSkillGroup {
  category: string;
  skills: string[];
}

export interface CvData {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  objective: string;
  skillGroups: CvSkillGroup[];
  experience: CvExperience[];
  education: CvEducation[];
  certificates: CvCertificate[];
  projects: CvProject[];
  impact: string[];
  socials: CvSocial[];
  languages: { label: string; level: string }[];
}

export const CV_DATA: CvData = {
  name: "Mohamed Hany Helmy",
  title: "FRONTEND ENGINEER & FULL-STACK DEVELOPER",
  email: "muuhamedhany@gmail.com",
  phone: "01004899835",
  location: "Cairo, Egypt",

  objective:
    "Full-stack developer with a frontend focus and a background in UI/UX design. Experienced in building and shipping web and mobile applications from the ground up. Looking for a role where design and engineering overlap.",

  skillGroups: [
    {
      category: "Front-End",
      skills: ["HTML5", "CSS", "JavaScript ES6+", "TypeScript", "React", "React Native", "Tailwind"],
    },
    {
      category: "Back-End",
      skills: ["NodeJS", "ExpressJS", "PHP"],
    },
    {
      category: "Database",
      skills: ["SQL Server", "MySQL", "PostgreSQL"],
    },
    {
      category: "Tools & Platforms",
      skills: ["Git", "GitHub", "Supabase", "Figma"],
    },
  ],

  experience: [
    {
      title: "Frontend Developer Intern",
      company: "Fresh Electronic for Home Applications",
      period: "07/2025 – 08/2025",
      bullets: [
        "Built and tested responsive UI components for internal web applications using React and Tailwind CSS.",
        "Collaborated with senior developers to implement layouts and maintain UI consistency across projects.",
        "Applied frontend best practices in a real-world setting, contributing to UI consistency and code quality.",
      ],
    },
  ],

  education: [
    {
      degree: "Business Information System - C.S",
      institution: "Arab Academy for Science, Technology and Maritime Transport",
      period: "2022 – 2026",
    },
  ],

  certificates: [
    {
      name: "UI/UX Design Program",
      issuer: "National Telecommunication Institute (NTI)",
    },
  ],

  projects: [
    {
      name: "CarKit",
      subtitle: "AAST Graduation Project",
      description:
        "Egyptian automotive marketplace and services platform. Monorepo with 4 subprojects: React Native mobile app, Node/Express REST API (70+ endpoints), admin web portal, and driver/emergency portal.",
      period: "2025 – 2026",
    },
    {
      name: "Car Rental Landing Page",
      subtitle: "Responsive Frontend Web Project",
      description:
        "Responsive car rental landing page built with React and Tailwind CSS. Rebuilt and upgraded with Framer Motion animations as a hands-on motion design learning project.",
    },
    {
      name: "Pure Store",
      subtitle: "React E-Commerce App",
      description:
        "Fully functional e-commerce web app built with React. Features product listing, cart management, and a clean responsive UI.",
    },
    {
      name: "Workout & Diet App",
      subtitle: "UI/UX Case Study · NTI Graduation Project",
      description:
        "End-to-end UI/UX case study for a workout and diet mobile app. Covered user research, wireframing, prototyping, and high-fidelity Figma designs.",
    },
  ],

  impact: [
    "Shipped a graduation project with 4 integrated subprojects.",
    "Built 70+ REST API endpoints for a full-stack platform.",
    "Completed a professional UI/UX certification at NTI.",
  ],

  socials: [
    { label: "GitHub", href: "https://github.com/muuhamedhany" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/muuhammed-hany" },
    { label: "Instagram", href: "https://www.instagram.com/muuhamedhany/" },
  ],

  languages: [
    { label: "English", level: "Professional" },
    { label: "Arabic", level: "Native" },
  ],
};
