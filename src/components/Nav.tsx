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
          WEN&nbsp;HAN<span style={{ color: 'var(--accent-from)' }}>.</span>
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
