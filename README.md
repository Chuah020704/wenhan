# wenhan — Personal Portfolio

Bilingual (English / 中文), animated personal portfolio for **Chuah Wen Han**,
built with React + Vite + TypeScript.

**Live site:** https://chuah020704.github.io/wenhan/

## Features

- ⌨️ **Interactive 3D skill keyboard** (React Three Fiber) — every keycap is a skill, colour-coded by
  category (AI / infra / data / languages / tools); hover to reveal, click to "type" it into the console
- 🌌 **Deep-space theme** — fixed Three.js starfield + drifting nebula gradients, purple→cyan accents
- 🎞️ **GSAP + Lenis** — smooth scrolling, scroll-drawn experience timeline, staggered reveals
- 🧠 **AI-first positioning** — hero stats, an Expertise section and project cards focused on
  agentic LLM systems, RAG/vector infra, MCP tooling and cloud/MLOps
- 🌐 English / Mandarin language toggle (English loads by default)
- 🌙 Dark (default) / light theme toggle (remembers your choice)
- 👤 Profile photo as an avatar in the top-right nav
- 📱 Responsive, mobile-friendly nav with a collapsible menu; honours `prefers-reduced-motion`

## Develop

```bash
npm install
npm run dev      # start the dev server
npm test         # run the test suite
npm run build    # production build (outputs to dist/)
npm run lint     # lint
```

## Editing content

All text lives in `src/locales/en.json` and `src/locales/zh.json` with matching
keys. Edit those files to update your bio, expertise areas, experience, skills,
projects and contact details. Replace `public/Jit Sin_face.jpg` with your own photo.

The 3D keyboard layout and its skill labels live in `src/data/keyboard.ts`
(each key has a short `label`, a full `title`, a `category` and an optional
`width` in key units). Category colours are in `CATEGORY_COLORS`.

## Deploy

Pushing to `main` triggers the GitHub Actions workflow
(`.github/workflows/deploy.yml`), which lints, tests, builds, and publishes to
GitHub Pages. One-time setup in the repo:
**Settings → Pages → Build and deployment → Source: GitHub Actions**.

## Tech stack

React 18 · Vite 5 · TypeScript · Three.js + React Three Fiber + drei · GSAP ·
Lenis · Framer Motion · react-i18next · Vitest +
React Testing Library.
