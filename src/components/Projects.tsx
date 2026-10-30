import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import SectionReveal from './SectionReveal';
import TiltCard from './TiltCard';

interface Project {
  name: string;
  tagline?: string;
  description: string;
  tags?: string[];
  context?: string;
}

const cardVariants = {
  hidden: { opacity: 0, y: 28, scale: 0.97 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function Projects() {
  const { t } = useTranslation();
  const items = t('projects.items', { returnObjects: true }) as Project[];
  return (
    <SectionReveal id="projects">
      <p className="mono section-eyebrow">// projects</p>
      <h2 className="section-title">{t('projects.title')}</h2>
      <p className="section-lead">{t('projects.lead')}</p>
      <div className="projects-grid">
        {items.map((p, i) => (
          <motion.div
            key={p.name}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            <TiltCard className="glass-card project-card">
              <div className="project-index mono">0{i + 1}</div>
              {p.context && <span className="project-context mono">{p.context}</span>}
              <h3>{p.name}</h3>
              {p.tagline && <p className="project-tagline">{p.tagline}</p>}
              <p className="project-desc">{p.description}</p>
              {p.tags && (
                <div className="tag-row">
                  {p.tags.map((tag) => (
                    <span key={tag} className="tag mono">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </TiltCard>
          </motion.div>
        ))}
      </div>
    </SectionReveal>
  );
}
