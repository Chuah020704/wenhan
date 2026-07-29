import { lazy, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useReducedMotion } from 'framer-motion';

const HeroParticles = lazy(() => import('./HeroParticles'));

export default function Hero() {
  const { t } = useTranslation();
  const prefersReduced = useReducedMotion();
  return (
    <section
      id="hero"
      style={{
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* 3-D particle field — lazily loaded so it never blocks first paint */}
      <Suspense fallback={null}>
        <HeroParticles />
      </Suspense>

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: 960,
          margin: '0 auto',
          padding: '96px 24px 64px',
          display: 'flex',
          gap: 40,
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        {/* Profile photo with animated glow ring */}
        <motion.div
          className="profile-ring"
          initial={prefersReduced ? false : { opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{ position: 'relative', flexShrink: 0 }}
        >
          <img
            src={`${import.meta.env.BASE_URL}Jit%20Sin_face.jpg`}
            alt={t('hero.photoAlt')}
            style={{
              width: 156,
              height: 156,
              borderRadius: '50%',
              objectFit: 'cover',
              display: 'block',
              position: 'relative',
              zIndex: 1,
              border: '3px solid var(--card-bg)',
            }}
          />
        </motion.div>

        <motion.div
          style={{ flex: 1, minWidth: 260 }}
          initial={prefersReduced ? false : { opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
        >
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
            <a href="#projects" className="cta-primary">
              {t('hero.ctaPrimary')}
            </a>
            <a href="#contact" className="mono cta-secondary">
              {t('hero.ctaContact')}
            </a>
          </div>
          <p className="mono" style={{ color: 'var(--muted)', fontSize: 12, marginTop: 20 }}>
            <span style={{ color: 'var(--status)' }}>●</span> {t('hero.status')}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
