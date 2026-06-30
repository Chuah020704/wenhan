import { renderWithProviders, screen } from '../test/utils';
import i18n from '../i18n';
import Contact from './Contact';

beforeEach(async () => {
  await i18n.changeLanguage('en');
});

test('renders email, linkedin, and github links', () => {
  renderWithProviders(<Contact />);
  expect(screen.getByRole('link', { name: 'Email' })).toHaveAttribute(
    'href',
    'mailto:HANWEN0704@gmail.com',
  );
  expect(screen.getByRole('link', { name: 'LinkedIn' })).toHaveAttribute(
    'href',
    'https://www.linkedin.com/in/chuahwenhan/',
  );
  expect(screen.getByRole('link', { name: 'GitHub' })).toHaveAttribute(
    'href',
    'https://github.com/Chuah020704',
  );
});
