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
      <p className="mono" style={{ color: 'var(--accent-from)', fontSize: 13 }}>
        // skills
      </p>
      <h2 style={{ fontSize: 28, fontWeight: 800, margin: '8px 0 24px' }}>{t('skills.title')}</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {groups.map((group, gi) => (
          <motion.div
            key={gi}
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
                  whileHover={{ scale: 1.08, borderColor: 'var(--accent-from)' }}
                  style={{
                    border: '1px solid var(--border)',
                    borderRadius: 6,
                    padding: '6px 12px',
                    fontSize: 13,
                    background: 'var(--card-bg)',
                    cursor: 'default',
                    display: 'inline-block',
                    transition: 'border-color 0.2s',
                  }}
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
