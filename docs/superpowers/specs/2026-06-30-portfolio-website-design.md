# Personal Portfolio Website — Design Spec

**Date:** 2026-06-30
**Repo:** [Chuah020704/wenhan](https://github.com/Chuah020704/wenhan)
**Live URL (target):** `https://chuah020704.github.io/wenhan/`
**Status:** Approved design — ready for implementation planning

---

## 1. Purpose

A personal portfolio website to show interviewers who the owner is, their
experience, and their strengths. It should be interesting, animated, attractive,
and professional — signalling a "professional, modern developer." The site is
bilingual: visitors can switch between **English** and **Mandarin (中文)** with a
button.

**Success criteria**
- An interviewer can understand who the owner is, their experience, and their
  skills within seconds of landing.
- The site looks polished and professional on desktop and mobile.
- The language toggle instantly switches all visible content between English and
  Mandarin.
- A light/dark toggle is available.
- Animations feel tasteful and smooth, never distracting.
- Deploys cleanly to GitHub Pages at `chuah020704.github.io/wenhan/`.

---

## 2. Tech Stack

| Concern        | Choice                                   |
|----------------|------------------------------------------|
| Framework      | React + Vite                             |
| Language       | TypeScript                               |
| Animation      | Framer Motion                            |
| i18n           | react-i18next                            |
| Theming        | CSS custom properties (variables)        |
| Testing        | Vitest + React Testing Library           |
| Lint/Format    | ESLint + Prettier                        |
| Hosting        | GitHub Pages (project site)              |
| Deploy         | GitHub Actions workflow                  |

**GitHub Pages note:** Because the repo is named `wenhan` (not
`<username>.github.io`), this is a **project site** served from a subpath.
Vite must be configured with `base: '/wenhan/'` so all asset URLs resolve
correctly. The CI workflow builds with Vite and publishes the `dist/` output to
Pages.

---

## 3. Layout & Navigation

Single-page vertical scroll with a **sticky top navigation bar** containing:

```
[ Logo / Name ]      About   Experience   Skills   Projects   Contact      [EN / 中]  [🌙 / ☀️]
```

- Smooth-scroll anchor links to each section.
- **Language toggle** (EN / 中) and **theme toggle** (light/dark) sit together on
  the right.
- On small screens the nav collapses into a mobile menu (hamburger).

**Sections (in order):**
1. **Hero / Intro** — profile photo, monospace eyebrow label (e.g.
   `// full-stack engineer`), large headline with a gradient-accented keyword,
   short subtitle, two CTAs (primary "View my work" + mono-styled "$ contact"),
   and a small "availability / location / EN·中文" status line.
2. **About** — short bio / who I am.
3. **Experience** — work history as a vertical timeline.
4. **Skills** — grouped skill tags (e.g. Languages, Frameworks, Tools).
5. **Projects** — cards with title + description only (**no external links**).
6. **Contact** — simple links: email (`mailto:`), LinkedIn, GitHub icons.
7. **Footer** — name, year, language/theme note.

---

## 4. Visual Style

A **fusion** of three directions: minimal & clean (base) + bold/modern (accent) +
developer/terminal (details). The result is clean and professional with a modern
developer signature.

- **Layout:** generous whitespace, strong typographic hierarchy, restraint.
- **Accent:** a single **indigo → cyan gradient** (`#6366f1 → #06b6d4`), used
  sparingly (one headline keyword, primary CTA, small glows).
- **Developer details:** monospace micro-elements — section eyebrows
  (`// section`), a `$ contact` button, a live-status line, subtle background
  grid in dark mode.
- **Typography:** clean sans-serif for body/headings; monospace (e.g. a
  Consolas/JetBrains-Mono style) for the developer micro-details.

**Palette**

| Token             | Light          | Dark             |
|-------------------|----------------|------------------|
| Background        | `#fbfbfd`      | `#0b0d12`        |
| Text              | `#0a0a0a`      | `#e6e9ef`        |
| Muted text        | `#666`         | `#9aa3b2`        |
| Accent gradient   | `#6366f1 → #06b6d4` | `#818cf8 → #22d3ee` |
| Status / "online" | `#34d399`      | `#34d399`        |

---

## 5. Theming Behaviour

- **Light/dark toggle** in the nav.
- Implemented with CSS custom properties; toggling sets a `data-theme` attribute
  / class on the root element.
- **Remembers the visitor's choice** in `localStorage`; on first visit it
  respects the system `prefers-color-scheme`.

> Note: This differs intentionally from the language behaviour (below), which is
> always English-first with no memory.

---

## 6. Internationalisation (EN / 中文)

- **react-i18next** with content stored **separately from components** in:
  - `src/locales/en.json`
  - `src/locales/zh.json`
- Parallel key structure (e.g. `experience.jobs[0].title`,
  `hero.headline`). Components read text via `useTranslation()`.
- **Default language: English on every load** (no memory of previous choice).
  The toggle switches all visible text instantly.
- **Content workflow:**
  - `en.json` is populated from the owner's resume/CV (provided separately).
  - `zh.json` is **drafted from the English by the implementer**, then the owner
    reviews and corrects it.
- Adding another language later only requires a new `<lang>.json` file.

---

## 7. Components

Each component is focused, with a clear responsibility, and is independently
testable.

| Component        | Responsibility                                              |
|------------------|-------------------------------------------------------------|
| `Nav`            | Sticky bar, anchor links, mobile menu, hosts the toggles    |
| `LanguageToggle` | Switches i18next language EN ↔ 中                            |
| `ThemeToggle`    | Switches light/dark, persists to localStorage               |
| `Hero`           | Photo, eyebrow, gradient headline, CTAs, status line        |
| `About`          | Bio content                                                 |
| `Experience`     | Timeline of roles                                           |
| `Skills`         | Grouped skill tags                                          |
| `Projects`       | Description-only project cards                              |
| `Contact`        | mailto + LinkedIn + GitHub icon links                       |
| `Footer`         | Name, year                                                  |
| `SectionReveal`  | Reusable wrapper that animates children in on scroll        |

**Data flow:** All copy comes from the i18n JSON files via `useTranslation()`.
The profile photo and any static assets live in `src/assets/` (or `public/`).
Theme state lives at the app root and is exposed via CSS variables + a context if
needed.

---

## 8. Animation (tasteful & subtle)

Powered by Framer Motion:
- **Scroll reveals:** sections fade/slide in as they enter the viewport
  (`SectionReveal`).
- **Hover effects:** gentle lift/scale on project cards and links.
- **Hero accents:** a typing effect on the monospace eyebrow; an animated
  gradient on the accent keyword.
- **Respect `prefers-reduced-motion`:** animations are reduced/disabled for users
  who request it.

---

## 9. Responsive & Accessibility

- **Mobile-first** layout; nav collapses to a hamburger menu on small screens.
- Semantic HTML landmarks (`header`, `nav`, `main`, `section`, `footer`).
- Toggles are real buttons, keyboard-operable, with accessible labels.
- Profile photo and icons have alt text / labels.
- Sufficient colour contrast verified in **both** light and dark themes.

---

## 10. Deployment

- **GitHub Actions** workflow on push to `main`:
  1. Install deps, run lint + tests.
  2. `vite build` (with `base: '/wenhan/'`).
  3. Publish `dist/` to GitHub Pages.
- Repo Settings → Pages set to deploy from GitHub Actions.
- A custom domain can be added later if desired (not in scope now).

---

## 11. Testing & Quality

- **Vitest + React Testing Library:**
  - Language toggle switches rendered text from English to Mandarin.
  - Theme toggle changes the root theme attribute and persists.
  - Each section renders in both languages without missing keys.
- ESLint + Prettier enforced.
- Manual Lighthouse pass (performance, accessibility, best practices) before
  launch.

---

## 12. Out of Scope (YAGNI)

- Contact form / backend (using simple links instead).
- External links on project cards.
- Blog/CMS, analytics, third-party integrations.
- Languages beyond English and Mandarin.
- Custom domain (can be added later).

---

## 13. Open Items (owner to provide)

- Resume/CV content for: bio, experience entries, skills, project descriptions.
- Profile photo.
- Email address, LinkedIn URL, GitHub URL for the Contact section.
- Review of the drafted Mandarin (`zh.json`).
