import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import BlogClient from './BlogClient';
import { ThemeProvider } from 'styled-components';

// Mock data
const mockPosts = [
  { id: 1, title: 'React Hooks', excerpt: 'Intro to hooks', tags: ['React'], slug: 'react-hooks' },
  { id: 2, title: 'Next.js Routing', excerpt: 'App router guide', tags: ['Next.js'], slug: 'nextjs-routing' },
];

const mockTags = ['React', 'Next.js'];

const renderWithTheme = (component) => {
  const theme = {
    bg: '#fff',
    primary: '#0070f3',
    text_primary: '#000',
    text_secondary: '#666',
    card_light: '#f5f5f5',
  };
  return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
};

describe('BlogClient', () => {
  it('renders initial posts', () => {
    renderWithTheme(<BlogClient initialPosts={mockPosts} initialTags={mockTags} />);
    expect(screen.getByText('React Hooks')).toBeInTheDocument();
    expect(screen.getByText('Next.js Routing')).toBeInTheDocument();
  });

  it('filters by search query', async () => {
    renderWithTheme(<BlogClient initialPosts={mockPosts} initialTags={mockTags} />);
    
    const searchInput = screen.getByPlaceholderText('Search articles...');
    fireEvent.change(searchInput, { target: { value: 'Hooks' } });

    await waitFor(() => {
      expect(screen.getByText('React Hooks')).toBeInTheDocument();
      expect(screen.queryByText('Next.js Routing')).not.toBeInTheDocument();
    });
  });

  it('filters by tag', () => {
    renderWithTheme(<BlogClient initialPosts={mockPosts} initialTags={mockTags} />);
    
    const nextJsTag = screen.getByText('Next.js');
    fireEvent.click(nextJsTag);

    expect(screen.queryByText('React Hooks')).not.toBeInTheDocument();
    expect(screen.getByText('Next.js Routing')).toBeInTheDocument();
  });

  it('shows empty state when no matches', async () => {
    renderWithTheme(<BlogClient initialPosts={mockPosts} initialTags={mockTags} />);
    
    const searchInput = screen.getByPlaceholderText('Search articles...');
    fireEvent.change(searchInput, { target: { value: 'Angular' } });

    await waitFor(() => {
      expect(screen.getByText(/No results for "Angular"/i)).toBeInTheDocument();
    });
  });
});
