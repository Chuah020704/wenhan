import { lazy, Suspense, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useReducedMotion } from 'framer-motion';
import { KeyDef, CATEGORY_COLORS } from '../data/keyboard';

const KeyboardScene = lazy(() => import('./three/KeyboardScene'));

interface Stat {
  value: string;
  label: string;
}

const fade = (delay: number, reduced: boolean | null) => ({
  initial: reduced ? false : { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
});

export default function Hero() {
  const { t } = useTranslation();
  const prefersReduced = useReducedMotion();
  const [activeKey, setActiveKey] = useState<KeyDef | null>(null);
  const [typed, setTyped] = useState<string[]>([]);
  const stats = t('hero.stats', { returnObjects: true }) as Stat[];

  const handlePress = (k: KeyDef) => {
    setTyped((prev) => [...prev.slice(-5), k.title]);
  };

  return (
    <section id="hero" className="hero">
      <div className="hero-inner">
        <div className="hero-copy">
          <motion.p className="mono hero-eyebrow" {...fade(0, prefersReduced)}>
            <span className="typewriter">{`// ${t('hero.eyebrow')}`}</span>
          </motion.p>
          <motion.h1 className="hero-title" {...fade(0.1, prefersReduced)}>
            {t('hero.headlineBefore')}
            <span className="accent-text">{t('hero.headlineAccent')}</span>
            {t('hero.headlineAfter')}
          </motion.h1>
          <motion.p className="hero-subtitle" {...fade(0.2, prefersReduced)}>
            {t('hero.subtitle')}
          </motion.p>
          <motion.div className="hero-ctas" {...fade(0.3, prefersReduced)}>
            <a href="#projects" className="cta-primary">
              {t('hero.ctaPrimary')}
            </a>
            <a href="#contact" className="mono cta-secondary">
              {t('hero.ctaContact')}
            </a>
          </motion.div>
          <motion.ul className="hero-stats" {...fade(0.4, prefersReduced)}>
            {stats.map((s) => (
              <li key={s.label}>
                <span className="hero-stat-value accent-text">{s.value}</span>
                <span className="hero-stat-label mono">{s.label}</span>
              </li>
            ))}
          </motion.ul>
          <motion.p className="mono hero-status" {...fade(0.5, prefersReduced)}>
            <span style={{ color: 'var(--status)' }}>●</span> {t('hero.status')}
          </motion.p>
        </div>

        <motion.div
          className="hero-scene"
          initial={prefersReduced ? false : { opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="hero-canvas" data-testid="hero-canvas">
            <Suspense
              fallback={<div className="hero-canvas-fallback mono">{t('hero.loading')}</div>}
            >
              <KeyboardScene onHover={setActiveKey} onPress={handlePress} />
            </Suspense>
          </div>
          <div className="hero-console mono" aria-live="polite">
            <span className="hero-console-prompt">$</span>{' '}
            {activeKey ? (
              <>
                <span style={{ color: CATEGORY_COLORS[activeKey.category] }}>
                  {activeKey.category}
                </span>
                {' → '}
                <span>{activeKey.title}</span>
              </>
            ) : typed.length ? (
              <span style={{ color: 'var(--muted)' }}>{typed.join(' · ')}</span>
            ) : (
              <span style={{ color: 'var(--muted)' }}>{t('hero.keyboardHint')}</span>
            )}
            <span className="hero-caret">▍</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
