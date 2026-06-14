export type SectionId = "home" | "projects" | "skills" | "contact";

export const SECTIONS: { id: SectionId; label: string; index: string }[] = [
  { id: "home", label: "Home", index: "00" },
  { id: "projects", label: "Projects", index: "01" },
  { id: "skills", label: "Skills", index: "02" },
  { id: "contact", label: "Contact", index: "03" },
];
