import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import SectionReveal from './SectionReveal';
import TiltCard from './TiltCard';

interface Area {
  icon: string;
  title: string;
  description: string;
  tags: string[];
}

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function Expertise() {
  const { t } = useTranslation();
  const areas = t('expertise.areas', { returnObjects: true }) as Area[];
  return (
    <SectionReveal id="expertise">
      <p className="mono section-eyebrow">// expertise</p>
      <h2 className="section-title">{t('expertise.title')}</h2>
      <p className="section-lead">{t('expertise.lead')}</p>
      <div className="expertise-grid">
        {areas.map((a, i) => (
          <motion.div
            key={a.title}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
          >
            <TiltCard className="glass-card expertise-card">
              <div className="expertise-icon" aria-hidden="true">
                {a.icon}
              </div>
              <h3>{a.title}</h3>
              <p>{a.description}</p>
              <div className="tag-row">
                {a.tags.map((tag) => (
                  <span key={tag} className="tag mono">
                    {tag}
                  </span>
                ))}
              </div>
            </TiltCard>
          </motion.div>
        ))}
      </div>
    </SectionReveal>
  );
}
