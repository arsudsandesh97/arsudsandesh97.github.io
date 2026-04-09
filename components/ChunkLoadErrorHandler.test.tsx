import { describe, it, expect } from 'vitest';
import { renderWithProviders, screen } from '@/lib/test/test-utils';
import ChunkLoadErrorHandler from '@/components/ChunkLoadErrorHandler';

describe('ChunkLoadErrorHandler', () => {
  it('renders without crashing', () => {
    renderWithProviders(<ChunkLoadErrorHandler />);
    // Component renders nothing visible, just event listeners
    expect(document.body).toBeInTheDocument();
  });

  it('does not render any visible elements', () => {
    const { container } = renderWithProviders(<ChunkLoadErrorHandler />);
    expect(container.firstChild).toBeNull();
  });
});
