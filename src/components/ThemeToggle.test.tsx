import userEvent from '@testing-library/user-event';
import { renderWithProviders, screen } from '../test/utils';
import ThemeToggle from './ThemeToggle';

beforeEach(() => {
  localStorage.clear();
  document.documentElement.removeAttribute('data-theme');
});

test('toggles the document theme attribute', async () => {
  renderWithProviders(<ThemeToggle />);
  const btn = screen.getByRole('button', { name: /switch theme/i });
  await userEvent.click(btn);
  expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  await userEvent.click(btn);
  expect(document.documentElement.getAttribute('data-theme')).toBe('light');
});
