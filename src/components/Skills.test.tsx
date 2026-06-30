import { renderWithProviders, screen } from '../test/utils';
import i18n from '../i18n';
import Skills from './Skills';

beforeEach(async () => {
  await i18n.changeLanguage('en');
});

test('renders skill groups and items', () => {
  renderWithProviders(<Skills />);
  expect(screen.getByText('Languages')).toBeInTheDocument();
  expect(screen.getByText('Python')).toBeInTheDocument();
  expect(screen.getByText('FastAPI')).toBeInTheDocument();
});
