import { renderWithProviders, screen } from '../test/utils';
import i18n from '../i18n';
import Experience from './Experience';

beforeEach(async () => {
  await i18n.changeLanguage('en');
});

test('renders a timeline entry per job', () => {
  renderWithProviders(<Experience />);
  expect(screen.getByText('Intel Microelectronics (M) Sdn. Bhd.')).toBeInTheDocument();
  expect(screen.getByText('Oct 2025 — Present')).toBeInTheDocument();
  expect(screen.getByText('Micro Modular System Sdn. Bhd.')).toBeInTheDocument();
});
