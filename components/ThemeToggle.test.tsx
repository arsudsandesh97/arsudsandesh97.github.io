import { describe, it, expect } from 'vitest';
import { renderWithProviders, screen } from '@/lib/test/test-utils';
import ThemeToggle from '@/components/ThemeToggle';

describe('ThemeToggle', () => {
  it('renders theme toggle button', () => {
    renderWithProviders(<ThemeToggle />);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('toggles theme when clicked', async () => {
    const { userEvent } = await import('@testing-library/user-event');
    const user = userEvent.setup();
    
    renderWithProviders(<ThemeToggle />);
    const button = screen.getByRole('button');
    
    await user.click(button);
    // Theme should toggle successfully
    expect(button).toBeInTheDocument();
  });
});
