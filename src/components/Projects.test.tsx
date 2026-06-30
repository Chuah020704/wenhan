import { renderWithProviders, screen } from '../test/utils';
import i18n from '../i18n';
import Projects from './Projects';

beforeEach(async () => {
  await i18n.changeLanguage('en');
});

test('renders project cards with no external links', () => {
  const { container } = renderWithProviders(<Projects />);
  expect(screen.getByText('EzBot — Enterprise Multi-Agent Knowledge Platform')).toBeInTheDocument();
  expect(screen.getByText('BSOD Copilot — AI Windows Crash Dump Analyzer')).toBeInTheDocument();
  expect(container.querySelectorAll('a').length).toBe(0);
});
