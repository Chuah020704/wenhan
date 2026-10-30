import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import SectionReveal from './SectionReveal';

interface Group {
  name: string;
  items: string[];
}

const groupVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.1, ease: 'easeOut' },
  }),
};

const tagVariants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, delay: 0.05 + i * 0.04, ease: 'easeOut' },
  }),
};

export default function Skills() {
  const { t } = useTranslation();
  const groups = t('skills.groups', { returnObjects: true }) as Group[];
  return (
    <SectionReveal id="skills">
      <p className="mono section-eyebrow">// skills</p>
      <h2 className="section-title">{t('skills.title')}</h2>
      <p className="section-lead">{t('skills.lead')}</p>
      <div className="skills-groups">
        {groups.map((group, gi) => (
          <motion.div
            key={gi}
            className="glass-card skills-group"
            custom={gi}
            variants={groupVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            <div className="mono" style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 8 }}>
              {group.name}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {group.items.map((item, ti) => (
                <motion.span
                  key={item}
                  custom={ti}
                  variants={tagVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.1 }}
                  whileHover={{ scale: 1.08, y: -2 }}
                  className="tag skill-tag mono"
                >
                  {item}
                </motion.span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </SectionReveal>
  );
}
