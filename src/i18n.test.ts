import i18n from './i18n';

test('defaults to English', () => {
  expect(i18n.language).toBe('en');
  expect(i18n.t('nav.about')).toBe('About');
});

test('switches to Mandarin', async () => {
  await i18n.changeLanguage('zh');
  expect(i18n.t('nav.about')).toBe('关于');
  await i18n.changeLanguage('en');
});

test('experience jobs is an array of objects', () => {
  const jobs = i18n.t('experience.jobs', { returnObjects: true }) as Array<{ company: string }>;
  expect(Array.isArray(jobs)).toBe(true);
  expect(jobs[0].company).toBe('Intel Microelectronics (M) Sdn. Bhd.');
});
