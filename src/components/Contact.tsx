import { useTranslation } from 'react-i18next';
import SectionReveal from './SectionReveal';

export default function Contact() {
  const { t } = useTranslation();
  const linkStyle = {
    border: '1px solid var(--border)',
    borderRadius: 8,
    padding: '10px 18px',
    color: 'var(--text)',
    textDecoration: 'none',
    fontSize: 14,
    background: 'var(--card-bg)',
  } as const;
  return (
    <SectionReveal id="contact">
      <p className="mono" style={{ color: 'var(--accent-from)', fontSize: 13 }}>
        // contact
      </p>
      <h2 style={{ fontSize: 28, fontWeight: 800, margin: '8px 0 12px' }}>{t('contact.title')}</h2>
      <p style={{ color: 'var(--muted)', marginBottom: 20 }}>{t('contact.intro')}</p>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <a href={`mailto:${t('contact.email')}`} style={linkStyle}>
          {t('contact.emailLabel')}
        </a>
        <a href={t('contact.linkedinUrl')} target="_blank" rel="noreferrer" style={linkStyle}>
          {t('contact.linkedinLabel')}
        </a>
        <a href={t('contact.githubUrl')} target="_blank" rel="noreferrer" style={linkStyle}>
          {t('contact.githubLabel')}
        </a>
      </div>
    </SectionReveal>
  );
}
