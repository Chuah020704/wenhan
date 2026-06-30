import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();
  return (
    <footer
      style={{
        borderTop: '1px solid var(--border)',
        padding: '24px',
        textAlign: 'center',
        color: 'var(--muted)',
        fontSize: 13,
      }}
    >
      <span className="mono">
        © {year} Chuah Wen Han · {t('footer.rights')}
      </span>
    </footer>
  );
}
