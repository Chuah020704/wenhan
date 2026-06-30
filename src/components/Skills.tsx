import { useTranslation } from 'react-i18next';
import SectionReveal from './SectionReveal';

interface Group {
  name: string;
  items: string[];
}

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
        {groups.map((group, i) => (
          <div key={i}>
            <div className="mono" style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 8 }}>
              {group.name}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {group.items.map((item) => (
                <span
                  key={item}
                  style={{
                    border: '1px solid var(--border)',
                    borderRadius: 6,
                    padding: '6px 12px',
                    fontSize: 13,
                    background: 'var(--card-bg)',
                  }}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </SectionReveal>
  );
}
