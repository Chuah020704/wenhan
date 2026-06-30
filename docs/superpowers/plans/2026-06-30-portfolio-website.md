# Personal Portfolio Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a bilingual (English/Mandarin), animated, light/dark personal portfolio website in React that deploys to GitHub Pages at `chuah020704.github.io/wenhan/`.

**Architecture:** A Vite + React + TypeScript single-page app. All copy lives in i18n JSON files (`en.json`/`zh.json`) read via react-i18next; components are presentational and pull text by key. Theme state (light/dark) lives in a React context backed by `localStorage` and drives CSS custom properties. Framer Motion provides tasteful scroll-reveal and hover animations. A GitHub Actions workflow builds and publishes to Pages.

**Tech Stack:** React 18, Vite 5, TypeScript, react-i18next + i18next, Framer Motion, Vitest + React Testing Library + jsdom, ESLint, Prettier.

## Global Constraints

- Repo is a **project site**: Vite must set `base: '/wenhan/'`. (exact value `/wenhan/`)
- Default language is **English on every load** — never persist or auto-detect language.
- Theme **does** persist: `localStorage` key `theme`, values `light`|`dark`; first visit respects `prefers-color-scheme`.
- Accent gradient: `#6366f1 → #06b6d4` (light), `#818cf8 → #22d3ee` (dark). Status colour `#34d399`.
- All animations must respect `prefers-reduced-motion`.
- Contact uses **links only** (mailto/LinkedIn/GitHub) — no form. Project cards have **no external links**.
- Sections in order: Hero, About, Experience, Skills, Projects, Contact.
- Node 22, npm 10 (already installed).
- Every commit message ends with the trailer:
  `Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>`

---

## File Structure

```
wenhan/
├── index.html                       # Vite entry HTML
├── package.json                     # deps + scripts
├── tsconfig.json / tsconfig.node.json
├── vite.config.ts                   # base '/wenhan/' + vitest config
├── .eslintrc.cjs / .prettierrc / .gitignore
├── .github/workflows/deploy.yml     # build + deploy to Pages
├── public/                          # static assets served as-is
│   └── profile.jpg                  # placeholder profile photo (owner replaces)
└── src/
    ├── main.tsx                     # React root, imports i18n + global css
    ├── App.tsx                      # assembles sections inside providers
    ├── i18n.ts                      # react-i18next init (English default)
    ├── locales/en.json              # English content
    ├── locales/zh.json              # Mandarin content (drafted, owner reviews)
    ├── theme/ThemeProvider.tsx      # theme context + localStorage
    ├── styles/global.css            # CSS variables (light/dark) + base styles
    ├── test/setup.ts                # jest-dom + i18n import for tests
    ├── test/utils.tsx               # renderWithProviders helper
    └── components/
        ├── Nav.tsx
        ├── LanguageToggle.tsx
        ├── ThemeToggle.tsx
        ├── SectionReveal.tsx
        ├── Hero.tsx
        ├── About.tsx
        ├── Experience.tsx
        ├── Skills.tsx
        ├── Projects.tsx
        ├── Contact.tsx
        └── Footer.tsx
```

---

### Task 1: Project scaffold, tooling, and smoke test

**Files:**
- Create: `package.json`, `index.html`, `vite.config.ts`, `tsconfig.json`, `tsconfig.node.json`, `.gitignore`, `.eslintrc.cjs`, `.prettierrc`, `src/main.tsx`, `src/App.tsx`, `src/styles/global.css`, `src/test/setup.ts`
- Test: `src/App.test.tsx`

**Interfaces:**
- Produces: a working Vite app; `npm run dev/build/test/lint` scripts; `App` default-exported React component rendering a `<main>`.

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "wenhan-portfolio",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest",
    "lint": "eslint . --ext .ts,.tsx",
    "format": "prettier --write ."
  },
  "dependencies": {
    "framer-motion": "^11.3.0",
    "i18next": "^23.12.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-i18next": "^14.1.0"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.4.0",
    "@testing-library/react": "^16.0.0",
    "@testing-library/user-event": "^14.5.0",
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "@typescript-eslint/eslint-plugin": "^7.16.0",
    "@typescript-eslint/parser": "^7.16.0",
    "@vitejs/plugin-react": "^4.3.0",
    "eslint": "^8.57.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.7",
    "jsdom": "^24.1.0",
    "prettier": "^3.3.0",
    "typescript": "^5.5.0",
    "vite": "^5.3.0",
    "vitest": "^2.0.0"
  }
}
```

- [ ] **Step 2: Install dependencies**

Run: `npm install`
Expected: completes, creates `node_modules/` and `package-lock.json`.

- [ ] **Step 3: Create config files**

`index.html`:
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Portfolio</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

`vite.config.ts`:
```ts
/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/wenhan/',
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: true,
  },
});
```

`tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "types": ["vitest/globals", "@testing-library/jest-dom"]
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

`tsconfig.node.json`:
```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true,
    "strict": true
  },
  "include": ["vite.config.ts"]
}
```

`.gitignore`:
```
node_modules
dist
dist-ssr
*.local
.DS_Store
coverage
```

`.prettierrc`:
```json
{
  "singleQuote": true,
  "semi": true,
  "printWidth": 100
}
```

`.eslintrc.cjs`:
```js
module.exports = {
  root: true,
  env: { browser: true, es2020: true, node: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
  },
};
```

- [ ] **Step 4: Create app entry, global styles, and test setup**

`src/styles/global.css`:
```css
* { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body {
  font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
  background-color: var(--bg);
  background-image: var(--grid, none);
  background-size: 26px 26px;
  color: var(--text);
  line-height: 1.6;
  transition: background-color 0.3s ease, color 0.3s ease;
}
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  * { animation: none !important; transition: none !important; }
}
```

`src/main.tsx`:
```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import './i18n';
import './styles/global.css';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
```

`src/App.tsx` (temporary scaffold — replaced in Task 13):
```tsx
export default function App() {
  return <main>Portfolio</main>;
}
```

`src/test/setup.ts`:
```ts
import '@testing-library/jest-dom';
```

> Note: `src/main.tsx` imports `./i18n`, created in Task 2. Until then, run the build only after Task 2, or temporarily comment the import. The smoke test below does not import `main.tsx`, so it passes now.

- [ ] **Step 5: Write the smoke test**

`src/App.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react';
import App from './App';

test('App renders', () => {
  render(<App />);
  expect(screen.getByText('Portfolio')).toBeInTheDocument();
});
```

- [ ] **Step 6: Run the test to verify it passes**

Run: `npm test`
Expected: 1 passing test.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "chore: scaffold Vite + React + TS project with tooling" -m "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 2: i18n setup with English/Mandarin content

**Files:**
- Create: `src/i18n.ts`, `src/locales/en.json`, `src/locales/zh.json`
- Test: `src/i18n.test.ts`

**Interfaces:**
- Produces: default-exported i18next instance (English default, `returnObjects` enabled). Locale key contract used by all later tasks:
  - `nav.{about,experience,skills,projects,contact}`
  - `hero.{eyebrow,headlineBefore,headlineAccent,headlineAfter,subtitle,ctaPrimary,ctaContact,status,photoAlt}`
  - `about.{title,body}`
  - `experience.title`, `experience.jobs[]` → `{role,company,period,description}`
  - `skills.title`, `skills.groups[]` → `{name,items[]}`
  - `projects.title`, `projects.items[]` → `{name,description}`
  - `contact.{title,intro,email,linkedinUrl,githubUrl,emailLabel,linkedinLabel,githubLabel}`
  - `footer.rights`

- [ ] **Step 1: Create `src/locales/en.json`** (placeholder content the owner edits later)

```json
{
  "nav": {
    "about": "About",
    "experience": "Experience",
    "skills": "Skills",
    "projects": "Projects",
    "contact": "Contact"
  },
  "hero": {
    "eyebrow": "full-stack engineer",
    "headlineBefore": "Building ",
    "headlineAccent": "reliable",
    "headlineAfter": " software, end to end.",
    "subtitle": "I design, build and ship products that work — from database to UI.",
    "ctaPrimary": "View my work",
    "ctaContact": "$ contact",
    "status": "Available for opportunities · Based in Your City · EN / 中文",
    "photoAlt": "Portrait of Your Name"
  },
  "about": {
    "title": "About",
    "body": "I'm a full-stack engineer who enjoys turning ideas into reliable, well-crafted products. Replace this paragraph with your own bio."
  },
  "experience": {
    "title": "Experience",
    "jobs": [
      {
        "role": "Software Engineer",
        "company": "Company Name",
        "period": "2023 — Present",
        "description": "Describe your impact, the systems you built, and the technologies you used."
      },
      {
        "role": "Intern",
        "company": "Earlier Company",
        "period": "2022",
        "description": "Describe what you learned and shipped."
      }
    ]
  },
  "skills": {
    "title": "Skills",
    "groups": [
      { "name": "Languages", "items": ["TypeScript", "JavaScript", "Python"] },
      { "name": "Frameworks", "items": ["React", "Node.js"] },
      { "name": "Tools", "items": ["Git", "Docker", "Vite"] }
    ]
  },
  "projects": {
    "title": "Projects",
    "items": [
      {
        "name": "Project One",
        "description": "A short description of what this project does and why it matters."
      },
      {
        "name": "Project Two",
        "description": "Another project description highlighting your role and the outcome."
      }
    ]
  },
  "contact": {
    "title": "Contact",
    "intro": "Let's get in touch.",
    "email": "you@example.com",
    "linkedinUrl": "https://www.linkedin.com/in/your-handle",
    "githubUrl": "https://github.com/Chuah020704",
    "emailLabel": "Email",
    "linkedinLabel": "LinkedIn",
    "githubLabel": "GitHub"
  },
  "footer": {
    "rights": "All rights reserved."
  }
}
```

- [ ] **Step 2: Create `src/locales/zh.json`** (drafted Mandarin — owner reviews)

```json
{
  "nav": {
    "about": "关于",
    "experience": "经历",
    "skills": "技能",
    "projects": "项目",
    "contact": "联系"
  },
  "hero": {
    "eyebrow": "全栈工程师",
    "headlineBefore": "打造",
    "headlineAccent": "可靠",
    "headlineAfter": "的软件，端到端。",
    "subtitle": "我设计、构建并交付真正可用的产品——从数据库到界面。",
    "ctaPrimary": "查看作品",
    "ctaContact": "$ 联系我",
    "status": "正在寻找机会 · 所在城市 · EN / 中文",
    "photoAlt": "本人头像"
  },
  "about": {
    "title": "关于我",
    "body": "我是一名全栈工程师，热衷于将想法转化为可靠且精心打造的产品。请将此段替换为你自己的简介。"
  },
  "experience": {
    "title": "工作经历",
    "jobs": [
      {
        "role": "软件工程师",
        "company": "公司名称",
        "period": "2023 — 至今",
        "description": "描述你的贡献、构建的系统以及使用的技术。"
      },
      {
        "role": "实习生",
        "company": "早期公司",
        "period": "2022",
        "description": "描述你的收获与交付成果。"
      }
    ]
  },
  "skills": {
    "title": "技能",
    "groups": [
      { "name": "编程语言", "items": ["TypeScript", "JavaScript", "Python"] },
      { "name": "框架", "items": ["React", "Node.js"] },
      { "name": "工具", "items": ["Git", "Docker", "Vite"] }
    ]
  },
  "projects": {
    "title": "项目",
    "items": [
      {
        "name": "项目一",
        "description": "简要描述该项目的功能及其意义。"
      },
      {
        "name": "项目二",
        "description": "另一个项目的描述，突出你的角色与成果。"
      }
    ]
  },
  "contact": {
    "title": "联系我",
    "intro": "欢迎与我联系。",
    "email": "you@example.com",
    "linkedinUrl": "https://www.linkedin.com/in/your-handle",
    "githubUrl": "https://github.com/Chuah020704",
    "emailLabel": "邮箱",
    "linkedinLabel": "领英",
    "githubLabel": "GitHub"
  },
  "footer": {
    "rights": "版权所有。"
  }
}
```

- [ ] **Step 3: Create `src/i18n.ts`**

```ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import zh from './locales/zh.json';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    zh: { translation: zh },
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
  returnObjects: true,
});

export default i18n;
```

- [ ] **Step 4: Write the i18n test**

`src/i18n.test.ts`:
```ts
import i18n from './i18n';

test('defaults to English', () => {
  expect(i18n.language).toBe('en');
  expect(i18n.t('nav.about')).toBe('About');
});

test('switches to Mandarin', async () => {
  await i18n.changeLanguage('zh');
  expect(i18n.t('nav.about')).toBe('关于');
  await i18n.changeLanguage('en');
});

test('experience jobs is an array of objects', () => {
  const jobs = i18n.t('experience.jobs', { returnObjects: true }) as Array<{ role: string }>;
  expect(Array.isArray(jobs)).toBe(true);
  expect(jobs[0].role).toBe('Software Engineer');
});
```

- [ ] **Step 5: Run the tests**

Run: `npm test -- src/i18n.test.ts`
Expected: 3 passing tests.

- [ ] **Step 6: Verify the build now succeeds end-to-end**

Run: `npm run build`
Expected: build completes; `dist/` is produced.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add i18n with English/Mandarin content" -m "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 3: Theme provider, CSS variables, and test utilities

**Files:**
- Create: `src/theme/ThemeProvider.tsx`, `src/test/utils.tsx`
- Modify: `src/styles/global.css` (add theme variables)
- Test: `src/theme/ThemeProvider.test.tsx`

**Interfaces:**
- Produces:
  - `ThemeProvider` (default export, React component wrapping children).
  - `useTheme(): { theme: 'light' | 'dark'; toggleTheme: () => void }`.
  - Provider sets `document.documentElement.setAttribute('data-theme', theme)` and persists to `localStorage['theme']`.
  - `renderWithProviders(ui)` from `src/test/utils.tsx` — wraps `ui` in `ThemeProvider` and ensures i18n is initialised; returns RTL render result.

- [ ] **Step 1: Add theme variables to `src/styles/global.css`** (append to existing file)

```css
:root,
:root[data-theme='light'] {
  --bg: #fbfbfd;
  --text: #0a0a0a;
  --muted: #666666;
  --border: #ececf1;
  --accent-from: #6366f1;
  --accent-to: #06b6d4;
  --status: #34d399;
  --card-bg: #ffffff;
  --grid: none;
}
:root[data-theme='dark'] {
  --bg: #0b0d12;
  --text: #e6e9ef;
  --muted: #9aa3b2;
  --border: #1b1f29;
  --accent-from: #818cf8;
  --accent-to: #22d3ee;
  --status: #34d399;
  --card-bg: #11151c;
  --grid: linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
}
.mono { font-family: 'Consolas', 'JetBrains Mono', 'Courier New', monospace; }
.accent-text {
  background: linear-gradient(90deg, var(--accent-from), var(--accent-to), var(--accent-from));
  background-size: 200% auto;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: shimmer 6s linear infinite;
}
@keyframes shimmer {
  to { background-position: 200% center; }
}
.typewriter {
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  border-right: 2px solid var(--accent-from);
  max-width: 100%;
  animation: typing 2s steps(24, end) 1 normal both, caret 0.7s step-end infinite;
}
@keyframes typing {
  from { width: 0; }
  to { width: 100%; }
}
@keyframes caret {
  50% { border-color: transparent; }
}
```

> The shimmer + typewriter + caret keyframes are disabled automatically by the
> `prefers-reduced-motion` rule already in `global.css`, satisfying the
> reduced-motion constraint.

- [ ] **Step 2: Write the failing ThemeProvider test**

`src/theme/ThemeProvider.test.tsx`:
```tsx
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ThemeProvider, { useTheme } from './ThemeProvider';

function Probe() {
  const { theme, toggleTheme } = useTheme();
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <button onClick={toggleTheme}>toggle</button>
    </div>
  );
}

beforeEach(() => {
  localStorage.clear();
  document.documentElement.removeAttribute('data-theme');
});

test('defaults to light and sets data-theme', () => {
  render(
    <ThemeProvider>
      <Probe />
    </ThemeProvider>,
  );
  expect(screen.getByTestId('theme')).toHaveTextContent('light');
  expect(document.documentElement.getAttribute('data-theme')).toBe('light');
});

test('toggles to dark and persists', async () => {
  render(
    <ThemeProvider>
      <Probe />
    </ThemeProvider>,
  );
  await userEvent.click(screen.getByText('toggle'));
  expect(screen.getByTestId('theme')).toHaveTextContent('dark');
  expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  expect(localStorage.getItem('theme')).toBe('dark');
});
```

- [ ] **Step 3: Run to verify it fails**

Run: `npm test -- src/theme/ThemeProvider.test.tsx`
Expected: FAIL — cannot resolve `./ThemeProvider`.

- [ ] **Step 4: Implement `src/theme/ThemeProvider.tsx`**

```tsx
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark';
interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function getInitialTheme(): Theme {
  const stored = localStorage.getItem('theme');
  if (stored === 'light' || stored === 'dark') return stored;
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
}

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
```

- [ ] **Step 5: Create the test utility `src/test/utils.tsx`**

```tsx
import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import ThemeProvider from '../theme/ThemeProvider';
import '../i18n';

export function renderWithProviders(ui: ReactElement, options?: RenderOptions) {
  return render(<ThemeProvider>{ui}</ThemeProvider>, options);
}

export * from '@testing-library/react';
```

- [ ] **Step 6: Run to verify it passes**

Run: `npm test -- src/theme/ThemeProvider.test.tsx`
Expected: 2 passing tests.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add theme provider with light/dark and persistence" -m "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 4: LanguageToggle and ThemeToggle components

**Files:**
- Create: `src/components/LanguageToggle.tsx`, `src/components/ThemeToggle.tsx`
- Test: `src/components/LanguageToggle.test.tsx`, `src/components/ThemeToggle.test.tsx`

**Interfaces:**
- Consumes: `useTheme()` (Task 3), `useTranslation()` (react-i18next, Task 2), `renderWithProviders` (Task 3).
- Produces: `LanguageToggle` and `ThemeToggle` (default-exported components, no props). LanguageToggle renders a button with accessible name `Switch language` that flips i18n language en↔zh. ThemeToggle renders a button with accessible name `Switch theme` that calls `toggleTheme`.

- [ ] **Step 1: Write the failing LanguageToggle test**

`src/components/LanguageToggle.test.tsx`:
```tsx
import userEvent from '@testing-library/user-event';
import { renderWithProviders, screen } from '../test/utils';
import i18n from '../i18n';
import LanguageToggle from './LanguageToggle';

beforeEach(async () => {
  await i18n.changeLanguage('en');
});

test('toggles language between en and zh', async () => {
  renderWithProviders(<LanguageToggle />);
  const btn = screen.getByRole('button', { name: /switch language/i });
  expect(i18n.language).toBe('en');
  await userEvent.click(btn);
  expect(i18n.language).toBe('zh');
  await userEvent.click(btn);
  expect(i18n.language).toBe('en');
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test -- src/components/LanguageToggle.test.tsx`
Expected: FAIL — cannot resolve `./LanguageToggle`.

- [ ] **Step 3: Implement `src/components/LanguageToggle.tsx`**

```tsx
import { useTranslation } from 'react-i18next';

export default function LanguageToggle() {
  const { i18n } = useTranslation();
  const next = i18n.language === 'en' ? 'zh' : 'en';
  return (
    <button
      type="button"
      aria-label="Switch language"
      className="mono"
      onClick={() => i18n.changeLanguage(next)}
      style={{
        border: '1px solid var(--border)',
        borderRadius: 20,
        padding: '2px 10px',
        background: 'transparent',
        color: 'var(--text)',
        cursor: 'pointer',
        fontSize: 12,
      }}
    >
      {i18n.language === 'en' ? 'EN / 中' : '中 / EN'}
    </button>
  );
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npm test -- src/components/LanguageToggle.test.tsx`
Expected: PASS.

- [ ] **Step 5: Write the failing ThemeToggle test**

`src/components/ThemeToggle.test.tsx`:
```tsx
import userEvent from '@testing-library/user-event';
import { renderWithProviders, screen } from '../test/utils';
import ThemeToggle from './ThemeToggle';

beforeEach(() => {
  localStorage.clear();
  document.documentElement.removeAttribute('data-theme');
});

test('toggles the document theme attribute', async () => {
  renderWithProviders(<ThemeToggle />);
  const btn = screen.getByRole('button', { name: /switch theme/i });
  await userEvent.click(btn);
  expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  await userEvent.click(btn);
  expect(document.documentElement.getAttribute('data-theme')).toBe('light');
});
```

- [ ] **Step 6: Run to verify it fails**

Run: `npm test -- src/components/ThemeToggle.test.tsx`
Expected: FAIL — cannot resolve `./ThemeToggle`.

- [ ] **Step 7: Implement `src/components/ThemeToggle.tsx`**

```tsx
import { useTheme } from '../theme/ThemeProvider';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      type="button"
      aria-label="Switch theme"
      onClick={toggleTheme}
      style={{
        border: '1px solid var(--border)',
        borderRadius: 20,
        padding: '2px 10px',
        background: 'transparent',
        color: 'var(--text)',
        cursor: 'pointer',
        fontSize: 14,
      }}
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
}
```

- [ ] **Step 8: Run to verify it passes**

Run: `npm test -- src/components/ThemeToggle.test.tsx`
Expected: PASS.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: add language and theme toggle buttons" -m "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 5: SectionReveal animation wrapper

**Files:**
- Create: `src/components/SectionReveal.tsx`
- Test: `src/components/SectionReveal.test.tsx`

**Interfaces:**
- Consumes: `framer-motion`.
- Produces: `SectionReveal` (default export) with props `{ id?: string; children: ReactNode; className?: string }`. Renders a `<section>` (with the `id`) that fades/slides its children in on scroll. Children always render in the DOM.

- [ ] **Step 1: Write the failing test**

`src/components/SectionReveal.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react';
import SectionReveal from './SectionReveal';

test('renders children inside a section with the given id', () => {
  render(
    <SectionReveal id="about">
      <p>hello</p>
    </SectionReveal>,
  );
  expect(screen.getByText('hello')).toBeInTheDocument();
  expect(document.getElementById('about')).not.toBeNull();
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test -- src/components/SectionReveal.test.tsx`
Expected: FAIL — cannot resolve `./SectionReveal`.

- [ ] **Step 3: Implement `src/components/SectionReveal.tsx`**

```tsx
import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface Props {
  id?: string;
  className?: string;
  children: ReactNode;
}

export default function SectionReveal({ id, className, children }: Props) {
  return (
    <motion.section
      id={id}
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      style={{ maxWidth: 960, margin: '0 auto', padding: '80px 24px' }}
    >
      {children}
    </motion.section>
  );
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npm test -- src/components/SectionReveal.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add SectionReveal scroll animation wrapper" -m "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 6: Nav (sticky bar hosting toggles)

**Files:**
- Create: `src/components/Nav.tsx`
- Modify: `src/styles/global.css` (add responsive nav rules)
- Test: `src/components/Nav.test.tsx`

**Interfaces:**
- Consumes: `useTranslation()`, `LanguageToggle`, `ThemeToggle`.
- Produces: `Nav` (default export, no props). Renders a `<header>` with a `<nav>` containing anchor links to `#about #experience #skills #projects #contact` and both toggles. On screens ≤640px the links collapse behind a hamburger button (`aria-label="Toggle menu"`, `aria-expanded`); the toggles stay visible.

- [ ] **Step 1: Add responsive nav rules to `src/styles/global.css`** (append to existing file)

```css
.nav-right { display: flex; gap: 16px; align-items: center; }
.nav-links { display: flex; gap: 16px; align-items: center; }
.nav-toggle { display: none; }
@media (max-width: 640px) {
  .nav-toggle {
    display: inline-flex;
    background: transparent;
    border: 1px solid var(--border);
    border-radius: 6px;
    color: var(--text);
    padding: 4px 10px;
    cursor: pointer;
    font-size: 16px;
  }
  .nav-links {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    flex-direction: column;
    align-items: flex-start;
    background: var(--bg);
    border-bottom: 1px solid var(--border);
    padding: 16px 24px;
  }
  .nav-links.open { display: flex; }
}
```

- [ ] **Step 2: Write the failing test**

`src/components/Nav.test.tsx`:
```tsx
import userEvent from '@testing-library/user-event';
import { renderWithProviders, screen } from '../test/utils';
import i18n from '../i18n';
import Nav from './Nav';

beforeEach(async () => {
  await i18n.changeLanguage('en');
});

test('renders section anchor links and both toggles', () => {
  renderWithProviders(<Nav />);
  expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('href', '#about');
  expect(screen.getByRole('link', { name: 'Projects' })).toHaveAttribute('href', '#projects');
  expect(screen.getByRole('button', { name: /switch language/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /switch theme/i })).toBeInTheDocument();
});

test('hamburger button toggles aria-expanded', async () => {
  renderWithProviders(<Nav />);
  const btn = screen.getByRole('button', { name: /toggle menu/i });
  expect(btn).toHaveAttribute('aria-expanded', 'false');
  await userEvent.click(btn);
  expect(btn).toHaveAttribute('aria-expanded', 'true');
});
```

- [ ] **Step 3: Run to verify it fails**

Run: `npm test -- src/components/Nav.test.tsx`
Expected: FAIL — cannot resolve `./Nav`.

- [ ] **Step 4: Implement `src/components/Nav.tsx`**

```tsx
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import LanguageToggle from './LanguageToggle';
import ThemeToggle from './ThemeToggle';

const LINKS = ['about', 'experience', 'skills', 'projects', 'contact'] as const;

export default function Nav() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'color-mix(in srgb, var(--bg) 85%, transparent)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <nav
        style={{
          maxWidth: 960,
          margin: '0 auto',
          padding: '12px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          position: 'relative',
        }}
      >
        <a href="#hero" style={{ fontWeight: 800, color: 'var(--text)', textDecoration: 'none' }}>
          YOUR&nbsp;NAME<span style={{ color: 'var(--accent-from)' }}>.</span>
        </a>
        <div className="nav-right">
          <div className={`nav-links${open ? ' open' : ''}`}>
            {LINKS.map((key) => (
              <a
                key={key}
                href={`#${key}`}
                className="mono"
                onClick={() => setOpen(false)}
                style={{ color: 'var(--muted)', textDecoration: 'none', fontSize: 13 }}
              >
                {t(`nav.${key}`)}
              </a>
            ))}
          </div>
          <LanguageToggle />
          <ThemeToggle />
          <button
            type="button"
            className="nav-toggle"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            ☰
          </button>
        </div>
      </nav>
    </header>
  );
}
```

- [ ] **Step 5: Run to verify it passes**

Run: `npm test -- src/components/Nav.test.tsx`
Expected: 2 passing tests.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add sticky nav with section links, toggles, and mobile menu" -m "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 7: Hero section

**Files:**
- Create: `src/components/Hero.tsx`, `public/profile.jpg` (placeholder image)
- Test: `src/components/Hero.test.tsx`

**Interfaces:**
- Consumes: `useTranslation()`.
- Produces: `Hero` (default export, no props). Renders a `<section id="hero">` with the profile `<img>` (alt from `hero.photoAlt`), mono eyebrow, headline (with `headlineAccent` in a `.accent-text` span), subtitle, two CTA elements (link to `#projects` and link to `#contact`), and the mono status line.

- [ ] **Step 1: Add a placeholder profile image**

Run (from repo root):
```bash
node -e "const fs=require('fs');const b64='/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////2wBDAf//////////////////////////////////////////////////////////////////////////////////////wAARCAABAAEDASIAAhEBAxEB/8QAFAABAAAAAAAAAAAAAAAAAAAAAv/EABQQAQAAAAAAAAAAAAAAAAAAAAD/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AfwD/2Q==';fs.writeFileSync('public/profile.jpg',Buffer.from(b64,'base64'));console.log('wrote placeholder');"
```
Expected: prints `wrote placeholder`; creates `public/profile.jpg`. (Owner replaces with a real photo later.)

- [ ] **Step 2: Write the failing test**

`src/components/Hero.test.tsx`:
```tsx
import { renderWithProviders, screen } from '../test/utils';
import i18n from '../i18n';
import Hero from './Hero';

beforeEach(async () => {
  await i18n.changeLanguage('en');
});

test('renders eyebrow, accent headline, photo, and CTAs in English', () => {
  renderWithProviders(<Hero />);
  expect(screen.getByText('// full-stack engineer')).toBeInTheDocument();
  expect(screen.getByText('reliable')).toBeInTheDocument();
  expect(screen.getByAltText('Portrait of Your Name')).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'View my work' })).toHaveAttribute('href', '#projects');
});

test('renders Mandarin headline accent when language is zh', async () => {
  await i18n.changeLanguage('zh');
  renderWithProviders(<Hero />);
  expect(screen.getByText('可靠')).toBeInTheDocument();
  await i18n.changeLanguage('en');
});
```

- [ ] **Step 3: Run to verify it fails**

Run: `npm test -- src/components/Hero.test.tsx`
Expected: FAIL — cannot resolve `./Hero`.

- [ ] **Step 4: Implement `src/components/Hero.tsx`**

```tsx
import { useTranslation } from 'react-i18next';

export default function Hero() {
  const { t } = useTranslation();
  return (
    <section
      id="hero"
      style={{
        maxWidth: 960,
        margin: '0 auto',
        padding: '96px 24px 64px',
        display: 'flex',
        gap: 40,
        alignItems: 'center',
        flexWrap: 'wrap',
      }}
    >
      <img
        src={`${import.meta.env.BASE_URL}profile.jpg`}
        alt={t('hero.photoAlt')}
        style={{ width: 140, height: 140, borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--border)' }}
      />
      <div style={{ flex: 1, minWidth: 260 }}>
        <p className="mono" style={{ color: 'var(--accent-from)', fontSize: 13, marginBottom: 8 }}>
          <span className="typewriter">{`// ${t('hero.eyebrow')}`}</span>
        </p>
        <h1 style={{ fontSize: 'clamp(28px, 5vw, 44px)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.5px' }}>
          {t('hero.headlineBefore')}
          <span className="accent-text">{t('hero.headlineAccent')}</span>
          {t('hero.headlineAfter')}
        </h1>
        <p style={{ color: 'var(--muted)', marginTop: 12, maxWidth: 520 }}>{t('hero.subtitle')}</p>
        <div style={{ display: 'flex', gap: 12, marginTop: 20, alignItems: 'center', flexWrap: 'wrap' }}>
          <a
            href="#projects"
            style={{ background: 'var(--text)', color: 'var(--bg)', padding: '10px 18px', borderRadius: 6, textDecoration: 'none', fontSize: 14 }}
          >
            {t('hero.ctaPrimary')}
          </a>
          <a
            href="#contact"
            className="mono"
            style={{ border: '1px solid var(--border)', color: 'var(--text)', padding: '10px 18px', borderRadius: 6, textDecoration: 'none', fontSize: 14 }}
          >
            {t('hero.ctaContact')}
          </a>
        </div>
        <p className="mono" style={{ color: 'var(--muted)', fontSize: 12, marginTop: 20 }}>
          <span style={{ color: 'var(--status)' }}>●</span> {t('hero.status')}
        </p>
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Run to verify it passes**

Run: `npm test -- src/components/Hero.test.tsx`
Expected: 2 passing tests.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add hero section with photo, accent headline, and CTAs" -m "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 8: About section

**Files:**
- Create: `src/components/About.tsx`
- Test: `src/components/About.test.tsx`

**Interfaces:**
- Consumes: `useTranslation()`, `SectionReveal`.
- Produces: `About` (default export). Renders `SectionReveal id="about"` with an `<h2>` (mono eyebrow `// about` + `about.title`) and the bio paragraph.

- [ ] **Step 1: Write the failing test**

`src/components/About.test.tsx`:
```tsx
import { renderWithProviders, screen } from '../test/utils';
import i18n from '../i18n';
import About from './About';

beforeEach(async () => {
  await i18n.changeLanguage('en');
});

test('renders the about title and bio', () => {
  renderWithProviders(<About />);
  expect(screen.getByRole('heading', { name: /About/i })).toBeInTheDocument();
  expect(screen.getByText(/full-stack engineer who enjoys/i)).toBeInTheDocument();
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test -- src/components/About.test.tsx`
Expected: FAIL — cannot resolve `./About`.

- [ ] **Step 3: Implement `src/components/About.tsx`**

```tsx
import { useTranslation } from 'react-i18next';
import SectionReveal from './SectionReveal';

export default function About() {
  const { t } = useTranslation();
  return (
    <SectionReveal id="about">
      <p className="mono" style={{ color: 'var(--accent-from)', fontSize: 13 }}>// about</p>
      <h2 style={{ fontSize: 28, fontWeight: 800, margin: '8px 0 16px' }}>{t('about.title')}</h2>
      <p style={{ color: 'var(--muted)', maxWidth: 640 }}>{t('about.body')}</p>
    </SectionReveal>
  );
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npm test -- src/components/About.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add about section" -m "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 9: Experience timeline

**Files:**
- Create: `src/components/Experience.tsx`
- Test: `src/components/Experience.test.tsx`

**Interfaces:**
- Consumes: `useTranslation()` with `t('experience.jobs', { returnObjects: true })` returning `Array<{ role: string; company: string; period: string; description: string }>`; `SectionReveal`.
- Produces: `Experience` (default export). Renders `SectionReveal id="experience"` with the title and one entry per job (role, company, period, description).

- [ ] **Step 1: Write the failing test**

`src/components/Experience.test.tsx`:
```tsx
import { renderWithProviders, screen } from '../test/utils';
import i18n from '../i18n';
import Experience from './Experience';

beforeEach(async () => {
  await i18n.changeLanguage('en');
});

test('renders a timeline entry per job', () => {
  renderWithProviders(<Experience />);
  expect(screen.getByText('Software Engineer')).toBeInTheDocument();
  expect(screen.getByText('Company Name')).toBeInTheDocument();
  expect(screen.getByText('2023 — Present')).toBeInTheDocument();
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test -- src/components/Experience.test.tsx`
Expected: FAIL — cannot resolve `./Experience`.

- [ ] **Step 3: Implement `src/components/Experience.tsx`**

```tsx
import { useTranslation } from 'react-i18next';
import SectionReveal from './SectionReveal';

interface Job {
  role: string;
  company: string;
  period: string;
  description: string;
}

export default function Experience() {
  const { t } = useTranslation();
  const jobs = t('experience.jobs', { returnObjects: true }) as Job[];
  return (
    <SectionReveal id="experience">
      <p className="mono" style={{ color: 'var(--accent-from)', fontSize: 13 }}>// experience</p>
      <h2 style={{ fontSize: 28, fontWeight: 800, margin: '8px 0 24px' }}>{t('experience.title')}</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {jobs.map((job, i) => (
          <div
            key={i}
            style={{ borderLeft: '2px solid var(--border)', paddingLeft: 20, position: 'relative' }}
          >
            <span
              style={{
                position: 'absolute',
                left: -7,
                top: 4,
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: 'var(--accent-from)',
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
              <strong>{job.role}</strong>
              <span className="mono" style={{ color: 'var(--muted)', fontSize: 13 }}>{job.period}</span>
            </div>
            <div style={{ color: 'var(--accent-to)', fontSize: 14 }}>{job.company}</div>
            <p style={{ color: 'var(--muted)', marginTop: 6 }}>{job.description}</p>
          </div>
        ))}
      </div>
    </SectionReveal>
  );
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npm test -- src/components/Experience.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add experience timeline section" -m "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 10: Skills section

**Files:**
- Create: `src/components/Skills.tsx`
- Test: `src/components/Skills.test.tsx`

**Interfaces:**
- Consumes: `useTranslation()` with `t('skills.groups', { returnObjects: true })` returning `Array<{ name: string; items: string[] }>`; `SectionReveal`.
- Produces: `Skills` (default export). Renders `SectionReveal id="skills"` with the title and each group's name plus its items as tags.

- [ ] **Step 1: Write the failing test**

`src/components/Skills.test.tsx`:
```tsx
import { renderWithProviders, screen } from '../test/utils';
import i18n from '../i18n';
import Skills from './Skills';

beforeEach(async () => {
  await i18n.changeLanguage('en');
});

test('renders skill groups and items', () => {
  renderWithProviders(<Skills />);
  expect(screen.getByText('Languages')).toBeInTheDocument();
  expect(screen.getByText('TypeScript')).toBeInTheDocument();
  expect(screen.getByText('React')).toBeInTheDocument();
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test -- src/components/Skills.test.tsx`
Expected: FAIL — cannot resolve `./Skills`.

- [ ] **Step 3: Implement `src/components/Skills.tsx`**

```tsx
import { useTranslation } from 'react-i18next';
import SectionReveal from './SectionReveal';

interface Group {
  name: string;
  items: string[];
}

export default function Skills() {
  const { t } = useTranslation();
  const groups = t('skills.groups', { returnObjects: true }) as Group[];
  return (
    <SectionReveal id="skills">
      <p className="mono" style={{ color: 'var(--accent-from)', fontSize: 13 }}>// skills</p>
      <h2 style={{ fontSize: 28, fontWeight: 800, margin: '8px 0 24px' }}>{t('skills.title')}</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {groups.map((group, i) => (
          <div key={i}>
            <div className="mono" style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 8 }}>
              {group.name}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {group.items.map((item) => (
                <span
                  key={item}
                  style={{
                    border: '1px solid var(--border)',
                    borderRadius: 6,
                    padding: '6px 12px',
                    fontSize: 13,
                    background: 'var(--card-bg)',
                  }}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </SectionReveal>
  );
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npm test -- src/components/Skills.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add skills section" -m "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 11: Projects section (description-only cards)

**Files:**
- Create: `src/components/Projects.tsx`
- Test: `src/components/Projects.test.tsx`

**Interfaces:**
- Consumes: `useTranslation()` with `t('projects.items', { returnObjects: true })` returning `Array<{ name: string; description: string }>`; `SectionReveal`.
- Produces: `Projects` (default export). Renders `SectionReveal id="projects"` with the title and one card per project (name + description). **No anchor/links inside cards.**

- [ ] **Step 1: Write the failing test**

`src/components/Projects.test.tsx`:
```tsx
import { renderWithProviders, screen } from '../test/utils';
import i18n from '../i18n';
import Projects from './Projects';

beforeEach(async () => {
  await i18n.changeLanguage('en');
});

test('renders project cards with no external links', () => {
  const { container } = renderWithProviders(<Projects />);
  expect(screen.getByText('Project One')).toBeInTheDocument();
  expect(screen.getByText('Project Two')).toBeInTheDocument();
  expect(container.querySelectorAll('a').length).toBe(0);
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test -- src/components/Projects.test.tsx`
Expected: FAIL — cannot resolve `./Projects`.

- [ ] **Step 3: Implement `src/components/Projects.tsx`**

```tsx
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import SectionReveal from './SectionReveal';

interface Project {
  name: string;
  description: string;
}

export default function Projects() {
  const { t } = useTranslation();
  const items = t('projects.items', { returnObjects: true }) as Project[];
  return (
    <SectionReveal id="projects">
      <p className="mono" style={{ color: 'var(--accent-from)', fontSize: 13 }}>// projects</p>
      <h2 style={{ fontSize: 28, fontWeight: 800, margin: '8px 0 24px' }}>{t('projects.title')}</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
        {items.map((p, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            style={{
              border: '1px solid var(--border)',
              borderRadius: 10,
              padding: 20,
              background: 'var(--card-bg)',
            }}
          >
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{p.name}</h3>
            <p style={{ color: 'var(--muted)', fontSize: 14 }}>{p.description}</p>
          </motion.div>
        ))}
      </div>
    </SectionReveal>
  );
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npm test -- src/components/Projects.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add projects section with description-only cards" -m "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 12: Contact section (links only)

**Files:**
- Create: `src/components/Contact.tsx`
- Test: `src/components/Contact.test.tsx`

**Interfaces:**
- Consumes: `useTranslation()`; `SectionReveal`.
- Produces: `Contact` (default export). Renders `SectionReveal id="contact"` with the title, intro, and three links: email (`mailto:` + `contact.email`), LinkedIn (`contact.linkedinUrl`), GitHub (`contact.githubUrl`), labelled by their respective `*Label` keys.

- [ ] **Step 1: Write the failing test**

`src/components/Contact.test.tsx`:
```tsx
import { renderWithProviders, screen } from '../test/utils';
import i18n from '../i18n';
import Contact from './Contact';

beforeEach(async () => {
  await i18n.changeLanguage('en');
});

test('renders email, linkedin, and github links', () => {
  renderWithProviders(<Contact />);
  expect(screen.getByRole('link', { name: 'Email' })).toHaveAttribute('href', 'mailto:you@example.com');
  expect(screen.getByRole('link', { name: 'LinkedIn' })).toHaveAttribute(
    'href',
    'https://www.linkedin.com/in/your-handle',
  );
  expect(screen.getByRole('link', { name: 'GitHub' })).toHaveAttribute(
    'href',
    'https://github.com/Chuah020704',
  );
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test -- src/components/Contact.test.tsx`
Expected: FAIL — cannot resolve `./Contact`.

- [ ] **Step 3: Implement `src/components/Contact.tsx`**

```tsx
import { useTranslation } from 'react-i18next';
import SectionReveal from './SectionReveal';

export default function Contact() {
  const { t } = useTranslation();
  const linkStyle = {
    border: '1px solid var(--border)',
    borderRadius: 8,
    padding: '10px 18px',
    color: 'var(--text)',
    textDecoration: 'none',
    fontSize: 14,
    background: 'var(--card-bg)',
  } as const;
  return (
    <SectionReveal id="contact">
      <p className="mono" style={{ color: 'var(--accent-from)', fontSize: 13 }}>// contact</p>
      <h2 style={{ fontSize: 28, fontWeight: 800, margin: '8px 0 12px' }}>{t('contact.title')}</h2>
      <p style={{ color: 'var(--muted)', marginBottom: 20 }}>{t('contact.intro')}</p>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <a href={`mailto:${t('contact.email')}`} style={linkStyle}>
          {t('contact.emailLabel')}
        </a>
        <a href={t('contact.linkedinUrl')} target="_blank" rel="noreferrer" style={linkStyle}>
          {t('contact.linkedinLabel')}
        </a>
        <a href={t('contact.githubUrl')} target="_blank" rel="noreferrer" style={linkStyle}>
          {t('contact.githubLabel')}
        </a>
      </div>
    </SectionReveal>
  );
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npm test -- src/components/Contact.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add contact section with email/linkedin/github links" -m "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 13: Footer and full App assembly

**Files:**
- Create: `src/components/Footer.tsx`
- Modify: `src/App.tsx` (replace scaffold)
- Test: `src/components/Footer.test.tsx`, replace `src/App.test.tsx`

**Interfaces:**
- Consumes: all section components, `Nav`, `Footer`, `ThemeProvider`.
- Produces: `Footer` (default export); `App` wraps everything in `ThemeProvider` and renders `Nav`, `Hero`, `About`, `Experience`, `Skills`, `Projects`, `Contact`, `Footer` in order inside `<main>`.

- [ ] **Step 1: Write the failing Footer test**

`src/components/Footer.test.tsx`:
```tsx
import { renderWithProviders, screen } from '../test/utils';
import i18n from '../i18n';
import Footer from './Footer';

beforeEach(async () => {
  await i18n.changeLanguage('en');
});

test('renders the footer rights text', () => {
  renderWithProviders(<Footer />);
  expect(screen.getByText(/All rights reserved/i)).toBeInTheDocument();
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test -- src/components/Footer.test.tsx`
Expected: FAIL — cannot resolve `./Footer`.

- [ ] **Step 3: Implement `src/components/Footer.tsx`**

```tsx
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();
  return (
    <footer
      style={{
        borderTop: '1px solid var(--border)',
        padding: '24px',
        textAlign: 'center',
        color: 'var(--muted)',
        fontSize: 13,
      }}
    >
      <span className="mono">© {year} YOUR NAME · {t('footer.rights')}</span>
    </footer>
  );
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npm test -- src/components/Footer.test.tsx`
Expected: PASS.

- [ ] **Step 5: Replace `src/App.tsx`**

```tsx
import ThemeProvider from './theme/ThemeProvider';
import Nav from './components/Nav';
import Hero from './components/Hero';
import About from './components/About';
import Experience from './components/Experience';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';

export default function App() {
  return (
    <ThemeProvider>
      <Nav />
      <main>
        <Hero />
        <About />
        <Experience />
        <Skills />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </ThemeProvider>
  );
}
```

- [ ] **Step 6: Replace `src/App.test.tsx`** (the Task 1 smoke test no longer matches)

```tsx
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import i18n from './i18n';
import App from './App';

beforeEach(async () => {
  localStorage.clear();
  document.documentElement.removeAttribute('data-theme');
  await i18n.changeLanguage('en');
});

test('renders all sections in English', () => {
  render(<App />);
  expect(document.getElementById('hero')).not.toBeNull();
  expect(document.getElementById('about')).not.toBeNull();
  expect(document.getElementById('experience')).not.toBeNull();
  expect(document.getElementById('skills')).not.toBeNull();
  expect(document.getElementById('projects')).not.toBeNull();
  expect(document.getElementById('contact')).not.toBeNull();
});

test('language toggle switches whole-page nav text to Mandarin', async () => {
  render(<App />);
  expect(screen.getAllByText('About').length).toBeGreaterThan(0);
  await userEvent.click(screen.getByRole('button', { name: /switch language/i }));
  expect(screen.getAllByText('关于').length).toBeGreaterThan(0);
});
```

- [ ] **Step 7: Run the full suite**

Run: `npm test`
Expected: all tests pass.

- [ ] **Step 8: Verify production build**

Run: `npm run build`
Expected: build succeeds; `dist/` produced with assets under the `/wenhan/` base.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: assemble full app with all sections and footer" -m "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 14: GitHub Actions deploy to GitHub Pages

**Files:**
- Create: `.github/workflows/deploy.yml`, `README.md`

**Interfaces:**
- Produces: a CI workflow that on push to `main` installs deps, runs lint + tests + build, and deploys `dist/` to GitHub Pages.

- [ ] **Step 1: Create `.github/workflows/deploy.yml`**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npm test
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Create `README.md`**

```markdown
# wenhan — Personal Portfolio

Bilingual (English / 中文), animated portfolio built with React + Vite.

**Live site:** https://chuah020704.github.io/wenhan/

## Develop

```bash
npm install
npm run dev      # start dev server
npm test         # run tests
npm run build    # production build
```

## Editing content

All text lives in `src/locales/en.json` and `src/locales/zh.json` with matching
keys. Edit those files to update your bio, experience, skills, projects, and
contact details. Replace `public/profile.jpg` with your photo.

## Deploy

Pushing to `main` triggers the GitHub Actions workflow, which builds and
publishes to GitHub Pages. In the repo: **Settings → Pages → Build and
deployment → Source: GitHub Actions** (one-time setup).
```

- [ ] **Step 3: Validate locally that lint, tests, and build all pass**

Run: `npm run lint && npm test && npm run build`
Expected: all three succeed (this mirrors what CI runs).

- [ ] **Step 4: Commit and push**

```bash
git add -A
git commit -m "ci: add GitHub Pages deploy workflow and README" -m "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
git push -u origin main
```

- [ ] **Step 5: One-time GitHub Pages setup (manual, in browser)**

In the GitHub repo: **Settings → Pages → Build and deployment → Source: GitHub Actions**. Re-run the workflow if needed. Confirm the site loads at `https://chuah020704.github.io/wenhan/`.

---

## Post-Implementation: Owner To-Do

These need real content from the owner (placeholders are in place and the site works without them):
- Edit `src/locales/en.json` with real bio, experience, skills, projects, contact email, LinkedIn URL.
- Review and correct `src/locales/zh.json` (drafted Mandarin).
- Replace `public/profile.jpg` with a real headshot.
- Update `YOUR NAME` in `Nav.tsx`, `Hero` (via `photoAlt`), and `Footer.tsx`.
- Run a Lighthouse pass and address any accessibility/performance findings.
