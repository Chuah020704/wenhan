import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import SectionReveal from './SectionReveal';
import TiltCard from './TiltCard';

interface Project {
  name: string;
  description: string;
}

const cardVariants = {
  hidden: { opacity: 0, y: 28, scale: 0.97 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, delay: i * 0.1, ease: 'easeOut' },
  }),
};

export default function Projects() {
  const { t } = useTranslation();
  const items = t('projects.items', { returnObjects: true }) as Project[];
  return (
    <SectionReveal id="projects">
      <p className="mono" style={{ color: 'var(--accent-from)', fontSize: 13 }}>
        // projects
      </p>
      <h2 style={{ fontSize: 28, fontWeight: 800, margin: '8px 0 24px' }}>{t('projects.title')}</h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 16,
        }}
      >
        {items.map((p, i) => (
          <motion.div key={i} custom={i} variants={cardVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}>
            <TiltCard
              style={{
                border: '1px solid var(--border)',
                borderRadius: 10,
                padding: 20,
                background: 'var(--card-bg)',
                height: '100%',
              }}
            >
              <div style={{ position: 'relative', transformStyle: 'preserve-3d' }}>
                <div
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    inset: -1,
                    borderRadius: 10,
                    background: 'linear-gradient(135deg, var(--accent-from), var(--accent-to))',
                    opacity: 0,
                    transition: 'opacity 0.3s ease',
                    pointerEvents: 'none',
                  }}
                  className="card-glow-layer"
                />
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{p.name}</h3>
                <p style={{ color: 'var(--muted)', fontSize: 14 }}>{p.description}</p>
              </div>
            </TiltCard>
          </motion.div>
        ))}
      </div>
    </SectionReveal>
  );
}
