import { useTheme } from '../theme/ThemeProvider';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      type="button"
      aria-label="Switch theme"
      onClick={toggleTheme}
      style={{
        border: '1px solid var(--border)',
        borderRadius: 20,
        padding: '2px 10px',
        background: 'transparent',
        color: 'var(--text)',
        cursor: 'pointer',
        fontSize: 14,
      }}
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
}
