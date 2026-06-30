import userEvent from '@testing-library/user-event';
import { renderWithProviders, screen } from '../test/utils';
import i18n from '../i18n';
import LanguageToggle from './LanguageToggle';

beforeEach(async () => {
  await i18n.changeLanguage('en');
});

test('toggles language between en and zh', async () => {
  renderWithProviders(<LanguageToggle />);
  const btn = screen.getByRole('button', { name: /switch language/i });
  expect(i18n.language).toBe('en');
  await userEvent.click(btn);
  expect(i18n.language).toBe('zh');
  await userEvent.click(btn);
  expect(i18n.language).toBe('en');
});
