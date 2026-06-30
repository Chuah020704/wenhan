import { render, screen } from '@testing-library/react';
import SectionReveal from './SectionReveal';

test('renders children inside a section with the given id', () => {
  render(
    <SectionReveal id="about">
      <p>hello</p>
    </SectionReveal>,
  );
  expect(screen.getByText('hello')).toBeInTheDocument();
  expect(document.getElementById('about')).not.toBeNull();
});
