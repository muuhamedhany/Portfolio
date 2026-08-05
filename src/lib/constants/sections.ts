export type SectionId = "home" | "projects" | "about" | "contact";

export const SECTIONS: { id: SectionId; label: string; index: string }[] = [
  { id: "home", label: "HOME", index: "00" },
  { id: "projects", label: "PROJECTS", index: "01" },
  { id: "about", label: "ABOUT", index: "02" },
  { id: "contact", label: "CONTACT", index: "03" },
];
