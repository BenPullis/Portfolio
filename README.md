# Ben Pullis – Portfolio

Personal portfolio site for Ben Pullis, a Computer Science student at the University of Minnesota. It is a single-page static site written in plain HTML, CSS, and JavaScript, with no framework, no dependencies to install, and no build step.

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
- **Light and dark themes:** follows the operating system preference on the first visit, then remembers the visitor's choice in `localStorage`.
- **Animated hero background:** a particle network drawn on a `<canvas>` that links nearby points and reacts to the pointer. Its color follows the active theme.
- **Typing effect:** the hero cycles through a short list of roles.
- **Filterable class list:** courses are rendered from a data file and can be filtered by area (Systems, Software Engineering, Web/Data/Cloud, AI/Graphics/Vis, Theory & Math, In Progress).
- **Navigation aids:** sticky nav that highlights the section in view, a scroll progress bar, a back-to-top button, and a collapsible menu on small screens.
- **Responsive layout:** breakpoints at 900px and 600px.
- **Resume download:** linked from the nav as a PDF.

## Tech stack

| Layer | What is used |
| --- | --- |
| Markup | HTML5, one file ([index.html](index.html)) |
| Styling | Plain CSS with custom properties ([css/main.css](css/main.css)) |
| Behavior | Vanilla JavaScript, no modules or bundler ([js/main.js](js/main.js)) |
| Icons | [Font Awesome 6.5.1](https://fontawesome.com/) from cdnjs |
| Fonts | IBM Plex Sans and IBM Plex Mono from Google Fonts |

Icons and fonts load from CDNs, so the site needs an internet connection to render them. Everything else is local.

## Run locally

Clone the repository:

```bash
git clone git@github.com:BenPullis/Portfolio.git
cd Portfolio
```

Then either open `index.html` directly in a browser, or serve the folder:

```bash
python3 -m http.server 8000
```

and visit <http://localhost:8000>.

There is nothing to install and nothing to build. Edit a file and refresh the page.

## Project structure

```
Portfolio/
├── index.html                  All page content and sections
├── css/
│   └── main.css                Styles; theme tokens are at the top
├── js/
│   ├── classes.js              Course data for the Classes section
│   └── main.js                 All interactive behavior
└── assets/
    ├── BenPullis-Resume.pdf    Resume linked from the nav
    ├── headshot.jpg            Headshot (fallback)
    └── headshot.webp           Headshot (preferred format)
```

[js/main.js](js/main.js) is one self-contained script, organized into commented blocks: theme, mobile nav, scroll effects, active nav link, typed roles, classes grid and filters, and the hero particle network.

`classes.js` must load before `main.js`, because `main.js` reads the global `CLASSES` array it defines. The two `<script>` tags at the bottom of [index.html](index.html) are already in that order.

## Updating content

| To change | Edit |
| --- | --- |
| About, education, experience, projects, skills, contact text | The matching section in [index.html](index.html). Each one is marked with a banner comment such as `<!-- ============ PROJECTS ============ -->`. |
| Page title, description, and social preview text | The `<head>` of [index.html](index.html) |
| Roles shown by the typing effect | The `roles` array in [js/main.js](js/main.js) |
| Classes | The `CLASSES` array in [js/classes.js](js/classes.js) |
| Resume | Replace `assets/BenPullis-Resume.pdf`, keeping the filename |
| Headshot | Replace both `assets/headshot.jpg` and `assets/headshot.webp` |

### Adding a class

Each entry in [js/classes.js](js/classes.js) looks like this:

```js
{ code: "CSCI 4521", name: "Applied Machine Learning", term: "Fall 2026", tags: ["ai", "current"] },
```

`tags` decides which filter buttons show the course. A course can have more than one.

| Tag | Filter button |
| --- | --- |
| `systems` | Systems |
| `software` | Software Engineering |
| `web` | Web, Data & Cloud |
| `ai` | AI, Graphics & Vis |
| `theory` | Theory & Math |
| `current` | In Progress |

A course tagged `current` shows "In progress" in place of its term and is highlighted in the accent color. Remove the tag when the semester ends.

To add a new filter category, add a `<button class="filter" data-filter="yourtag">` inside `#classFilters` in [index.html](index.html), then use `yourtag` in the data.

## Theming

All colors, fonts, and the corner radius are CSS custom properties at the top of [css/main.css](css/main.css). `:root` holds the dark theme and `[data-theme="light"]` overrides it for the light theme.

To change the accent color, update these in both blocks:

- `--accent` and `--accent-2`: the color itself
- `--on-accent`: text color used on top of the accent
- `--particle`: the same accent as comma-separated RGB values, used by the hero canvas

The favicon is an inline SVG in the `<head>` of [index.html](index.html) with its own hardcoded colors, as is the `theme-color` meta tag. Update those separately if the palette changes.

## Accessibility

- Honors `prefers-reduced-motion`: CSS transitions and animations are turned off, the typing effect is replaced by static text, and the hero background is drawn once and left still.
- Icon-only buttons and links have `aria-label`s, and the mobile menu button keeps `aria-expanded` in sync.
- Decorative elements (the canvas and the scroll progress bar) are hidden from assistive technology.
- Semantic landmarks: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`.

TODO: run a full audit (Lighthouse or axe) and check keyboard navigation and color contrast in both themes.

## Browser support

Built for current versions of Chrome, Edge, Firefox, and Safari. The CSS uses `color-mix()`, `backdrop-filter`, and `svh` units, and the JavaScript uses `IntersectionObserver` and optional chaining, so older browsers are not supported.

TODO: test on real mobile devices.

## Deployment

TODO: the site is not deployed yet.

Because it is fully static, with all paths relative and no build step, any static host can serve the repository root as is. Options to decide between: GitHub Pages, Netlify, Vercel, or Cloudflare Pages.

Still to do:

- [ ] Pick a host and deploy
- [ ] Set up a custom domain (optional)
- [ ] Add the live URL to the top of this README and to the GitHub repository description

## Roadmap

- [ ] Deploy the site (see [Deployment](#deployment))
- [ ] Add a screenshot to this README
- [ ] Add links from each project card to its repository or demo
- [ ] Add `og:image` and `og:url` meta tags so shared links show a preview image
- [ ] Add a license

## License

TODO: no license has been chosen yet. Until one is added, all rights are reserved.

## Contact

Ben Pullis

- Email: [pullisben14@gmail.com](mailto:pullisben14@gmail.com)
- LinkedIn: [ben-pullis-9457b22b0](https://www.linkedin.com/in/ben-pullis-9457b22b0/)
- GitHub: [BenPullis](https://github.com/BenPullis)
