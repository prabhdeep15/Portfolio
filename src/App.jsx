import { useEffect, useMemo, useRef, useState } from "react";

const PROFILE_IMAGE = `${import.meta.env.BASE_URL}profile-plain-bg.png`;

/** Full URL to your blog (Medium, Dev.to, Hashnode, etc.). Same URL as `BLOG_REDIRECT_TARGET` in `public/blog/index.html` for `/blog/` redirects. */
const BLOG_URL = "https://hashnode.com/@Prabhdeep15/";

const THEMES = ["winter", "spring", "summer", "autumn"];

const SECTION_ITEMS = [
  { id: "home", label: "home" },
  { id: "skills", label: "skills" },
  { id: "experience", label: "experience" },
  { id: "education", label: "education" },
  { id: "terminal", label: "terminal" },
];

const PARTICLE_CONFIG = {
  winter: { count: 80, colors: ["#ffffff", "#f8f9fa", "#f1f5f9"], glyphs: ["❄️", "·"], sizeMultiplier: 1.8 },
  spring: { count: 35, colors: ["#e89aaa", "#f4b8c4", "#ffd8e0"], glyphs: ["🌸", "✿", "❀", "·"], sizeMultiplier: 1.2 },
  summer: { count: 0, colors: ["#fff5b8", "#ffd966", "#ffb347"], glyphs: ["☀️"], sizeMultiplier: 1 },
  autumn: { count: 24, colors: ["#d4844a", "#f0a870", "#ffd1a6"], glyphs: ["🍁", "·"], sizeMultiplier: 1.2 },
  night: { count: 30, colors: ["#9b8fd4", "#c0b4f0", "#e0d8f8"], glyphs: ["★", "·"], sizeMultiplier: 1 },
};

const TYPE_PHRASES = [
  "build things for the web.",
  "write clean, readable code.",
  "turn ideas into products.",
  "collaborate on new projects.",
  "learn new things.",
];

const TERMINAL_BOOT_LINES = [
  { id: "boot-bar-top", cls: "t-comment", html: "##############################################" },
  { id: "boot-welcome", cls: "t-comment", html: "#  welcome to prabhdeep.singh terminal      #" },
  { id: "boot-help", cls: "t-comment", html: '#  type <span class="t-key">help</span> for commands               #' },
  { id: "boot-bar-bot", cls: "t-comment", html: "##############################################" },
  { id: "boot-blank", cls: "t-blank", html: "&nbsp;" },
];

function buildParticles(theme) {
  const cfg = PARTICLE_CONFIG[theme];
  return Array.from({ length: cfg.count }, (_, i) => ({
    id: `${theme}-${i}-${Math.random().toString(36).slice(2, 11)}`,
    glyph: cfg.glyphs[Math.floor(Math.random() * cfg.glyphs.length)],
    color: cfg.colors[Math.floor(Math.random() * cfg.colors.length)],
    size: (8 + Math.random() * 10) * (cfg.sizeMultiplier || 1),
    left: Math.random() * 100,
    duration: 9 + Math.random() * 12,
    delay: -Math.random() * 12,
  }));
}

const DATA = {
  about: {
    name: "Prabhdeep Singh",
    title: "Software Engineer",
    location: "Bengaluru, IN",
    company: "Sopra Steria",
    email: "prabhdeepsinghswe@gmail.com",
    status: "open to new opportunities",
    bio: "Software Engineer with 1.5+ years of experience building scalable, reliable systems.",
  },
  socials: [
    {
      name: "GitHub",
      url: "https://github.com/prabhdeep15",
      handle: "@prabhdeep15",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg",
      invertOnDark: true,
    },
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/prabhdeep15/",
      handle: "@prabhdeep15",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linkedin/linkedin-original.svg",
    },
    {
      name: "LeetCode",
      url: "https://leetcode.com/u/prabhdeep15/",
      handle: "@prabhdeep15",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/leetcode/leetcode-original.svg",
    },
    {
      name: "Email",
      url: "mailto:prabhdeepsinghswe@gmail.com",
      handle: "prabhdeepsinghswe@gmail.com",
      icon: "https://upload.wikimedia.org/wikipedia/commons/7/7e/Gmail_icon_%282020%29.svg",
    },
    {
      name: "Blog",
      handle: "Read my blog",
      iconKind: "blog",
    },
  ],
  education: [
    {
      degree: "Bachelor of Technology in Computer Science and Engineering",
      institution: "Graphic Era University, Dehradun, Uttarakhand",
      period: "2020 — 2024",
      details:
        "CGPA: 8.19. Coursework in Data Structures, Algorithms, DBMS, Operating Systems, and Computer Networks.",
    },
    {
      degree: "High School",
      institution: "Air Force School, Ambala, Haryana",
      period: "2017 — 2020",
      details: "Class 12th — 86.6%; Class 10th — 82%.",
    },
  ],
  skills: {
    languages: [
      { name: "Java", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" },
      { name: "C++", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg" },
      { name: "SQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" },
      { name: "JavaScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
      { name: "HTML", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" },
      { name: "CSS", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" },
    ],
    frameworks: [
      { name: "React", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
      { name: "Spring Boot", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg" },
      { name: "JUnit", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/junit/junit-original.svg" },
    ],
    tools: [
      { name: "Git", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" },
      { name: "Docker", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" },
      { name: "AWS", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg" },
      { name: "VS Code", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg" },
      { name: "Figma", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg" },
      { name: "Postman", icon: "https://www.vectorlogo.zone/logos/getpostman/getpostman-icon.svg" },
    ],
  },
  experience: [
    {
      role: "Software Engineer",
      company: "Sopra Steria",
      period: "Nov 2024 — Present",
      points: [
        "Working on a Buyer Furnished Equipment Management System for Airbus, handling equipment and order workflows in a production environment.",
        "Built and improved backend APIs and optimized SQL queries, improving data retrieval time by ~15% for key operations.",
        "Developed and maintained reusable React components to enhance UI consistency and improve user experience.",
        "Contributed to feature development and bug fixes as part of an agile team.",
        "Gained hands-on experience working with real-world enterprise systems and production data.",
      ],
      stack: ["Java", "Spring Boot", "React", "SQL", "REST APIs", "Agile"],
    },
  ],
};

function App() {
  const [theme, setTheme] = useState("night");
  const [activeSection, setActiveSection] = useState("home");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [terminalLines, setTerminalLines] = useState(() => TERMINAL_BOOT_LINES.map((row) => ({ ...row })));
  const [inputValue, setInputValue] = useState("");
  const [history, setHistory] = useState([]);
  const [historyIdx, setHistoryIdx] = useState(-1);

  const inputRef = useRef(null);
  const terminalBodyRef = useRef(null);
  const terminalLineIdRef = useRef(0);

  const particles = useMemo(() => buildParticles(theme), [theme]);

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    let phraseIdx = 0;
    let charIdx = 0;
    let deleting = false;
    let timer;

    const tick = () => {
      const phrase = TYPE_PHRASES[phraseIdx];
      if (!deleting) {
        charIdx += 1;
        setTypedText(phrase.slice(0, charIdx));
        if (charIdx === phrase.length) {
          deleting = true;
          timer = window.setTimeout(tick, 1500);
          return;
        }
        timer = window.setTimeout(tick, 70);
        return;
      }

      charIdx -= 1;
      setTypedText(phrase.slice(0, charIdx));
      if (charIdx === 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % TYPE_PHRASES.length;
      }
      timer = window.setTimeout(tick, 40);
    };

    tick();
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("in");
        });
      },
      { threshold: 0.12 }
    );

    document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const top = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (top?.target?.id) setActiveSection(top.target.id);
      },
      { threshold: [0.1, 0.25, 0.5, 0.75], rootMargin: "-10% 0px -40% 0px" }
    );

    SECTION_ITEMS.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) sectionObserver.observe(el);
    });

    return () => {
      revealObserver.disconnect();
      sectionObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    const body = terminalBodyRef.current;
    if (body) body.scrollTop = body.scrollHeight;
  }, [terminalLines]);

  useEffect(() => {
    if (!isMenuOpen) return undefined;
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    if (!isMobile) return undefined;

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => {
      if (e.key === "Escape") setIsMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 768px)");
    const sync = (e) => {
      if (!e.matches) setIsMenuOpen(false);
    };
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  const pushLine = (html, cls = "t-out") => {
    setTerminalLines((prev) => [...prev, { id: `out-${terminalLineIdRef.current++}`, cls, html }]);
  };

  const runCommand = (raw) => {
    const command = raw.trim();
    if (!command) return;

    setHistory((prev) => [command, ...prev]);
    setHistoryIdx(-1);
    pushLine(`<span class="t-prompt">guest@portfolio:~$</span> <span class="t-cmd">${command}</span>`);

    const [cmd, ...args] = command.toLowerCase().split(/\s+/);

    if (cmd === "help") {
      pushLine('&nbsp;', "t-blank");
      pushLine('<span class="t-acc">available:</span> help, about, experience, skills, contact, theme, clear');
      pushLine('&nbsp;', "t-blank");
      return;
    }

    if (cmd === "about") {
      pushLine(`name: <span class="t-val">${DATA.about.name}</span>`);
      pushLine(`title: <span class="t-val">${DATA.about.title}</span>`);
      pushLine(`company: <span class="t-val">${DATA.about.company}</span>`);
      pushLine(`location: <span class="t-val">${DATA.about.location}</span>`);
      pushLine(`status: <span class="t-val">${DATA.about.status}</span>`);
      pushLine(`bio: <span class="t-dim">${DATA.about.bio}</span>`);
      pushLine('&nbsp;', "t-blank");
      return;
    }

    if (cmd === "experience") {
      DATA.experience.forEach((job) => {
        pushLine(`<span class="t-key">◈ ${job.role}</span> <span class="t-dim">@ ${job.company}</span>`);
        pushLine(`<span class="t-dim">${job.period}</span>`);
        job.points.forEach((point) => {
          pushLine(`  <span class="t-acc">›</span> <span class="t-dim">${point}</span>`);
        });
      });
      pushLine('&nbsp;', "t-blank");
      return;
    }

    if (cmd === "skills") {
      pushLine(`languages: <span class="t-val">${DATA.skills.languages.map((s) => s.name).join(", ")}</span>`);
      pushLine(`frameworks: <span class="t-val">${DATA.skills.frameworks.map((s) => s.name).join(", ")}</span>`);
      pushLine(`tools: <span class="t-val">${DATA.skills.tools.map((s) => s.name).join(", ")}</span>`);
      pushLine('&nbsp;', "t-blank");
      return;
    }

    if (cmd === "contact") {
      pushLine(`email: <span class="t-val">${DATA.about.email}</span>`);
      pushLine(`status: <span class="t-val">${DATA.about.status}</span>`);
      pushLine('&nbsp;', "t-blank");
      return;
    }

    if (cmd === "theme") {
      const requested = args[0];
      if (!requested || !THEMES.includes(requested)) {
        pushLine(`themes: ${THEMES.join(" · ")}`, "t-dim");
        pushLine('&nbsp;', "t-blank");
        return;
      }
      setTheme(requested);
      pushLine(`theme switched to <span class="t-val">${requested}</span>`);
      pushLine('&nbsp;', "t-blank");
      return;
    }

    if (cmd === "clear") {
      terminalLineIdRef.current = 0;
      setTerminalLines([]);
      return;
    }

    pushLine(`command not found: ${cmd}`, "t-err");
    pushLine('type <span class="t-key">help</span> for available commands', "t-dim");
    pushLine('&nbsp;', "t-blank");
  };

  const handleTerminalKeyDown = (e) => {
    if (e.key === "Enter") {
      runCommand(inputValue);
      setInputValue("");
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!history.length) return;
      const next = Math.min(historyIdx + 1, history.length - 1);
      setHistoryIdx(next);
      setInputValue(history[next] ?? "");
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!history.length) return;
      const next = Math.max(historyIdx - 1, -1);
      setHistoryIdx(next);
      setInputValue(next === -1 ? "" : history[next] ?? "");
      return;
    }

    if (e.key === "Tab") {
      e.preventDefault();
      const partial = inputValue.toLowerCase();
      const matched = ["help", "about", "experience", "skills", "contact", "theme", "clear"].find((x) =>
        x.startsWith(partial)
      );
      if (matched) setInputValue(matched);
      return;
    }
  };

  return (
    <>
      <div className="season-deco" aria-hidden>
        {particles.map((p) => (
          <span
            key={p.id}
            className="particle"
            style={{
              left: `${p.left}vw`,
              color: p.color,
              fontSize: `${p.size}px`,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
            }}
          >
            {p.glyph}
          </span>
        ))}
      </div>

      <nav className="topbar">
        <div className="topbar-desktop">
          <span className="section-header">sections</span>
          <ul className="section-bar">
            {SECTION_ITEMS.map((item) => (
              <li key={item.id}>
                <a className={`section-pill ${activeSection === item.id ? "active" : ""}`} href={`#${item.id}`}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="section-theme">
            <span className="section-header">theme</span>
            <div className="themes">
              {THEMES.map((t) => (
                <button
                  key={t}
                  type="button"
                  title={t}
                  className={`theme-btn ${t === theme ? "active" : ""}`}
                  data-t={t}
                  onClick={() => setTheme(t)}
                >
                  {t === "winter" && "☃️"}
                  {t === "spring" && "🌸"}
                  {t === "summer" && "☀️"}
                  {t === "autumn" && "🍁"}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button className="menu-toggle" type="button" aria-label="Open menu" onClick={() => setIsMenuOpen((v) => !v)}>
          <span />
          <span />
          <span />
        </button>
      </nav>

      <div className={`mobile-menu ${isMenuOpen ? "open" : ""}`}>
        <div className="mobile-menu-head">
          <p>menu</p>
          <button type="button" className="mobile-menu-close" onClick={() => setIsMenuOpen(false)} aria-label="Close menu">
            ×
          </button>
        </div>
        <ul className="mobile-menu-links">
          {SECTION_ITEMS.map((item) => (
            <li key={item.id}>
              <a href={`#${item.id}`} className={activeSection === item.id ? "active" : ""} onClick={() => setIsMenuOpen(false)}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="mobile-menu-theme">
          <p>theme</p>
          <div className="themes">
            {THEMES.map((t) => (
              <button
                key={t}
                type="button"
                title={t}
                className={`theme-btn ${t === theme ? "active" : ""}`}
                data-t={t}
                onClick={() => setTheme(t)}
              >
                {t === "winter" && "☃️"}
                {t === "spring" && "🌸"}
                {t === "summer" && "☀️"}
                {t === "autumn" && "🍁"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <section className="hero" id="home">
        <div className="hero-layout">
          <div className="hero-copy">
            <p className="hero-prompt">
              <span>›</span> home
            </p>
            <h1 className="hero-name">
              I am Prabhdeep <span className="acc">Singh</span>
            </h1>
            <div className="hero-photo-wrap hero-photo-wrap-mobile">
              <img className="hero-photo" src={PROFILE_IMAGE} alt="Prabhdeep Singh portrait" />
            </div>
            <p className="type-line">
              I love to <span className="acc">{typedText}</span>
              <span className="caret" />
            </p>
            <p className="hero-bio">
              I am a Software Engineer with <span className="acc">1.5+ years</span> of experience, currently working at{" "}
              <span className="acc">Sopra Steria</span>, where I contribute to building scalable and reliable systems.
            </p>
            <p className="hero-bio">
              I enjoy solving complex problems and writing clean, efficient, and maintainable code. With a strong foundation in Data Structures and Algorithms, I focus on creating products that are both robust and user-friendly.
            </p>
            <p className="hero-bio">
              Currently open to new opportunities and meaningful challenges.
            </p>
            <div className="hero-connect">
              <p className="hero-connect-label">Let&apos;s connect</p>
              <div className="hero-socials">
                {DATA.socials.map((social) => {
                  const isBlog = social.iconKind === "blog";
                  const blogHref = BLOG_URL.trim();
                  const href = isBlog ? blogHref : social.url;
                  const isExternal = typeof href === "string" && href.startsWith("http");
                  const blogPending = isBlog && !blogHref;
                  const linkClass = `social-link ${social.invertOnDark ? "invert-icon" : ""}${blogPending ? " social-link-pending" : ""}`;
                  const inner = (
                    <>
                      {isBlog ? (
                        <i className="fa-brands fa-hashnode social-link-fa-icon" aria-hidden />
                      ) : (
                        <img src={social.icon} alt={social.name} loading="lazy" />
                      )}
                      <span>{social.name}</span>
                    </>
                  );
                  if (blogPending) {
                    return (
                      <span key={social.name} className={linkClass} title="Set BLOG_URL in App.jsx to link your blog">
                        {inner}
                      </span>
                    );
                  }
                  return (
                    <a
                      key={social.name}
                      href={href}
                      target={isExternal ? "_blank" : undefined}
                      rel={isExternal ? "noopener noreferrer" : undefined}
                      className={linkClass}
                      title={social.handle}
                    >
                      {inner}
                    </a>
                  );
                })}
              </div>
            </div>
            <div className="hero-meta hero-meta-bottom" aria-label="Location">
              <div>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                <span>{DATA.about.location}</span>
              </div>
            </div>
          </div>
          <div className="hero-photo-wrap hero-photo-wrap-desktop">
            <img className="hero-photo" src={PROFILE_IMAGE} alt="Prabhdeep Singh portrait" />
          </div>
        </div>
      </section>

      <section className="section reveal" id="skills">
        <div className="section-inner">
          <div className="section-head">
            <div className="section-title">skills &amp; stack</div>
          </div>
          <div className="skills-grid">
            <div className="skill-group">
              <div className="skill-group-name">languages</div>
              <div className="skill-icons">
                {DATA.skills.languages.map((s) => (
                  <div className="skill-chip" key={s.name}>
                    <img src={s.icon} alt={s.name} loading="lazy" />
                    <span>{s.name}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="skill-group">
              <div className="skill-group-name">frameworks &amp; libraries</div>
              <div className="skill-icons">
                {DATA.skills.frameworks.map((s) => (
                  <div className="skill-chip" key={s.name}>
                    <img src={s.icon} alt={s.name} loading="lazy" />
                    <span>{s.name}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="skill-group">
              <div className="skill-group-name">tools</div>
              <div className="skill-icons">
                {DATA.skills.tools.map((s) => (
                  <div className="skill-chip" key={s.name}>
                    <img src={s.icon} alt={s.name} loading="lazy" />
                    <span>{s.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section reveal" id="experience">
        <div className="section-inner">
          <div className="section-head">
            <div className="section-title">experience</div>
          </div>
          <div className="experience-list">
            {DATA.experience.map((job) => (
              <article className="experience-item" key={`${job.company}-${job.period}`}>
                <div className="experience-card-head">
                  <h3 className="experience-role">{job.role}</h3>
                  <span className="experience-period-badge">{job.period}</span>
                </div>
                <p className="experience-org">{job.company}</p>
                <ul className="experience-points">
                  {job.points.map((point, idx) => (
                    <li key={`${job.company}-${job.period}-${idx}`}>{point}</li>
                  ))}
                </ul>
                <div className="project-stack">
                  {job.stack.map((item) => (
                    <span key={item} className="stack-tag">
                      {item}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section reveal" id="education">
        <div className="section-inner">
          <div className="section-head">
            <div className="section-title">education</div>
          </div>
          <div className="experience-list">
            {DATA.education.map((edu) => (
              <article className="experience-item" key={edu.degree}>
                <div className="experience-card-head">
                  <h3 className="experience-role">{edu.degree}</h3>
                  <span className="experience-period-badge">{edu.period}</span>
                </div>
                <p className="experience-org">{edu.institution}</p>
                <p className="experience-desc">{edu.details}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="terminal-wrap" id="terminal">
        <div className="section-inner">
          <div className="section-head reveal" style={{ paddingBottom: "1.5rem" }}>
            <div className="section-title">interactive terminal</div>
          </div>
          <div className="terminal reveal" onClick={() => inputRef.current?.focus()}>
            <div className="terminal-titlebar">
              <div className="tbar-dot red" />
              <div className="tbar-dot yel" />
              <div className="tbar-dot grn" />
              <div className="tbar-title">guest@portfolio — bash</div>
            </div>
            <div className="terminal-body" ref={terminalBodyRef}>
              {terminalLines.map((line) => (
                <div key={line.id} className={`t-line ${line.cls}`} dangerouslySetInnerHTML={{ __html: line.html }} />
              ))}
            </div>
            <div className="terminal-input-row">
              <span className="t-input-prompt">guest@portfolio:~$&nbsp;</span>
              <input
                ref={inputRef}
                className="t-input"
                type="text"
                placeholder="type a command..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleTerminalKeyDown}
                autoComplete="off"
                spellCheck="false"
              />
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div>
          built by <span>Prabhdeep Singh</span> · 2026
        </div>
        <div>
          theme: <span>{theme}</span>
        </div>
      </footer>
    </>
  );
}

export default App;
