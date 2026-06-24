import { ArrowUpRight, Github, Linkedin, Mail } from "lucide-react";
import { Reveal } from "./Reveal";

// Update these with your real handles.
const CONTACTS = [
  { label: "Email", value: "muuhamedhany@gmail.com", href: "mailto:muuhamedhany@gmail.com", icon: Mail },
  { label: "LinkedIn", value: "in/muuhammed-hany", href: "https://www.linkedin.com/in/muuhammed-hany", icon: Linkedin },
  { label: "GitHub", value: "muuhamedhany", href: "https://github.com/muuhamedhany", icon: Github },
];

export function Contact() {
  return (
    <section className="scanlines relative">
      <div className="mx-auto flex min-h-svh max-w-6xl flex-col justify-center px-5 pb-28 pt-24 sm:px-8 sm:pb-24">
        <Reveal>
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">03 / Contact</span>
          <h2
            className="mt-5 font-display leading-[0.95] tracking-normal"
            style={{ fontSize: "clamp(2.5rem, 9vw, 6rem)", fontWeight: 700 }}
          >
            Let's build <span className="text-gradient">something!</span>
          </h2>
        </Reveal>

        <div className="mt-12 max-w-2xl divide-y divide-border border-y border-border">
          {CONTACTS.map((c, i) => {
            const Icon = c.icon;
            return (
              <Reveal key={c.label} delay={i * 0.06}>
                <a
                  href={c.href}
                  target={c.href.startsWith("mailto") ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between gap-4 py-5 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <Icon className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-[var(--accent-to)]" />
                    <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">{c.label}</span>
                    <span className="text-base text-foreground transition-colors group-hover:text-gradient sm:text-lg">
                      {c.value}
                    </span>
                  </div>
                  <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--accent-to)]" />
                </a>
              </Reveal>
            );
          })}
        </div>

        <footer className="mt-16 flex flex-col gap-2 font-mono text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} m<span className="text-gradient">uu</span>hamedhany</span>
          <span>Cairo, Egypt</span>
        </footer>
      </div>
    </section>
  );
}
