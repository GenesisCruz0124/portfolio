# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Static personal portfolio site for Genesis (Full-Stack Developer). No build step, no framework, no package manager — open `index.html` directly in a browser.

## Development

**Run locally:** open `index.html` in any browser. There is no dev server or build process.

**Deploy:** push to the `master` branch on GitHub. GitHub Pages auto-publishes from the repo root.
Live URL: `https://genesiscruz0124.github.io/portfolio/`

## Architecture

All styles are split across three files with a clear separation of concerns:

- `css/style.css` — design tokens (CSS custom properties), reset, nav, hero, buttons, footer, and responsive breakpoints. **All colors/spacing live here as `--var` tokens.**
- `css/animations.css` — every `@keyframes` definition plus the scroll-reveal utility classes (`.reveal-up`, `.reveal-up-delay`, etc.) that IntersectionObserver toggles to `.visible`.
- `css/components.css` — section-specific layout and component styles (about grid, code window, project cards, skills, contact form).

JS is also split by concern — each file is an IIFE and runs independently:

- `js/particles.js` — canvas-based star/particle system. Owns the `<canvas>` inside `#hero`, tracks mouse position for repulsion, runs its own `requestAnimationFrame` loop.
- `js/cursor.js` — custom glow cursor. Snaps the dot to exact mouse position; lerps the trail ring. Adds `.is-hovering` on interactive elements.
- `js/animations.js` — three separate IIFEs: (1) IntersectionObserver that adds `.visible` to reveal classes and staggered project cards; (2) hero typing effect cycling through phrase array; (3) About code-block typewriter triggered on scroll; (4) 3D card tilt via `mousemove`.
- `js/main.js` — scroll progress bar, navbar blur-on-scroll, mobile hamburger overlay, email copy-to-clipboard, contact form submit, active nav highlight via IntersectionObserver.

## Key conventions

- **All animations use only `transform` and `opacity`** — no layout-triggering properties — to stay GPU-composited.
- Scroll reveals: add the class `reveal-up` (or `reveal-up-delay`, `reveal-up-delay2`, `reveal-up-delay3`) to any element; the observer in `animations.js` handles the rest. Project cards use `data-delay="<ms>"` for custom stagger timing.
- Design tokens are in `style.css` `:root`. Change colors/fonts there — do not hardcode values in component files.
- The custom cursor is hidden on mobile via `@media (max-width: 768px)` in `style.css`; `cursor: auto` is restored on `body`.
