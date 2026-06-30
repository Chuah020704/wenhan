import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import ThemeProvider from '../theme/ThemeProvider';
import '../i18n';

export function renderWithProviders(ui: ReactElement, options?: RenderOptions) {
  return render(<ThemeProvider>{ui}</ThemeProvider>, options);
}

export * from '@testing-library/react';
