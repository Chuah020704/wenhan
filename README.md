# wenhan — Personal Portfolio

Bilingual (English / 中文), animated personal portfolio for **Chuah Wen Han**,
built with React + Vite + TypeScript.

**Live site:** https://chuah020704.github.io/wenhan/

## Features

- 🌐 English / Mandarin language toggle (English loads by default)
- 🌙 Light / dark theme toggle (remembers your choice)
- ✨ Tasteful scroll-reveal animations (Framer Motion), with `prefers-reduced-motion` support
- 📱 Responsive, mobile-friendly nav with a collapsible menu

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
keys. Edit those files to update your bio, experience, skills, projects and
contact details. Replace `public/profile.jpg` with your own photo.

## Deploy

Pushing to `main` triggers the GitHub Actions workflow
(`.github/workflows/deploy.yml`), which lints, tests, builds, and publishes to
GitHub Pages. One-time setup in the repo:
**Settings → Pages → Build and deployment → Source: GitHub Actions**.

## Tech stack

React 18 · Vite 5 · TypeScript · Framer Motion · react-i18next · Vitest +
React Testing Library.
