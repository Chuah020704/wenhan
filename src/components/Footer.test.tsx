import { renderWithProviders, screen } from '../test/utils';
import i18n from '../i18n';
import Footer from './Footer';

beforeEach(async () => {
  await i18n.changeLanguage('en');
});

test('renders the footer rights text', () => {
  renderWithProviders(<Footer />);
  expect(screen.getByText(/All rights reserved/i)).toBeInTheDocument();
});
