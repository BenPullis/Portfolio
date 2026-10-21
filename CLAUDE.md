# CLAUDE.md

Personal portfolio for Ben Pullis (CS @ University of Minnesota). The [README](README.md) is the full reference for structure, content editing, and carousel settings. This file covers what a new session needs on top of that: how the pieces fit, the non-obvious traps, how Ben likes to work, and current status.

## Commands

```bash
npm install        # first time only
npm run dev        # dev server with hot reload (usually http://localhost:5173)
npm run build      # production build into dist/
npm run preview    # serve dist/ locally
```

VS Code's "Go Live" / Live Server does **not** work. The source `index.html` loads JSX through Vite. Always use `npm run dev`.

## Architecture: plain HTML + React "islands"

- [index.html](index.html) is the whole page as plain HTML and is also Vite's entry point. Styling is [css/main.css](css/main.css), and non-React behavior is [js/main.js](js/main.js) (an ES module that imports the course list from [src/data/classes.json](src/data/classes.json)).
- React renders only inside elements registered in the `islands` map in [src/main.jsx](src/main.jsx). Right now that's just `#project-carousel`. Ben chose islands over a full React conversion, so don't convert the rest of the page unless he asks.
- No TypeScript, Tailwind, shadcn, or ESLint. They were removed on purpose because they conflicted with `main.css` (shared variable names like `--accent` and `--border`, the CSS reset, and a competing theme system).
- Static files live in `public/assets/` and are referenced as `assets/...`. `vite.config.js` uses `base: "./"` so the build works from a GitHub Pages subfolder.
- Theme: `data-theme="dark|light"` on `<html>`, with CSS variables at the top of `main.css`. React components should use those variables (`var(--bg)`, `var(--accent)`, …) and site classes (`btn`, `muted`, `mono`) so they follow the theme.

## Project carousel: traps to know

- [src/components/CircularCarousel.jsx](src/components/CircularCarousel.jsx) started as a React Bits component (installed through the shadcn registry) and has been **modified heavily**. Never reinstall or overwrite it. Added props: `renderItem`, `ariaLabel`, `onItemActivate`, `viewDistance`, `edgeFade`, `apiRef` (gives `{ next(), prev(), focus(index) }` for outside buttons and the popup). The stock demo images were deleted, so `items` is required and must be non-empty.
- **Cards are drawn as several vertical strips** so they can curve, and every strip holds a full copy of the card's DOM. Consequences:
  - A plain `:hover` on an element inside a card only affects the slice under the mouse. Trigger hover effects from the whole card with `.circular-carousel__card:hover ...` or `.circular-carousel__card:has(... :hover) ...`.
  - That's also why cards hold no links or buttons: the small cards only show title, meta, and skills, clicking one spins it to the middle, and clicking its "View details" (`onItemClick` now also gets the click event, so `ProjectCarousel` checks the target) or pressing Enter (`onItemActivate`) opens `ProjectPopup`, which is portaled to `document.body` and holds the description and link.
  - Drag-release over a link is suppressed with `preventDefault` in `handleClick`.
- **Order:** [src/components/ProjectCarousel.jsx](src/components/ProjectCarousel.jsx) passes `ringOrder` (projects.json walked backwards from `START_INDEX`), so the file reads left to right with `projects[START_INDEX]` in front. `START_INDEX` is 1, so the second project starts in front.
- **Warping:** most of the distortion came from the panorama preset putting the viewer at the center of the ring, not from `curve`. `viewDistance` (currently 2.6) is the main control.
- Card size: the `CARD_WIDTH` / `CARD_ASPECT` / `SCREEN_MARGIN` constants at the top of `ProjectCarousel.jsx`. Button types: the `BUTTONS` map in the same file (`"try"`, `"code"`, `"soon"`, `"none"`).

## Content conventions

- **Project descriptions** in [src/data/projects.json](src/data/projects.json) are about 45–60 words in three parts: what it is ("A 3D racing game where…"), a "Features …" sentence, then "Built with …, and deployed to GitHub Pages through GitHub Actions." If a project isn't deployed, end with "with deployment TBD."
- `skills`: an array of short chip labels (languages, tools, techniques), about 3–6.
- `button`: `"try"` for live demos, `"code"` for a repo link, `"none"` for no button. No button shows if `link` is `""`.

## Working with Ben

- He's a CS student and comfortable with code, but new to React and Vite. When adding a setting, say where to change it later (file and constant or prop name). He has asked for this explicitly.
- Check visual changes in a real browser at desktop (~1440px) and phone (~390px) widths, and in both themes, before calling them done. Several bugs (the split hover button, the fisheye warping) only showed up visually. One way: use `puppeteer-core` with the installed Chrome at `/Applications/Google Chrome.app`, installed in a scratch folder rather than the project.
- Keep the README up to date when behavior or structure changes. He asked for this before pushing.
- Ask before committing or pushing. He runs git himself.
- Ask questions about any ambiguous questions instead of assuming what he wants. he is open to ideas that may be better than what he suggests. he is happy to answer questions. 

## Status (as of Oct. 16, 2026)

- The React restructure and carousel are committed and pushed to `origin/main` (`f579f74`).
- **Not deployed yet.** The plan is GitHub Pages, which needs a GitHub Actions workflow (`.github/workflows/`) to build and publish `dist/`, plus **Settings → Pages → Source: GitHub Actions**. This hasn't been created yet.
- 7 of the 14 cards in `projects.json` are still `"Project Title"` placeholders. "This Portfolio Website" is set to `"button": "none"` until it's deployed.
- `index.html` still has a leftover `<!-- TODO: replace with high school name -->` comment in Education. The name is already filled in, so the comment can go. The README lists other TODOs (license, screenshot, `og:image`).
