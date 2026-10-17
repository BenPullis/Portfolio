import CLASSES from "../src/data/classes.json";

(() => {
  const $ =(s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Theme ---------- */
  const root = document.documentElement;
  const themeSwitch = $("#themeToggle");
  const setTheme = (t) => {
    root.dataset.theme = t;
    $$("[data-theme-option]", themeSwitch).forEach((b) => b.setAttribute("aria-pressed", b.dataset.themeOption === t));
    try { localStorage.setItem("theme", t); } catch (e) {}
  };
  let saved = null;
  try { saved = localStorage.getItem("theme"); } catch (e) {}
  setTheme(saved || (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark"));
  themeSwitch.addEventListener("click", (e) => {
    const option = e.target.closest("[data-theme-option]");
    if (option) setTheme(option.dataset.themeOption);
  });
  // Turn on the slide animation only after the starting theme is drawn.
  requestAnimationFrame(() => requestAnimationFrame(() => themeSwitch.classList.add("is-ready")));

  /* ---------- Mobile nav ---------- */
  const nav = $("#nav");
  const navToggle = $("#navToggle");
  const navLinks = $("#navLinks");
  const closeMenu = () => {
    navLinks.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
  };
  navToggle.addEventListener("click", () => {
    const open = navLinks.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.innerHTML = open ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
  });
  $$("a", navLinks).forEach((a) => a.addEventListener("click", closeMenu));

  /* ---------- Scroll: progress bar, nav shadow ---------- */
  const progress = $(".scroll-progress");
  const onScroll = () => {
    const h = document.documentElement;
    const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
    progress.style.width = pct + "%";
    nav.classList.toggle("is-scrolled", h.scrollTop > 20);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Active nav link ---------- */
  const sections = $$("main section[id]");
  const linkFor = (id) => $(`.nav__links a[href="#${id}"]`);
  const spy = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (!e.isIntersecting) return;
      $$(".nav__links a").forEach((a) => a.classList.remove("is-active"));
      linkFor(e.target.id)?.classList.add("is-active");
    }),
    { rootMargin: "-45% 0px -50% 0px" }
  );
  sections.forEach((s) => spy.observe(s));

  /* ---------- Typed roles ---------- */
  const roles = [
    "Software Engineer",
    "CS @ University of Minnesota",
  ];
  const typedEl = $("#typed");
  if (reduceMotion) {
    typedEl.textContent = roles[0];
  } else {
    let r = 0, i = 0, deleting = false;
    const tick = () => {
      const word = roles[r];
      typedEl.textContent = word.slice(0, i);
      if (!deleting && i < word.length) { i++; setTimeout(tick, 70); }
      else if (!deleting) { deleting = true; setTimeout(tick, 1600); }
      else if (i > 0) { i--; setTimeout(tick, 35); }
      else { deleting = false; r = (r + 1) % roles.length; setTimeout(tick, 300); }
    };
    tick();
  }

  /* ---------- Classes grid + filters ---------- */
  // Filter buttons are built from the tags in classes.json: one per category, most classes first,
  // between "All" and "In Progress". The "current" tag is special: it highlights the class and
  // feeds the "In Progress" filter instead of getting its own category button.
  const grid = $("#classGrid");
  const filters = $("#classFilters");
  const counts = new Map();
  CLASSES.forEach((c) => c.tags.forEach((t) => t !== "current" && counts.set(t, (counts.get(t) || 0) + 1)));
  const categories = [...counts.keys()].sort((a, b) => counts.get(b) - counts.get(a));
  [["all", "All"], ...categories.map((t) => [t, t]), ["current", "In Progress"]].forEach(([value, label]) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "filter" + (value === "all" ? " is-active" : "");
    btn.dataset.filter = value;
    btn.textContent = label;
    filters.append(btn);
  });
  const render = (filter) => {
    const list = filter === "all" ? CLASSES : CLASSES.filter((c) => c.tags.includes(filter));
    grid.innerHTML = list.map((c) => `
      <div class="course${c.tags.includes("current") ? " course--current" : ""}">
        <span class="course__code mono">${c.code}</span>
        <span class="course__name">${c.name}</span>
        <span class="course__term">${c.tags.includes("current") ? "In progress" : c.term}</span>
      </div>`).join("");
  };
  render("all");
  filters.addEventListener("click", (e) => {
    const btn = e.target.closest(".filter");
    if (!btn) return;
    $$(".filter", filters).forEach((b) => b.classList.remove("is-active"));
    btn.classList.add("is-active");
    grid.classList.add("is-swapping");
    setTimeout(() => { render(btn.dataset.filter); grid.classList.remove("is-swapping"); }, 180);
  });

  /* ---------- Hero particle network ---------- */
  const canvas = $("#heroCanvas");
  const ctx = canvas.getContext("2d");
  let pts = [], w = 0, h = 0, mouse = { x: -999, y: -999 };
  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.clientWidth; h = canvas.clientHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.min(90, Math.floor((w * h) / 16000));
    pts = Array.from({ length: n }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
    }));
  };
  const accent = () => getComputedStyle(root).getPropertyValue("--particle").trim() || "242,193,78";
  const draw = () => {
    ctx.clearRect(0, 0, w, h);
    const c = accent();
    for (let i = 0; i < pts.length; i++) {
      const p = pts[i];
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
      ctx.fillStyle = `rgba(${c},0.7)`;
      ctx.beginPath(); ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2); ctx.fill();
      for (let j = i + 1; j < pts.length; j++) {
        const q = pts[j];
        const d = Math.hypot(p.x - q.x, p.y - q.y);
        if (d < 120) {
          ctx.strokeStyle = `rgba(${c},${0.18 * (1 - d / 120)})`;
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
        }
      }
      const md = Math.hypot(p.x - mouse.x, p.y - mouse.y);
      if (md < 160) {
        ctx.strokeStyle = `rgba(${c},${0.35 * (1 - md / 160)})`;
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
      }
    }
    if (!reduceMotion) requestAnimationFrame(draw);
  };
  canvas.parentElement.addEventListener("pointermove", (e) => {
    const r = canvas.getBoundingClientRect();
    mouse = { x: e.clientX - r.left, y: e.clientY - r.top };
  });
  canvas.parentElement.addEventListener("pointerleave", () => (mouse = { x: -999, y: -999 }));
  window.addEventListener("resize", resize);
  resize(); draw();

  $("#year").textContent = new Date().getFullYear();
})();
