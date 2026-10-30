import { renderWithProviders, screen, waitFor } from '../test/utils';
import i18n from '../i18n';
import Hero from './Hero';

beforeEach(async () => {
  await i18n.changeLanguage('en');
});

test('renders AI-focused eyebrow, accent headline, stats and CTAs in English', () => {
  renderWithProviders(<Hero />);
  expect(screen.getByText('// AI engineer · LLM systems · cloud infra')).toBeInTheDocument();
  expect(screen.getByText('production-grade AI')).toBeInTheDocument();
  expect(screen.getByText('AI systems shipped')).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Explore my systems' })).toHaveAttribute(
    'href',
    '#projects',
  );
  expect(screen.getByText(/every keycap is a skill/)).toBeInTheDocument();
});

test('mounts the 3D keyboard scene lazily', async () => {
  renderWithProviders(<Hero />);
  await waitFor(() => expect(screen.getByTestId('keyboard-scene-mock')).toBeInTheDocument());
});

test('renders Mandarin headline accent when language is zh', async () => {
  await i18n.changeLanguage('zh');
  renderWithProviders(<Hero />);
  expect(screen.getByText('生产级 AI 系统')).toBeInTheDocument();
  await i18n.changeLanguage('en');
});
