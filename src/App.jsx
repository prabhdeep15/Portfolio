import { useEffect, useMemo, useRef, useState } from "react";

const PROFILE_IMAGE = "/profile-plain-bg.png";
const THEMES = ["winter", "spring", "summer", "autumn", "night", "sakura"];
const SECTION_ITEMS = [
  { id: "home", label: "home" },
  { id: "about", label: "about" },
  { id: "section", label: "section" },
  { id: "projects", label: "projects" },
  { id: "terminal", label: "interactive terminal" },
];

const PARTICLE_CONFIG = {
  winter: { count: 26, colors: ["#7eb8d4", "#a8d8ea", "#d2e9f5"], glyphs: ["❄", "·"] },
  spring: { count: 22, colors: ["#d4a373", "#f4c89a", "#f8dec0"], glyphs: ["✿", "·"] },
  summer: { count: 18, colors: ["#a8cc68", "#c8e888", "#dff5a8"], glyphs: ["★", "·"] },
  autumn: { count: 24, colors: ["#d4844a", "#f0a870", "#ffd1a6"], glyphs: ["🍁", "·"] },
  night: { count: 30, colors: ["#9b8fd4", "#c0b4f0", "#e0d8f8"], glyphs: ["★", "·"] },
  sakura: { count: 28, colors: ["#e89aaa", "#f4b8c4", "#ffd8e0"], glyphs: ["✿", "·"] },
};

const DATA = {
  about: {
    name: "Prabhdeep Singh",
    title: "Full-Stack Developer & Creative Coder",
    location: "Bengaluru, Karnataka, IN",
    email: "you@email.com",
    status: "available for work",
    bio: "I enjoy shipping practical web apps with clean architecture, smooth UX, and maintainable code.",
  },
  projects: [
    {
      name: "project_alpha",
      year: "2024",
      desc: "Full-stack SaaS with real-time collaboration and fast, scalable APIs.",
      stack: ["Next.js", "PostgreSQL", "WebSockets", "Vercel"],
    },
    {
      name: "neural_canvas",
      year: "2024",
      desc: "AI creative tool that transforms prompts into stylized visuals.",
      stack: ["React", "FastAPI", "Python", "Redis"],
    },
    {
      name: "datastream_db",
      year: "2023",
      desc: "Real-time analytics dashboard for high-volume event streams.",
      stack: ["Kafka", "Go", "ClickHouse", "Grafana"],
    },
  ],
};

function App() {
  const [theme, setTheme] = useState("winter");
  const [activeSection, setActiveSection] = useState("home");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [particles, setParticles] = useState([]);
  const [terminalLines, setTerminalLines] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [history, setHistory] = useState([]);
  const [historyIdx, setHistoryIdx] = useState(-1);

  const inputRef = useRef(null);
  const terminalBodyRef = useRef(null);

  const phrases = useMemo(
    () => [
      "building things for the web.",
      "writing clean, readable code.",
      "turning ideas into products.",
      "open to new collaborations.",
      "always learning something new.",
    ],
    []
  );

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
    const cfg = PARTICLE_CONFIG[theme];
    const list = Array.from({ length: cfg.count }).map((_, i) => ({
      id: `${theme}-${i}-${Math.random()}`,
      glyph: cfg.glyphs[Math.floor(Math.random() * cfg.glyphs.length)],
      color: cfg.colors[Math.floor(Math.random() * cfg.colors.length)],
      size: 8 + Math.random() * 10,
      left: Math.random() * 100,
      duration: 9 + Math.random() * 12,
      delay: -Math.random() * 12,
    }));
    setParticles(list);
  }, [theme]);

  useEffect(() => {
    let phraseIdx = 0;
    let charIdx = 0;
    let deleting = false;
    let timer;

    const tick = () => {
      const phrase = phrases[phraseIdx];
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
        phraseIdx = (phraseIdx + 1) % phrases.length;
      }
      timer = window.setTimeout(tick, 40);
    };

    tick();
    return () => window.clearTimeout(timer);
  }, [phrases]);

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
      { threshold: [0.2, 0.35, 0.5], rootMargin: "-35% 0px -55% 0px" }
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
    setTerminalLines([
      { cls: "t-comment", html: "##############################################" },
      { cls: "t-comment", html: "#  welcome to prabhdeep.singh terminal      #" },
      { cls: "t-comment", html: '#  type <span class="t-key">help</span> for commands               #' },
      { cls: "t-comment", html: "##############################################" },
      { cls: "t-blank", html: "&nbsp;" },
    ]);
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
    setTerminalLines((prev) => [...prev, { cls, html }]);
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
      pushLine('<span class="t-acc">available:</span> help, about, projects, skills, contact, theme, clear');
      pushLine('&nbsp;', "t-blank");
      return;
    }

    if (cmd === "about") {
      pushLine(`name: <span class="t-val">${DATA.about.name}</span>`);
      pushLine(`title: <span class="t-val">${DATA.about.title}</span>`);
      pushLine(`location: <span class="t-val">${DATA.about.location}</span>`);
      pushLine('&nbsp;', "t-blank");
      return;
    }

    if (cmd === "projects") {
      DATA.projects.forEach((project) => {
        pushLine(`<span class="t-key">◈ ${project.name}</span> <span class="t-dim">(${project.year})</span>`);
        pushLine(`<span class="t-dim">${project.desc}</span>`);
      });
      pushLine('&nbsp;', "t-blank");
      return;
    }

    if (cmd === "skills") {
      pushLine("frontend: React, Next.js, Tailwind, Motion");
      pushLine("backend: Node.js, FastAPI, PostgreSQL, Redis");
      pushLine("tools: Docker, GitHub Actions, AWS");
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
      const matched = ["help", "about", "projects", "skills", "contact", "theme", "clear"].find((x) =>
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
                />
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
              />
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
              Prabhdeep <span className="acc">Singh</span>
            </h1>
            <p className="hero-title">// full-stack developer • building useful products</p>
            <p className="hero-bio">
              I build things for the web. Passionate about clean code, great UX, and solving real problems. Currently open to
              new opportunities — let&apos;s create something together.
            </p>
            <div className="hero-meta">
              <div>
                location <span>Bengaluru, IN</span>
              </div>
              <div>
                status <span>available</span>
              </div>
              <div>
                coffee <span>3x daily</span>
              </div>
            </div>
            <p className="type-line">
              {typedText}
              <span className="caret" />
            </p>
          </div>
          <div className="hero-photo-wrap">
            <img className="hero-photo" src={PROFILE_IMAGE} alt="Prabhdeep Singh portrait" />
          </div>
        </div>
      </section>

      <section className="section reveal" id="about">
        <div className="section-head">
          <div className="section-title">about</div>
        </div>
        <p className="hero-bio">{DATA.about.bio}</p>
      </section>

      <section className="section reveal" id="section">
        <div className="section-head">
          <div className="section-title">section · skills &amp; stack</div>
        </div>
        <div className="skills-grid">
          <div>
            <div className="skill-group-name">languages</div>
            <ul className="skill-list">
              <li>JavaScript / TypeScript</li>
              <li>Python</li>
              <li>Rust</li>
              <li>SQL</li>
            </ul>
          </div>
          <div>
            <div className="skill-group-name">frontend</div>
            <ul className="skill-list">
              <li>React / Next.js</li>
              <li>Tailwind CSS</li>
              <li>Framer Motion</li>
              <li>Three.js</li>
            </ul>
          </div>
          <div>
            <div className="skill-group-name">backend & tools</div>
            <ul className="skill-list">
              <li>Node.js / Express</li>
              <li>PostgreSQL / Redis</li>
              <li>Docker / CI-CD</li>
              <li>AWS / GCP</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section" id="projects">
        <div className="section-head reveal">
          <div className="section-title">selected projects</div>
        </div>
        <div className="projects-list">
          {DATA.projects.map((project) => (
            <article className="project reveal" key={project.name}>
              <div className="project-top">
                <div className="project-name">◈ {project.name}</div>
                <div className="project-year">{project.year}</div>
              </div>
              <p className="project-desc">{project.desc}</p>
              <div className="project-stack">
                {project.stack.map((item) => (
                  <span key={item} className="stack-tag">
                    {item}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="terminal-wrap" id="terminal">
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
            {terminalLines.map((line, idx) => (
              <div
                // eslint-disable-next-line react/no-array-index-key
                key={idx}
                className={`t-line ${line.cls}`}
                dangerouslySetInnerHTML={{ __html: line.html }}
              />
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
      </section>

      <footer className="footer">
        <div>
          built by <span>prabhdeep_singh</span> · 2026
        </div>
        <div>
          theme: <span>{theme}</span>
        </div>
      </footer>
    </>
  );
}

export default App;
