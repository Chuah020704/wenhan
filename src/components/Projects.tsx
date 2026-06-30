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
