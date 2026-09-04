import { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Mail, Phone, MapPin, Github, Linkedin, Instagram, FileText, Briefcase, GraduationCap, Award, Zap } from "lucide-react";
import { CV_DATA } from "@/lib/constants/cvData";

/* ─── Spring config (matches AdminLoginModal) ─── */
const SPRING = { type: "spring" as const, stiffness: 480, damping: 32 };

/* ─── Stagger variants (matches ProjectDialog) ─── */
const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.12,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const chipContainerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.03,
    },
  },
};

const chipVariants = {
  hidden: { opacity: 0, scale: 0.82 },
  show: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.24,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

/* ─── Sub-components ─── */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <h3 className="pixel-cv-section-label">{children}</h3>;
}

function SkillChips({ skills }: { skills: string[] }) {
  return (
    <motion.div
      variants={chipContainerVariants}
      initial="hidden"
      animate="show"
      className="flex flex-wrap gap-2"
    >
      {skills.map((skill) => (
        <motion.span key={skill} variants={chipVariants} className="pixel-cv-chip">
          {skill}
        </motion.span>
      ))}
    </motion.div>
  );
}

/* ─── Props ─── */
interface CvModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/* ─── Main Component ─── */
export function CvModal({ isOpen, onClose }: CvModalProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-2.5 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={SPRING}
            className="relative z-10 w-full max-w-3xl max-h-[90dvh] sm:max-h-[88vh] flex flex-col"
          >
            <div
              ref={scrollRef}
              className="pixel-cv-modal overflow-y-auto overflow-x-hidden overscroll-contain"
              style={{ maxHeight: "90dvh", WebkitOverflowScrolling: "touch" }}
            >
              {/* ── Header ── */}
              <div className="relative px-4 pt-4 pb-0 sm:px-8 sm:pt-7">
                {/* Top bar: label + close */}
                <div className="flex items-center justify-between mb-3 sm:mb-5">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" />
                    <span className="font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.18em]">
                      Fast Report
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={onClose}
                    className="pixel-cv-close"
                    aria-label="Close CV modal"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Name */}
                <motion.h1
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="font-display leading-[0.85] tracking-tight select-none"
                  style={{ fontSize: "clamp(1.8rem, 7vw, 4.2rem)" }}
                >
                  <span className="text-gradient">
                    {CV_DATA.name.split(" ").slice(0, -1).join(" ")}
                  </span>{" "}
                  <span className="text-foreground">
                    {CV_DATA.name.split(" ").slice(-1)[0]}
                  </span>
                </motion.h1>

                {/* Title */}
                <motion.p
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.45 }}
                  className="mt-2 font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.22em] text-primary font-bold"
                >
                  {CV_DATA.title}
                </motion.p>

                {/* Contact pills */}
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.45 }}
                  className="mt-2 sm:mt-3 flex flex-wrap items-center gap-x-3 sm:gap-x-4 gap-y-1 sm:gap-y-1.5 text-muted-foreground"
                >
                  <a
                    href={`mailto:${CV_DATA.email}`}
                    className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs hover:text-primary transition-colors cursor-pointer"
                  >
                    <Mail className="h-3 w-3 opacity-60" aria-hidden="true" />
                    {CV_DATA.email}
                  </a>
                  <a
                    href={`tel:${CV_DATA.phone}`}
                    className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs hover:text-primary transition-colors cursor-pointer"
                  >
                    <Phone className="h-3 w-3 opacity-60" aria-hidden="true" />
                    {CV_DATA.phone}
                  </a>
                  <span className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs">
                    <MapPin className="h-3 w-3 opacity-60" aria-hidden="true" />
                    {CV_DATA.location}
                  </span>
                </motion.div>
              </div>

              {/* ── Divider ── */}
              <div className="mx-4 sm:mx-8 mt-4 sm:mt-5 pixel-cv-divider" />

              {/* ── Two-column body ── */}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="px-4 sm:px-8 py-4 sm:py-6 grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] gap-x-8 gap-y-5 sm:gap-y-6"
              >
                {/* ═══ LEFT COLUMN ═══ */}
                <div className="flex flex-col gap-6">
                  {/* Overview */}
                  <motion.div variants={itemVariants}>
                    <SectionLabel>Overview</SectionLabel>
                    <p className="text-sm leading-relaxed text-foreground/90">
                      {CV_DATA.objective}
                    </p>
                  </motion.div>

                  {/* Experience */}
                  <motion.div variants={itemVariants}>
                    <SectionLabel>Experience</SectionLabel>
                    {CV_DATA.experience.map((exp) => (
                      <div key={exp.company} className="pixel-cv-exp-card">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div>
                            <h4 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                              <Briefcase className="h-3.5 w-3.5 text-primary shrink-0" aria-hidden="true" />
                              {exp.title}
                            </h4>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {exp.company}
                            </p>
                          </div>
                          <span className="shrink-0 font-mono text-[10px] uppercase tracking-wider text-primary border border-primary/30 px-2 py-0.5">
                            {exp.period}
                          </span>
                        </div>
                        <ul className="space-y-1.5">
                          {exp.bullets.map((b, i) => (
                            <li
                              key={i}
                              className="text-xs leading-relaxed text-foreground/80 pl-4 relative before:content-['▸'] before:absolute before:left-0 before:text-primary before:text-[10px]"
                            >
                              {b}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </motion.div>

                  {/* Education */}
                  <motion.div variants={itemVariants}>
                    <SectionLabel>Education</SectionLabel>
                    {CV_DATA.education.map((edu) => (
                      <div key={edu.institution} className="flex items-start gap-2">
                        <GraduationCap className="h-4 w-4 text-primary shrink-0 mt-0.5" aria-hidden="true" />
                        <div>
                          <h4 className="text-sm font-semibold text-foreground">{edu.degree}</h4>
                          <p className="text-xs text-muted-foreground">{edu.institution}</p>
                          <span className="font-mono text-[10px] uppercase tracking-wider text-primary">
                            {edu.period}
                          </span>
                        </div>
                      </div>
                    ))}
                  </motion.div>

                  {/* Certificates */}
                  <motion.div variants={itemVariants}>
                    <SectionLabel>Certificates</SectionLabel>
                    {CV_DATA.certificates.map((cert) => (
                      <div key={cert.name} className="flex items-start gap-2">
                        <Award className="h-4 w-4 text-primary shrink-0 mt-0.5" aria-hidden="true" />
                        <div>
                          <h4 className="text-sm font-semibold text-foreground">{cert.name}</h4>
                          <p className="text-xs text-muted-foreground">{cert.issuer}</p>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                </div>

                {/* ═══ RIGHT COLUMN ═══ */}
                <div className="flex flex-col gap-6">
                  {/* Stack */}
                  <motion.div variants={itemVariants}>
                    <SectionLabel>Stack</SectionLabel>
                    <div className="space-y-3">
                      {CV_DATA.skillGroups.map((group) => (
                        <div key={group.category}>
                          <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1.5">
                            {group.category}
                          </p>
                          <SkillChips skills={group.skills} />
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Impact */}
                  <motion.div variants={itemVariants}>
                    <SectionLabel>Impact</SectionLabel>
                    <ul className="space-y-2">
                      {CV_DATA.impact.map((line, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs leading-relaxed text-foreground/90">
                          <Zap className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" aria-hidden="true" />
                          <span>{line}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>

                  {/* Connect */}
                  <motion.div variants={itemVariants}>
                    <SectionLabel>Connect</SectionLabel>
                    <div className="space-y-2">
                      {CV_DATA.socials.map((social) => {
                        const IconComp =
                          social.label === "GitHub"
                            ? Github
                            : social.label === "LinkedIn"
                              ? Linkedin
                              : Instagram;
                        return (
                          <a
                            key={social.label}
                            href={social.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2.5 text-sm text-foreground hover:text-primary transition-colors duration-150 group"
                          >
                            <span className="flex items-center justify-center w-8 h-8 border border-border bg-background group-hover:border-primary/40 transition-colors duration-150"
                              style={{
                                boxShadow: "inset 1px 1px 0 var(--pixel-edge-light), inset -1px -1px 0 var(--pixel-edge-dark)",
                              }}
                            >
                              <IconComp className="h-3.5 w-3.5" aria-hidden="true" />
                            </span>
                            <span className="font-medium">{social.label}</span>
                          </a>
                        );
                      })}
                    </div>
                  </motion.div>

                  {/* Languages */}
                  <motion.div variants={itemVariants}>
                    <SectionLabel>Languages</SectionLabel>
                    <div className="flex items-center gap-3 flex-wrap">
                      {CV_DATA.languages.map((lang, i) => (
                        <span key={lang.label} className="flex items-center gap-1.5">
                          <span className="font-mono text-xs uppercase tracking-wider font-bold text-foreground">
                            {lang.label}
                          </span>
                          <span className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider">
                            ({lang.level})
                          </span>
                          {i < CV_DATA.languages.length - 1 && (
                            <span className="text-muted-foreground/40 ml-1.5">·</span>
                          )}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              {/* ── Footer ── */}
              <div className="mx-4 sm:mx-8 pixel-cv-divider" />
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.4 }}
                className="px-4 sm:px-8 py-3.5 sm:py-4 space-y-1.5"
              >
                <p className="pixel-cv-footer">
                  Engineered with precision using React & Tailwind
                </p>
                <p className="pixel-cv-footer">
                  © {new Date().getFullYear()} {CV_DATA.name}
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
