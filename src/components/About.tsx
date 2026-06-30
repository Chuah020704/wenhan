import { useTranslation } from 'react-i18next';
import SectionReveal from './SectionReveal';

export default function About() {
  const { t } = useTranslation();
  return (
    <SectionReveal id="about">
      <p className="mono" style={{ color: 'var(--accent-from)', fontSize: 13 }}>
        // about
      </p>
      <h2 style={{ fontSize: 28, fontWeight: 800, margin: '8px 0 16px' }}>{t('about.title')}</h2>
      <p style={{ color: 'var(--muted)', maxWidth: 700 }}>{t('about.body')}</p>
    </SectionReveal>
  );
}
