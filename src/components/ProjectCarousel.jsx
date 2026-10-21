import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import CircularCarousel from "./CircularCarousel";
import projects from "../data/projects.json";

import "./ProjectCarousel.css";

// Which project (0 = first in projects.json) starts in front of the carousel. 1 starts on the
// second project, which keeps the last one (Final Memo) further out of view to the left on load.
const START_INDEX = 1;

// The ring places each next item to the left of the one before it. Walking backwards through
// projects.json from START_INDEX puts the file in left-to-right order instead, with
// projects[START_INDEX] in front. If autoplay is turned on, it drifts left, so it plays them in order too.
const ringOrder = projects.map((_, k) => projects[(((START_INDEX - k) % projects.length) + projects.length) % projects.length]);

// ---- Card size: change these to resize the cards ----
const CARD_WIDTH = 300; // px. Bigger cards = fewer on screen at once.
const CARD_ASPECT = 0.82; // width ÷ height. 1 = square, lower = taller. Tall enough for the title, meta, and skills.
const SCREEN_MARGIN = 48; // px. On narrow screens, cards shrink to the screen width minus this.
const NARROW_CARD_HEIGHT = 380; // px. Once cards shrink, they keep this height instead of CARD_ASPECT, since narrower cards wrap text onto more lines.
// If cards get taller, raise the .project-carousel heights in ProjectCarousel.css so they have room.
// The full description and link button only show in the popup (ProjectPopup below).

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

// Skill chips, styled like the tags in the Experience section (.tags in main.css).
const Skills = ({ skills = [] }) =>
  skills.length > 0 && (
    <div className="tags tags--small project-card__skills">
      {skills.map((skill) => (
        <span key={skill}>{skill}</span>
      ))}
    </div>
  );

const Meta = ({ project }) => (
  <p className="project-card__meta">
    <span>{project.from}</span>
    <span className="mono">{project.dates}</span>
  </p>
);

// The small card shown in both layouts: title, meta, and skills. In the grid, clicking anywhere on it
// opens the popup. In the carousel, clicking a card brings it to the middle and only "View details"
// opens the popup. The carousel draws each card several times (one copy per curved strip) and handles
// clicks and Enter itself, so only grid cards (`onOpen` set) are focusable buttons.
const ProjectCard = ({ project, onOpen }) => (
  <article
    className="project-card"
    {...(onOpen && {
      role: "button",
      tabIndex: 0,
      "aria-label": `${project.title}: show details`,
      onClick: onOpen,
      onKeyDown: (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen();
        }
      },
    })}
  >
    <header>
      <h3 className="project-card__title">{project.title}</h3>
      <Meta project={project} />
    </header>
    <Skills skills={project.skills} />
    <span className="project-card__more mono">
      View details <i className="fa-solid fa-arrow-right"></i>
    </span>
  </article>
);

// The enlarged view of projects[index]: full description and the link button, with arrows to the
// neighbouring projects. `loop` lets the arrows wrap around from the last project to the first
// (the carousel); without it the first and last projects have no outer arrow (the grid).
// Closes with Esc or a click on the dimmed background. Arrow keys also switch projects.
const ProjectPopup = ({ index, loop, onChange, onClose }) => {
  const project = projects[index];
  const button = buttonFor(project);
  const count = projects.length;
  const hasPrev = loop || index > 0;
  const hasNext = loop || index < count - 1;
  const go = (delta) => onChange((index + delta + count) % count);
  const panel = useRef(null);

  // Keyboard controls. Read through a ref so the listener always sees the current index.
  const keys = useRef();
  keys.current = (e) => {
    if (e.key === "Escape") onClose();
    else if (e.key === "ArrowLeft" && hasPrev) go(-1);
    else if (e.key === "ArrowRight" && hasNext) go(1);
  };

  // While open: stop the page from scrolling, move focus into the popup, and give focus back on close.
  useEffect(() => {
    const returnFocus = document.activeElement;
    const { style } = document.body;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    style.overflow = "hidden";
    style.paddingRight = `${scrollbar}px`;
    panel.current?.focus();
    const onKey = (e) => keys.current(e);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      style.overflow = "";
      style.paddingRight = "";
      returnFocus?.focus?.({ preventScroll: true });
    };
  }, []);

  // `side` is "prev" or "next". A missing arrow keeps its space so the panel doesn't shift.
  const arrow = (side, show) => (
    <button
      type="button"
      className={`project-popup__arrow project-popup__arrow--${side}` + (show ? "" : " is-hidden")}
      aria-label={side === "prev" ? "Previous project" : "Next project"}
      tabIndex={show ? undefined : -1}
      onClick={() => show && go(side === "prev" ? -1 : 1)}
    >
      <i className={`fa-solid fa-chevron-${side === "prev" ? "left" : "right"}`}></i>
    </button>
  );

  return createPortal(
    <div className="project-popup" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="project-popup__frame">
        {arrow("prev", hasPrev)}
        <div
          className="project-popup__panel"
          ref={panel}
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-popup-title"
          tabIndex={-1}
        >
          <header>
            <h3 className="project-card__title" id="project-popup-title">{project.title}</h3>
            <Meta project={project} />
          </header>
          <Skills skills={project.skills} />
          <p className="project-popup__desc">{project.description}</p>
          {button?.disabled && (
            <span className="btn btn--outline btn--small project-card__try project-card__try--disabled" aria-disabled="true">
              {button.label} <i className={button.icon}></i>
            </span>
          )}
          {button && !button.disabled && (
            <a className="btn btn--primary btn--small project-card__try" href={project.link} target="_blank" rel="noopener">
              {button.label} <i className={button.icon}></i>
            </a>
          )}
        </div>
        {arrow("next", hasNext)}
      </div>
    </div>,
    document.body
  );
};

// The grid layout: every card at once, in projects.json order. Column count is set in ProjectCarousel.css.
const ProjectGrid = ({ onOpen }) => (
  <div className="container project-grid">
    {projects.map((project, i) => (
      <ProjectCard key={i} project={project} onOpen={() => onOpen(i)} />
    ))}
  </div>
);

const ProjectCarousel = () => {
  // "carousel" or "grid". The page always opens on the carousel.
  const [layout, setLayout] = useState("carousel");
  // Index in projects.json of the project open in the popup, or null when it's closed.
  const [openIndex, setOpenIndex] = useState(null);
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
      {isGrid ? <ProjectGrid onOpen={setOpenIndex} /> : <CarouselView selected={openIndex} onOpen={setOpenIndex} />}
      {openIndex !== null && (
        <ProjectPopup index={openIndex} loop={!isGrid} onChange={setOpenIndex} onClose={() => setOpenIndex(null)} />
      )}
    </>
  );
};

// Position in ringOrder of projects[i] (the reverse of the ringOrder formula above).
const ringIndexOf = (i) => (((START_INDEX - i) % projects.length) + projects.length) % projects.length;

// The carousel layout (the default).
// The arrow button on the right edge shows visitors to browse rightward. It nudges right until
// they first touch the carousel, then sits still. Its look is .project-carousel__next in ProjectCarousel.css.
// Clicking a card spins it to the middle (focusOnClick). Clicking its "View details" (or Enter on the
// carousel) also opens the popup. While it's open, the carousel spins
// along behind it, so the last project viewed is in front when the popup closes.
const CarouselView = ({ selected, onOpen }) => {
  const cardWidth = useCardWidth();
  const aspect = cardWidth < CARD_WIDTH ? cardWidth / NARROW_CARD_HEIGHT : CARD_ASPECT;
  const carousel = useRef(null);
  const [nudging, setNudging] = useState(true);
  const stopNudging = () => setNudging(false);
  useEffect(() => {
    if (selected !== null) carousel.current?.focus(ringIndexOf(selected));
  }, [selected]);
  const open = (project) => onOpen(projects.indexOf(project));
  return (
    <div
      className="project-carousel"
      style={{ "--card-h": `${cardWidth / aspect}px` }}
      onPointerDownCapture={stopNudging}
      onKeyDownCapture={stopNudging}
    >
      {/* Light-grey bar under the card in front. The front card always snaps to the center, so it stays put. */}
      <span className="project-carousel__marker" aria-hidden="true"></span>
      <button
        type="button"
        className={"project-carousel__next" + (nudging ? " is-nudging" : "")}
        aria-label="Next project"
        onClick={() => carousel.current?.next()}
      >
        <i className="fa-solid fa-chevron-right"></i>
      </button>
      <CircularCarousel
        apiRef={carousel}
        items={ringOrder}
        renderItem={(project) => <ProjectCard project={project} />}
        ariaLabel="Projects carousel"
        onItemClick={(project, i, e) => e.target.closest(".project-card__more") && open(project)}
        onItemActivate={open}
        preset="panorama"
        intro="assemble"
        cardWidth={cardWidth}
        aspectRatio={aspect}
        speed={2}
        captions={false}
        gap={20}
        tilt={0}
        curve={50}
        viewDistance={2.6}
        edgeFade={45}
        autoplay="off" // "drift" = slow continuous spin, "step" = one card at a time
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
