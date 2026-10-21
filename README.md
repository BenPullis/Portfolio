# Ben Pullis – Portfolio

Personal portfolio site for Ben Pullis, a Computer Science student at the University of Minnesota. It is a single-page site written in plain HTML, CSS, and JavaScript, built with [Vite](https://vite.dev/). React is used for individual interactive pieces ("islands"), such as the project carousel, while the rest of the page stays plain HTML.

**Live site:** TODO (not deployed yet)

<!-- TODO: add a screenshot or short GIF of the site here -->

## Contents

- [Features](#features)
- [Tech stack](#tech-stack)
- [Run locally](#run-locally)
- [Project structure](#project-structure)
- [Updating content](#updating-content)
- [Theming](#theming)
- [Accessibility](#accessibility)
- [Browser support](#browser-support)
- [Deployment](#deployment)
- [Roadmap](#roadmap)
- [License](#license)
- [Contact](#contact)

## Features

- **Single page, seven sections:** About, Education, Experience, Projects, Skills, Classes, and Contact, plus a full-height hero.
- **Light and dark themes:** follows the operating system preference on the first visit, then remembers the visitor's choice in `localStorage`. Visitors switch with a sliding Light/Dark toggle in the nav (based on hover.dev's Slider Toggle).
- **Animated hero background:** a particle network drawn on a `<canvas>` that links nearby points and reacts to the pointer. Its color follows the active theme.
- **Typing effect:** the hero cycles through a short list of roles.
- **3D lanyard:** an ID badge with the headshot hangs in the hero and can be dragged, swung, and clicked to flip (React + three.js). On screens 900px wide or narrower it is replaced by a static headshot in the About section.
- **Filterable class list:** courses are rendered from a data file and can be filtered by area. The filter buttons are built from the categories in that file, plus All and In Progress.
- **Navigation aids:** sticky nav that highlights the section in view, a scroll progress bar, and a collapsible menu on small screens.
- **Responsive layout:** breakpoints at 900px and 600px.
- **Resume download:** linked from the nav as a PDF.
- **Project carousel:** a full-width, draggable 3D carousel of project cards (React), filled from a JSON file. Cards are dragged or arrow-keyed into place (no auto-spin), snap into position, fade out at the edges, and show each project's title, class, dates, and skills. Clicking a carousel card brings it to the middle, and its **View details** opens a popup with the full description and a link to a live demo or the source code. A **Change Layout** button switches to a grid of all the cards.

## Tech stack

| Layer | What is used |
| --- | --- |
| Markup | HTML5, one file ([index.html](index.html)) |
| Styling | Plain CSS with custom properties ([css/main.css](css/main.css)) |
| Behavior | Vanilla JavaScript modules ([js/main.js](js/main.js)) |
| Components | React 19, mounted into specific elements ([src/main.jsx](src/main.jsx)) |
| 3D | [three.js](https://threejs.org/), used by the hero lanyard |
| Build | Vite |
| Icons | [Font Awesome 6.5.1](https://fontawesome.com/) from cdnjs |
| Fonts | IBM Plex Sans and IBM Plex Mono from Google Fonts |

Icons and fonts load from CDNs, so the site needs an internet connection to render them. Everything else is local.

## Run locally

Clone the repository:

```bash
git clone git@github.com:BenPullis/Portfolio.git
cd Portfolio
```

Install dependencies (needs Node.js 20.19+ or 22.12+) and start the dev server:

```bash
npm install
npm run dev
```

Vite prints a local URL (usually <http://localhost:5173>). Edits reload in the browser automatically.

Opening `index.html` directly no longer works, because the browser can't run JSX or bare `react` imports on its own.

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the `dist/` build locally to check it |

## Project structure

```
Portfolio/
├── index.html                  All page content and sections (Vite's entry point)
├── package.json                Dependencies and npm scripts
├── vite.config.js              Vite config
├── css/
│   └── main.css                Styles; theme tokens are at the top
├── js/
│   └── main.js                 Non-React interactive behavior
├── src/                        React code
│   ├── main.jsx                Mounts React components into index.html
│   ├── components/
│   │   ├── CircularCarousel.*  3D carousel (from React Bits, adapted for cards)
│   │   ├── Lanyard.*           3D ID-badge lanyard (from React Bits, unmodified)
│   │   ├── MyLanyard.jsx       The hero lanyard's settings (props) and mobile cutoff
│   │   └── ProjectCarousel.*   Project cards shown in the carousel
│   └── data/
│       ├── classes.json        Course list for the Classes section
│       └── projects.json       Project card content
└── public/                     Copied into the build as is
    └── assets/
        ├── BenPullis-Resume.pdf    Resume linked from the nav
        ├── headshot.jpg            Headshot (fallback)
        └── headshot.webp           Headshot (preferred format)
```

[js/main.js](js/main.js) is one self-contained script, organized into commented blocks: theme, mobile nav, scroll effects, active nav link, typed roles, classes grid and filters, and the hero particle network.

`main.js` imports the course list from [src/data/classes.json](src/data/classes.json). It's plain JavaScript, not React, but Vite lets it import JSON the same way the React code imports `projects.json`.

### React components

The page is plain HTML. React only renders inside elements registered in [src/main.jsx](src/main.jsx). To add a component:

1. Create it in `src/components/`.
2. Put an empty placeholder such as `<div id="my-widget"></div>` where it belongs in [index.html](index.html).
3. Add `"my-widget": MyWidget` to the `islands` object in [src/main.jsx](src/main.jsx).

Components can use the site's CSS classes (`btn`, `muted`, `mono`, …) and theme variables (`var(--accent)` and others), so they follow light and dark mode automatically.

## Updating content

| To change | Edit |
| --- | --- |
| About, education, experience, skills, contact text | The matching section in [index.html](index.html). Each one is marked with a banner comment such as `<!-- ============ SKILLS ============ -->`. |
| Page title, description, and social preview text | The `<head>` of [index.html](index.html) |
| Roles shown by the typing effect | The `roles` array in [js/main.js](js/main.js) |
| Classes | [src/data/classes.json](src/data/classes.json) |
| Project carousel cards | [src/data/projects.json](src/data/projects.json) (see below) |
| Resume | Replace `public/assets/BenPullis-Resume.pdf`, keeping the filename |
| Headshot | Replace both `public/assets/headshot.jpg` and `public/assets/headshot.webp`. The hero lanyard uses the `.jpg`; the mobile-only About photo uses both. |

### Project cards

Each object in [src/data/projects.json](src/data/projects.json) becomes one card. The card shows the title, `from`, `dates`, and `skills`; the description and button only show in the popup that opens from **View details** (see [Project popup](#project-popup)). Add or remove objects to change the number of cards. Cards run left to right in file order. The second project starts in front, with the first just to its left. To change which project starts in front, set `START_INDEX` near the top of [src/components/ProjectCarousel.jsx](src/components/ProjectCarousel.jsx) (`0` = first project). Because the carousel is a loop, the last project sits to the left of the first. The grid layout always starts with the first project.

```json
{
  "title": "Drone Delivery Simulation",
  "description": "A sentence or two about the project.",
  "from": "CSCI 3081W – Program Design and Development",
  "dates": "Jan. 2025 – May 2025",
  "skills": ["C++", "Docker", "UML"],
  "button": "try",
  "link": "https://example.com"
}
```

| Field | Meaning |
| --- | --- |
| `title` | Project name |
| `description` | A few sentences about the project. Shown in the popup, which scrolls if it's long. |
| `from` | The class, job, or person the project was for |
| `dates` | Free text, e.g. `"Fall 2025"` or `"Jan. 2025 – May 2025"` |
| `skills` | List of languages, tools, and skills used, shown as chips on the card and in the popup. Use `[]` for none. Around 3–6 keeps the card tidy. |
| `button` | `"try"` shows a **Try Me!** button (for deployed projects), `"code"` shows **See The Code** (e.g. a GitHub repo), `"soon"` shows a **Coming Soon!** button that does nothing, `"none"` shows no button |
| `link` | Where the button goes. If it's `""`, no button shows, whatever `button` says (except `"soon"`, which never needs a link). |

To change the button labels or icons, or to add a new `button` option, edit the `BUTTONS` object near the top of [src/components/ProjectCarousel.jsx](src/components/ProjectCarousel.jsx). An option with `disabled: true` (like `soon`) is drawn as an outline button that does nothing.

### Layout toggle

A **Change Layout** button next to the Projects heading switches between the carousel (the default on every page load) and a grid showing every card at once, in `projects.json` order. The grid uses the same card component. Its cards fit their content (at least 240px tall), and every row is as tall as the tallest one so the grid stays even (on phones, each card is just as tall as its own content). It has 3 columns, dropping to 2 at 900px wide and 1 at 600px; those are the `.project-grid` rules in [src/components/ProjectCarousel.css](src/components/ProjectCarousel.css).

The button is rendered by `ProjectCarousel.jsx` but placed in the `#project-layout-toggle` placeholder beside the `<h2>` in [index.html](index.html), using a React portal. The heading row is a `.section__head`, a wrapper you can reuse to put something just past any section title's line.

### Project popup

In the carousel, clicking a card spins it to the middle, and only clicking its **View details** opens the popup. In the grid, clicking anywhere on a card opens it. Pressing Enter on the focused carousel or a focused grid card opens it too. The popup is `ProjectPopup` in [src/components/ProjectCarousel.jsx](src/components/ProjectCarousel.jsx): a panel over the dimmed page with the title, class, dates, skills, full description, and the link button. It closes with Esc or a click (or tap) anywhere outside the panel.

Round arrows on each side of the panel (or below it on phones), and the left/right arrow keys, step to the previous or next project in `projects.json` order. In carousel mode they wrap around, so both arrows always show, and the carousel spins along behind the popup, so the last project viewed is in front when it closes. In grid mode they don't wrap: the first project has no left arrow and the last has no right arrow.

Popup styling is the `.project-popup` rules in [src/components/ProjectCarousel.css](src/components/ProjectCarousel.css). The panel's width is the `620px` in `.project-popup__frame`.

### Carousel size and behavior

Card size is set by constants at the top of [src/components/ProjectCarousel.jsx](src/components/ProjectCarousel.jsx):

| Constant | Meaning |
| --- | --- |
| `CARD_WIDTH` | Card width in px. Bigger cards mean fewer on screen at once. |
| `CARD_ASPECT` | Width ÷ height. `1` is square, higher is wider and shorter. Lower it if a card's skills get cut off. |
| `SCREEN_MARGIN` | On narrow screens, cards shrink to the screen width minus this many px. |
| `NARROW_CARD_HEIGHT` | Card height in px once cards have shrunk. Narrow cards keep this height instead of `CARD_ASPECT`, because their text wraps onto more lines. |

If cards get much taller, raise the `height` of `.project-carousel` in [src/components/ProjectCarousel.css](src/components/ProjectCarousel.css) so they have room.

The carousel's behavior is set by props on `<CircularCarousel>` in the same file. The ones most worth adjusting:

| Prop | Effect |
| --- | --- |
| `gap` | Space between cards. Lower it if you add many more projects and the ring gets too wide. |
| `viewDistance` | How far back the viewer sits. Higher values flatten the side cards; `1` gives a strong fisheye look. |
| `curve` | How much each card bends with the ring, from `0` (flat) to `1` |
| `edgeFade` | Degrees over which cards fade out at the sides. `0` cuts them off instantly. |
| `speed`, `autoplay`, `direction` | Drift speed; `"drift"` (continuous), `"step"` (one card at a time), or `"off"` (currently `"off"`); and direction |

A short light-grey bar (`.project-carousel__marker`) sits centered under the card in front. The front card always snaps to the center, so the bar stays in place.

A round arrow button on the right edge of the carousel shows visitors to browse to the right. It nudges right until they first click, drag, or press a key on the carousel, then sits still. Clicking it brings the next card (the one on the right) to the front, the same as the right arrow key. On phones it sits just below the card's bottom-right corner. Its look is `.project-carousel__next` in [src/components/ProjectCarousel.css](src/components/ProjectCarousel.css), and it moves the carousel through the `apiRef` prop added to `CircularCarousel` (which also has `focus(index)`, used by the popup).

Card styling is in [src/components/ProjectCarousel.css](src/components/ProjectCarousel.css). The carousel draws each card as several vertical strips so it can curve, and each strip holds its own copy of the card's content. Any hover effect inside a card therefore has to be triggered from the whole card (see the `.circular-carousel__card:hover` rules in that file), or only the slice under the mouse will react.

### Hero lanyard

The lanyard's look and physics are props on `<Lanyard>` in [src/components/MyLanyard.jsx](src/components/MyLanyard.jsx), such as `size` (card size), `anchor` (`"left"`, `"center"`, or `"right"`: where it hangs), `strapLength`, `finish`, `strapColor`, and `gravity`. Image paths are relative to the page, so use `assets/...`, not `/assets/...` or `public/...`.

It fills the whole hero, behind the text, so the card can be swung anywhere without being cut off (the `#my-lanyard` rule in [css/main.css](css/main.css)). The hero text stays clickable, and clicks on the empty space around it reach the card.

At 900px wide and narrower the lanyard isn't rendered, and the headshot in the About section (`.about__card`) shows instead. The cutoff is `MOBILE_QUERY` in `MyLanyard.jsx` and the `@media (max-width: 900px)` block in `main.css`; change both together.

### Adding a class

Each entry in [src/data/classes.json](src/data/classes.json) looks like this, one per line. Classes show in file order, so keep the newest at the top:

```json
{ "code": "CSCI 4521", "name": "Applied Machine Learning", "term": "Fall 2026", "tags": ["AI & Machine Learning", "current"] },
```

It's JSON, so every key and string needs double quotes, there's no comma after the last entry, and comments aren't allowed.

`tags` are the category names, written exactly as they should appear on the filter buttons. A course can have more than one. The filter buttons are built from these tags automatically, so there's nothing to edit in `index.html`:

- **All** comes first.
- Then one button per category, with the categories that have the most classes first. A new tag gets its own button, and a tag no class uses anymore disappears.
- **In Progress** comes last and shows classes tagged `current`.

Spelling matters: `"Algorithms & Math"` and `"Algorithms and Math"` would make two separate buttons.

A course tagged `current` shows "In progress" in place of its term and is highlighted in the accent color. Remove the tag when the semester ends.

The buttons wrap into two even rows of 4. That balance comes from `--filters-width` on `.filters` in [css/main.css](css/main.css), so if you add or rename categories, adjust it until the rows look even. On screens 800px wide and narrower, the two rows keep that width and scroll sideways.

### Section titles

Section headings use `section__title`. Add `center` to center one, and `section__title--lined` as well to draw a thin line on each side of it, as the Classes heading does:

```html
<h2 class="section__title center section__title--lined">Classes Taken</h2>
```

## Theming

All colors, fonts, and the corner radius are CSS custom properties at the top of [css/main.css](css/main.css). `:root` holds the dark theme and `[data-theme="light"]` overrides it for the light theme.

To change the accent color, update these in both blocks:

- `--accent` and `--accent-2`: the color itself
- `--on-accent`: text color used on top of the accent
- `--particle`: the same accent as comma-separated RGB values, used by the hero canvas

Buttons (`.btn` in [css/main.css](css/main.css)) are styled to match the Light/Dark toggle: pill-shaped, medium-weight text, and a 1px border. Filled buttons (`btn--primary`) look like the toggle's selected side, and outline buttons (`btn--outline`) have an accent border and text. `btn--small` buttons, like Resume, are the same height as the toggle. Buttons lift 2px on hover (the toggle doesn't).

The Light/Dark toggle in the nav is plain HTML (`#themeToggle` in [index.html](index.html)), styled by the `.theme-switch` rules in [css/main.css](css/main.css) and wired up in the Theme block of [js/main.js](js/main.js). The sliding pill uses `--accent`, and its springy motion is the `cubic-bezier` on `.theme-switch__thumb`.

The favicon is an inline SVG in the `<head>` of [index.html](index.html) with its own hardcoded colors, as is the `theme-color` meta tag. Update those separately if the palette changes.

## Accessibility

- Honors `prefers-reduced-motion`: CSS transitions and animations are turned off, the typing effect is replaced by static text, and the hero background is drawn once and left still.
- Icon-only buttons and links have `aria-label`s, and the mobile menu button keeps `aria-expanded` in sync.
- Decorative elements (the canvas and the scroll progress bar) are hidden from assistive technology.
- Semantic landmarks: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`.
- The project carousel is a single tab stop. Once focused, the arrow keys move between cards, Home and End jump to the first and last, and Enter opens the front card's popup. The popup takes focus while open and gives it back when it closes. Screen readers hear the title of the card in front as it changes. With reduced motion on, the carousel doesn't drift or animate in.

TODO: run a full audit (Lighthouse or axe) and check keyboard navigation and color contrast in both themes.

## Browser support

Built for current versions of Chrome, Edge, Firefox, and Safari. The CSS uses `color-mix()`, `backdrop-filter`, and `svh` units, and the JavaScript uses `IntersectionObserver` and optional chaining, so older browsers are not supported.

TODO: test on real mobile devices.

## Deployment

TODO: the site is not deployed yet.

Run `npm run build` and deploy the `dist/` folder. Don't deploy the repository root: the source `index.html` needs Vite to run. The build uses relative paths (`base: "./"` in [vite.config.js](vite.config.js)), so it also works from a subfolder, such as `https://benpullis.github.io/Portfolio/` on GitHub Pages.

Options to decide between:

- **GitHub Pages:** GitHub Pages can only serve the repository root or a `/docs` folder from a branch. To publish `dist/`, add a GitHub Actions workflow that runs `npm ci && npm run build` and deploys `dist/`, then set **Settings → Pages → Source** to "GitHub Actions".
- **Netlify, Vercel, or Cloudflare Pages:** connect the repository and set the build command to `npm run build` and the output directory to `dist`.

Still to do:

- [ ] Pick a host and deploy
- [ ] Set up a custom domain (optional)
- [ ] Add the live URL to the top of this README and to the GitHub repository description

## Roadmap

- [ ] Deploy the site (see [Deployment](#deployment))
- [ ] Add a screenshot to this README
- [ ] Fill in the remaining placeholder project cards in [src/data/projects.json](src/data/projects.json)
- [ ] Add `og:image` and `og:url` meta tags so shared links show a preview image
- [ ] Add a license

## License

TODO: no license has been chosen yet. Until one is added, all rights are reserved.

## Contact

Ben Pullis

- Email: [pullisben14@gmail.com](mailto:pullisben14@gmail.com)
- LinkedIn: [ben-pullis-9457b22b0](https://www.linkedin.com/in/ben-pullis-9457b22b0/)
- GitHub: [BenPullis](https://github.com/BenPullis)
