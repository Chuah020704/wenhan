import { renderWithProviders, screen } from '../test/utils';
import i18n from '../i18n';
import About from './About';

beforeEach(async () => {
  await i18n.changeLanguage('en');
});

test('renders the about title and bio', () => {
  renderWithProviders(<About />);
  expect(screen.getByRole('heading', { name: /About/i })).toBeInTheDocument();
  expect(screen.getByText(/Computer Engineering \(Artificial Intelligence\) graduate/i)).toBeInTheDocument();
});
