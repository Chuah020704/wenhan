import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import i18n from './i18n';
import App from './App';

beforeEach(async () => {
  localStorage.clear();
  document.documentElement.removeAttribute('data-theme');
  await i18n.changeLanguage('en');
});

test('renders all sections in English', () => {
  render(<App />);
  expect(document.getElementById('hero')).not.toBeNull();
  expect(document.getElementById('about')).not.toBeNull();
  expect(document.getElementById('experience')).not.toBeNull();
  expect(document.getElementById('skills')).not.toBeNull();
  expect(document.getElementById('projects')).not.toBeNull();
  expect(document.getElementById('contact')).not.toBeNull();
});

test('language toggle switches whole-page nav text to Mandarin', async () => {
  render(<App />);
  expect(screen.getAllByText('About').length).toBeGreaterThan(0);
  await userEvent.click(screen.getByRole('button', { name: /switch language/i }));
  expect(screen.getAllByText('关于').length).toBeGreaterThan(0);
});
