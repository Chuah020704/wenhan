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
        style={{
          width: 140,
          height: 140,
          borderRadius: '50%',
          objectFit: 'cover',
          border: '1px solid var(--border)',
        }}
      />
      <div style={{ flex: 1, minWidth: 260 }}>
        <p className="mono" style={{ color: 'var(--accent-from)', fontSize: 13, marginBottom: 8 }}>
          <span className="typewriter">{`// ${t('hero.eyebrow')}`}</span>
        </p>
        <h1
          style={{
            fontSize: 'clamp(28px, 5vw, 44px)',
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: '-0.5px',
          }}
        >
          {t('hero.headlineBefore')}
          <span className="accent-text">{t('hero.headlineAccent')}</span>
          {t('hero.headlineAfter')}
        </h1>
        <p style={{ color: 'var(--muted)', marginTop: 12, maxWidth: 520 }}>{t('hero.subtitle')}</p>
        <div
          style={{
            display: 'flex',
            gap: 12,
            marginTop: 20,
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <a
            href="#projects"
            style={{
              background: 'var(--text)',
              color: 'var(--bg)',
              padding: '10px 18px',
              borderRadius: 6,
              textDecoration: 'none',
              fontSize: 14,
            }}
          >
            {t('hero.ctaPrimary')}
          </a>
          <a
            href="#contact"
            className="mono"
            style={{
              border: '1px solid var(--border)',
              color: 'var(--text)',
              padding: '10px 18px',
              borderRadius: 6,
              textDecoration: 'none',
              fontSize: 14,
            }}
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
