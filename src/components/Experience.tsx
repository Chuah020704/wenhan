import { useTranslation } from 'react-i18next';
import SectionReveal from './SectionReveal';

interface Job {
  role: string;
  company: string;
  period: string;
  description: string;
}

export default function Experience() {
  const { t } = useTranslation();
  const jobs = t('experience.jobs', { returnObjects: true }) as Job[];
  return (
    <SectionReveal id="experience">
      <p className="mono" style={{ color: 'var(--accent-from)', fontSize: 13 }}>
        // experience
      </p>
      <h2 style={{ fontSize: 28, fontWeight: 800, margin: '8px 0 24px' }}>
        {t('experience.title')}
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {jobs.map((job, i) => (
          <div
            key={i}
            style={{ borderLeft: '2px solid var(--border)', paddingLeft: 20, position: 'relative' }}
          >
            <span
              style={{
                position: 'absolute',
                left: -7,
                top: 4,
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: 'var(--accent-from)',
              }}
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 8,
              }}
            >
              <strong>{job.role}</strong>
              <span className="mono" style={{ color: 'var(--muted)', fontSize: 13 }}>
                {job.period}
              </span>
            </div>
            <div style={{ color: 'var(--accent-to)', fontSize: 14 }}>{job.company}</div>
            <p style={{ color: 'var(--muted)', marginTop: 6 }}>{job.description}</p>
          </div>
        ))}
      </div>
    </SectionReveal>
  );
}
