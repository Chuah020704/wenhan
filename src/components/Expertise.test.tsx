import { renderWithProviders, screen } from '../test/utils';
import i18n from '../i18n';
import Expertise from './Expertise';

beforeEach(async () => {
  await i18n.changeLanguage('en');
});

test('renders expertise areas with tags', () => {
  renderWithProviders(<Expertise />);
  expect(screen.getByText('Agentic LLM systems')).toBeInTheDocument();
  expect(screen.getByText('RAG & retrieval infrastructure')).toBeInTheDocument();
  expect(screen.getByText('FastMCP')).toBeInTheDocument();
});
