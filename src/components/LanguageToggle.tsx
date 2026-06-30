import { useTranslation } from 'react-i18next';

export default function LanguageToggle() {
  const { i18n } = useTranslation();
  const next = i18n.language === 'en' ? 'zh' : 'en';
  return (
    <button
      type="button"
      aria-label="Switch language"
      className="mono"
      onClick={() => i18n.changeLanguage(next)}
      style={{
        border: '1px solid var(--border)',
        borderRadius: 20,
        padding: '2px 10px',
        background: 'transparent',
        color: 'var(--text)',
        cursor: 'pointer',
        fontSize: 12,
      }}
    >
      {i18n.language === 'en' ? 'EN / 中' : '中 / EN'}
    </button>
  );
}
