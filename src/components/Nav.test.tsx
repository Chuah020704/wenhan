import userEvent from '@testing-library/user-event';
import { renderWithProviders, screen } from '../test/utils';
import i18n from '../i18n';
import Nav from './Nav';

beforeEach(async () => {
  await i18n.changeLanguage('en');
});

test('renders section anchor links and both toggles', () => {
  renderWithProviders(<Nav />);
  expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('href', '#about');
  expect(screen.getByRole('link', { name: 'Projects' })).toHaveAttribute('href', '#projects');
  expect(screen.getByRole('button', { name: /switch language/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /switch theme/i })).toBeInTheDocument();
});

test('shows the profile avatar at the top right', () => {
  renderWithProviders(<Nav />);
  const avatar = screen.getByAltText('Portrait of Chuah Wen Han');
  expect(avatar.getAttribute('src')).toContain('Jit%20Sin_face.jpg');
  expect(avatar.closest('a')).toHaveClass('nav-avatar');
});

test('hamburger button toggles aria-expanded', async () => {
  renderWithProviders(<Nav />);
  const btn = screen.getByRole('button', { name: /toggle menu/i });
  expect(btn).toHaveAttribute('aria-expanded', 'false');
  await userEvent.click(btn);
  expect(btn).toHaveAttribute('aria-expanded', 'true');
});
