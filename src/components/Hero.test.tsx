import { renderWithProviders, screen } from '../test/utils';
import i18n from '../i18n';
import Hero from './Hero';

beforeEach(async () => {
  await i18n.changeLanguage('en');
});

test('renders eyebrow, accent headline, photo, and CTAs in English', () => {
  renderWithProviders(<Hero />);
  expect(screen.getByText('// full-stack AI & cloud engineer')).toBeInTheDocument();
  expect(screen.getByText('intelligent')).toBeInTheDocument();
  expect(screen.getByAltText('Portrait of Chuah Wen Han')).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'View my work' })).toHaveAttribute('href', '#projects');
});

test('renders Mandarin headline accent when language is zh', async () => {
  await i18n.changeLanguage('zh');
  renderWithProviders(<Hero />);
  expect(screen.getByText('智能')).toBeInTheDocument();
  await i18n.changeLanguage('en');
});
