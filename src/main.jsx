// React "islands": the page itself is plain HTML in index.html, and React only
// takes over the elements listed here. To add another component, put an empty
// <div id="..."> in index.html and add an entry below.
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import ProjectCarousel from "./components/ProjectCarousel";

const islands = {
  "project-carousel": ProjectCarousel,
};

for (const [id, Component] of Object.entries(islands)) {
  const el = document.getElementById(id);
  if (el) {
    createRoot(el).render(
      <StrictMode>
        <Component />
      </StrictMode>
    );
  }
}
