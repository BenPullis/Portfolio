import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import CircularCarousel from "./CircularCarousel";
import projects from "../data/projects.json";

// The ring places each next item to the left of the one before it. Keeping the first
// project and reversing the rest puts projects.json in left-to-right order instead,
// with the first project in front. Autoplay drifts left, so it plays them in order too.
const ringOrder = projects.length ? [projects[0], ...projects.slice(1).reverse()] : [];
import "./ProjectCarousel.css";

// ---- Card size: change these to resize the cards ----
const CARD_WIDTH = 380; // px. Bigger cards = fewer on screen at once.
const CARD_ASPECT = 0.9; // width ÷ height. 1 = square, higher = wider and shorter.
const SCREEN_MARGIN = 48; // px. On narrow screens, cards shrink to the screen width minus this.

// Card width that still fits on small screens.
const useCardWidth = () => {
  const fit = () => Math.min(CARD_WIDTH, window.innerWidth - SCREEN_MARGIN);
  const [width, setWidth] = useState(fit);
  useEffect(() => {
    const onResize = () => setWidth(fit());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return width;
};

// The `button` field in projects.json picks one of these. Anything else (e.g. "none") shows no button.
// `disabled` buttons don't need a link and do nothing when clicked.
const BUTTONS = {
  try: { label: "Try Me!", icon: "fa-solid fa-arrow-up-right-from-square" },
  code: { label: "See The Code", icon: "fa-solid fa-code" },
  soon: { label: "Coming Soon!", icon: "fa-regular fa-clock", disabled: true },
};

// The button for a project, or null when it shouldn't have one.
const buttonFor = (project) => {
  const button = BUTTONS[project.button];
  if (!button || (!button.disabled && !project.link)) return null;
  return button;
};

// Opens a project's link, if its button has one.
const openProject = (project) => {
  const button = buttonFor(project);
  if (button && !button.disabled) window.open(project.link, "_blank", "noopener");
};

// One card face, used by both layouts.
// The carousel draws each card several times (one copy per curved strip), so there the
// link is kept out of the tab order; keyboard users press Enter on the carousel instead.
const ProjectCard = ({ project, focusable = false }) => {
  const button = buttonFor(project);
  return (
    <article className="project-card">
      <header>
        <h3 className="project-card__title">{project.title}</h3>
        <p className="project-card__meta">
          <span>{project.from}</span>
          <span className="mono">{project.dates}</span>
        </p>
      </header>
      <p className="project-card__desc">{project.description}</p>
      {button?.disabled && (
        <span className="btn btn--outline btn--small project-card__try project-card__try--disabled" aria-disabled="true">
          {button.label} <i className={button.icon}></i>
        </span>
      )}
      {button && !button.disabled && (
        <a className="btn btn--primary btn--small project-card__try" href={project.link} target="_blank" rel="noopener" tabIndex={focusable ? undefined : -1}>
          {button.label} <i className={button.icon}></i>
        </a>
      )}
    </article>
  );
};

// The grid layout: every card at once, in projects.json order. Column count is set in ProjectCarousel.css.
const ProjectGrid = () => (
  <div className="container project-grid" style={{ "--card-aspect": CARD_ASPECT }}>
    {projects.map((project, i) => (
      <ProjectCard key={i} project={project} focusable />
    ))}
  </div>
);

const ProjectCarousel = () => {
  // "carousel" or "grid". The page always opens on the carousel.
  const [layout, setLayout] = useState("carousel");
  if (projects.length === 0) return null;
  const isGrid = layout === "grid";
  // The button lives next to the Projects heading in index.html (#project-layout-toggle),
  // outside this island, so it's drawn there with a portal. Styled like the nav's Resume button.
  const toggleSlot = document.getElementById("project-layout-toggle");
  const toggle = (
    <button
      type="button"
      className="btn btn--small btn--outline"
      aria-pressed={isGrid}
      onClick={() => setLayout(isGrid ? "carousel" : "grid")}
    >
      Change Layout
    </button>
  );
  return (
    <>
      {toggleSlot && createPortal(toggle, toggleSlot)}
      {isGrid ? <ProjectGrid /> : <CarouselView />}
    </>
  );
};

// The carousel layout (the default).
const CarouselView = () => {
  const cardWidth = useCardWidth();
  return (
    <div className="project-carousel">
      <CircularCarousel
        items={ringOrder}
        renderItem={(project) => <ProjectCard project={project} />}
        ariaLabel="Projects carousel"
        onItemActivate={openProject}
        preset="panorama"
        intro="assemble"
        cardWidth={cardWidth}
        aspectRatio={CARD_ASPECT}
        speed={2}
        captions={false}
        gap={20}
        tilt={0}
        curve={50}
        viewDistance={2.6}
        edgeFade={45}
        autoplay="drift"
        interval={1.5}
        direction="left"
        momentum={0.69}
        snap
        pauseOnHover={false}
        focusOnClick
        draggable
        parallax={0}
        stretch={0.52}
        fadeColor="var(--bg-alt)"
        depthFade={0.55}
        innerShade={0.58}
        cornerRadius={6}
      />
    </div>
  );
};

export default ProjectCarousel;
