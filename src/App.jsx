import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Github, Linkedin, Mail, ArrowRight, ExternalLink, Code2, Download, Sparkles } from "lucide-react";

const PROFILE_PHOTO = "https://tse1.mm.bing.net/th/id/OIP.HKADtOXN2thLHouCqmvbNwHaFX?cb=ucfimgc2&rs=1&pid=ImgDetMain&o=7&rm=3";
const LINKS = {
  github: "https://github.com/ashishksdev",
  linkedin: "https://www.linkedin.com/in/",
  email: "mailto:ashishks.dev@gmail.com",
  resume: "#"
};

const SKILLS = [
  { title: "Languages", items: ["Java", "JavaScript", "TypeScript"] },
  { title: "Frontend", items: ["React", "TailwindCSS", "Framer Motion"] },
  { title: "Backend", items: ["Spring Boot", "Node.js", "REST APIs"] },
  { title: "Tools", items: ["Git", "GitHub Actions", "Vite"] },
];

const PROJECTS = [
  { title: "Clean Blog", about: "A markdown-first blog with dark/light mode and instant search.", stack: ["React", "Vite", "Tailwind"], links: { demo: "#", code: "#" } },
  { title: "AlgoViz", about: "An interactive DSA visualizer for algorithms and data structures.", stack: ["TypeScript", "React", "Framer Motion"], links: { demo: "#", code: "#" } },
  { title: "Open Source Contributions", about: "Collaborations, documentation improvements, and CI workflows.", stack: ["Git", "Community", "Docs"], links: { demo: "#", code: "https://github.com/ashishksdev" } },
];

// --- Nav setup
const SECTIONS = ["home", "about", "skills", "projects", "contact"];
const NAV_HEIGHT = 72; // px

// --- Motion variants
const revealUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export default function Portfolio() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, -100]);
  const y2 = useTransform(scrollY, [0, 500], [0, -50]);

  const [active, setActive] = useState("home");
  const scrollingTo = useRef(null); // prevents highlight jitter during smooth scroll

  const getYOffset = () => NAV_HEIGHT + 8; // offset for sticky nav

  const computeActive = useCallback(() => {
    const offsetY = getYOffset();
    const scrollPos = window.scrollY + offsetY + 1; // +1 to bias toward current section
    // If we're at/near the bottom of the page, force last section active
    const doc = document.documentElement;
    const nearBottom = window.innerHeight + window.scrollY >= doc.scrollHeight - 4;
    if (nearBottom) return "contact";

    let current = "home";
    for (const id of SECTIONS) {
      const el = document.getElementById(id);
      if (!el) continue;
      const top = el.offsetTop; // relative to document
      if (scrollPos >= top) current = id; else break;
    }
    return current;
  }, []);

  useEffect(() => {
    // Set initial active correctly on load
    setActive(computeActive());

    let raf = 0;
    const onScroll = () => {
      if (scrollingTo.current) return; // lock while programmatic scroll occurs
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setActive(computeActive()));
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [computeActive]);

  const scrollToId = useCallback((id) => (e) => {
    e?.preventDefault?.();
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - getYOffset();
    scrollingTo.current = id; // lock highlight
    setActive(id);
    window.scrollTo({ top, behavior: "smooth" });

    const release = () => {
      const near = Math.abs(window.scrollY - top) < 4; // within 4px
      if (near) {
        scrollingTo.current = null;
        window.removeEventListener("scroll", release);
        setActive(computeActive());
      }
    };
    window.addEventListener("scroll", release, { passive: true });
  }, [computeActive]);

  return (
    <main className="min-h-screen w-full text-white bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 selection:bg-indigo-500/30 selection:text-white scroll-smooth overflow-x-clip">
      {/* Background Lights */}
      <motion.div style={{ y: y1 }} className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <motion.div
          className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.12),transparent_70%)] rounded-full"
          animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-[-15%] right-[-15%] w-[70vw] h-[70vw] bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.1),transparent_70%)] rounded-full"
          animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      {/* Navbar */}
      <header className="sticky top-0 z-30 backdrop-blur bg-slate-950/60 border-b border-indigo-900/30">
        <nav className="mx-auto max-w-[90rem] px-12 py-3 grid grid-cols-[auto_1fr_auto] items-center" style={{ height: NAV_HEIGHT }}>
          <a href="#home" onClick={scrollToId("home")} className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-indigo-400 animate-pulse" />
            <span className="text-base font-medium text-white/80 hover:text-white transition">Ashish</span>
          </a>

          <ul className="hidden md:flex justify-center items-center space-x-10 text-sm font-semibold text-white/70 relative">
            {SECTIONS.map((sec) => (
              <li key={sec} className="relative">
                <a
                  href={`#${sec}`}
                  onClick={scrollToId(sec)}
                  className={`transition-colors ${active === sec ? "text-white" : "hover:text-white/90"}`}
                >
                  {sec.charAt(0).toUpperCase() + sec.slice(1)}
                </a>
                {active === sec && (
                  <motion.div
                    layoutId="navGlow"
                    className="absolute -bottom-1 left-0 h-[3px] w-full rounded-full bg-gradient-to-r from-indigo-400/80 to-fuchsia-400/70 blur-[3px]"
                    transition={{ type: "spring", stiffness: 120, damping: 15 }}
                  />
                )}
              </li>
            ))}
          </ul>

          <div className="flex justify-end">
            <a href={LINKS.resume} className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-white/10 border border-white/10 hover:border-indigo-400/30 hover:text-indigo-200 transition">
              <Download className="h-4 w-4" /> Resume
            </a>
          </div>
        </nav>
      </header>

      {/* HERO */}
      <section id="home" className="relative mx-auto max-w-[90rem] px-12 pt-28 pb-20 flex flex-col md:flex-row items-center justify-between gap-20">
        <motion.div style={{ y: y2 }} className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.08),transparent_60%)] animate-[pulse_8s_infinite]" />

        <motion.div variants={revealUp} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} className="flex-1 flex flex-col justify-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs text-white/70">
            <Sparkles className="h-3.5 w-3.5 text-indigo-400" /> Open Source • Java • React
          </div>
          <h1 className="mt-5 text-5xl sm:text-7xl font-semibold leading-tight text-white tracking-tight">
            Hi, I’m <span className="text-indigo-300 font-bold">Ashish Singh</span>
          </h1>
          <p className="mt-6 max-w-2xl text-white/70 text-lg leading-relaxed">
            I build clean, thoughtful software — focusing on clarity, performance, and a sprinkle of creativity. Passionate about open-source, elegant architecture, and growing as an engineer.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a href="#projects" onClick={scrollToId("projects")} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-500/80 hover:bg-indigo-500 transition text-sm font-medium">
              View Projects <ArrowRight className="h-4 w-4" />
            </a>
            <a href="#contact" onClick={scrollToId("contact")} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition text-sm font-medium">
              Contact Me <Mail className="h-4 w-4" />
            </a>
          </div>
        </motion.div>

        <motion.div variants={revealUp} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} className="flex-1 flex justify-end items-center">
          <div className="relative">
            <motion.div style={{ y: y2 }} className="pointer-events-none absolute -inset-10 rounded-full bg-gradient-to-tr from-indigo-500/20 to-fuchsia-500/10 blur-3xl animate-[pulse_10s_infinite]" />
            <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 150 }} className="relative h-64 w-64 sm:h-80 sm:w-80 rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_60px_-15px_rgba(99,102,241,0.5)]">
              <img src={PROFILE_PHOTO} alt="Ashish Singh" className="h-full w-full object-cover" />
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ABOUT */}
      <motion.section id="about" variants={revealUp} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="mx-auto max-w-[90rem] px-12 py-20 border-t border-white/10">
        <h2 className="text-3xl font-semibold text-white mb-4">About Me</h2>
        <p className="text-white/70 leading-relaxed max-w-3xl">
          I’m a developer who thrives on simplicity — solving problems thoughtfully, and writing code that speaks clearly. I enjoy blending backend precision with frontend creativity, and believe that small consistent efforts build remarkable things.
        </p>
      </motion.section>

      {/* SKILLS */}
      <motion.section id="skills" variants={revealUp} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="mx-auto max-w-[90rem] px-12 py-20 border-t border-white/10">
        <h2 className="text-3xl font-semibold text-white mb-10">Skills & Tools</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SKILLS.map((s) => (
            <motion.div key={s.title} variants={revealUp} className="rounded-2xl p-4 bg-white/5 border border-white/10 hover:border-indigo-400/30 transition">
              <div className="flex items-center gap-2 text-white/90 font-medium"><Code2 className="h-4 w-4 text-indigo-400" /> {s.title}</div>
              <ul className="mt-3 flex flex-wrap gap-2">
                {s.items.map((i) => (
                  <li key={i} className="text-xs text-white/80 px-2 py-1 rounded-lg bg-black/30 border border-white/10">{i}</li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* PROJECTS */}
      <motion.section id="projects" variants={revealUp} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="mx-auto max-w-[90rem] px-12 py-20 border-t border-white/10">
        <h2 className="text-3xl font-semibold text-white mb-10">Projects</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROJECTS.map((p) => (
            <motion.div key={p.title} variants={revealUp} className="rounded-2xl p-5 bg-white/5 border border-white/10 hover:border-indigo-400/30 transition flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-medium text-white mb-2">{p.title}</h3>
                <p className="text-white/70 text-sm mb-3">{p.about}</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {p.stack.map((t) => (
                    <span key={t} className="text-[11px] px-2 py-1 rounded bg-black/30 border border-white/10 text-white/80">{t}</span>
                  ))}
                </div>
              </div>
              <div className="flex gap-4 text-sm">
                <a href={p.links.demo} className="text-indigo-300 hover:text-indigo-200 flex items-center gap-1 transition">
                  Demo <ExternalLink className="h-3.5 w-3.5" />
                </a>
                <a href={p.links.code} className="text-indigo-300 hover:text-indigo-200 flex items-center gap-1 transition">
                  Code <Github className="h-3.5 w-3.5" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* CONTACT */}
      <motion.section id="contact" variants={revealUp} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="mx-auto max-w-[90rem] px-12 py-20 border-t border-white/10 text-center">
        <h2 className="text-3xl font-semibold text-white mb-4">Let’s Connect</h2>
        <p className="text-white/70 mb-6 max-w-2xl mx-auto">
          Always open to collaboration, new ideas, or helping others grow. Feel free to reach out — I’d love to chat.
        </p>
        <div className="flex justify-center gap-4">
          <a href={LINKS.github} className="p-3 rounded-lg bg-white/5 border border-white/10 hover:border-indigo-400/30 transition"><Github className="h-5 w-5 text-indigo-300" /></a>
          <a href={LINKS.linkedin} className="p-3 rounded-lg bg-white/5 border border-white/10 hover:border-indigo-400/30 transition"><Linkedin className="h-5 w-5 text-indigo-300" /></a>
          <a href={LINKS.email} className="p-3 rounded-lg bg-white/5 border border-white/10 hover:border-indigo-400/30 transition"><Mail className="h-5 w-5 text-indigo-300" /></a>
        </div>
      </motion.section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 py-8 text-center text-xs text-white/60">
        © {new Date().getFullYear()} Ashish Singh — Designed & Built with React, Tailwind & Motion
      </footer>
    </main>
  );
}
