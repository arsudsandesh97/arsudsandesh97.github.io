/**
 * Glassmorphism Design Tokens
 * Modern color palette with glass effects
 */

export const glassTheme = {
  // Primary Colors (Purple-Blue Gradient)
  colors: {
    primary: {
      50: '#f0f4ff',
      100: '#e0eaff',
      200: '#c7d9ff',
      300: '#a5bfff',
      400: '#849aff',
      500: '#6366f1',
      600: '#4f46e5',
      700: '#4338ca',
      800: '#3730a3',
      900: '#312e81',
    },
    
    // Backgrounds
    background: {
      primary: '#0f0f1e',
      secondary: '#1a1a2e',
      tertiary: '#16213e',
    },
    
    // Text
    text: {
      primary: 'rgba(255, 255, 255, 0.95)',
      secondary: 'rgba(255, 255, 255, 0.70)',
      tertiary: 'rgba(255, 255, 255, 0.50)',
      accent: '#6366f1',
    },
    
    // Glass colors
    glass: {
      white: {
        subtle: 'rgba(255, 255, 255, 0.05)',
        light: 'rgba(255, 255, 255, 0.1)',
        medium: 'rgba(255, 255, 255, 0.15)',
        strong: 'rgba(255, 255, 255, 0.25)',
      },
      dark: {
        subtle: 'rgba(0, 0, 0, 0.1)',
        light: 'rgba(0, 0, 0, 0.15)',
        medium: 'rgba(0, 0, 0, 0.25)',
        strong: 'rgba(0, 0, 0, 0.35)',
      },
    },
  },
  
  // Gradients
  gradients: {
    primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    accent: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    cosmic: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    sunset: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    background: 'linear-gradient(135deg, #0f0f1e 0%, #1a1a35 50%, #0f0f1e 100%)',
  },
  
  // Glass Effects
  glass: {
    blur: {
      sm: '10px',
      md: '20px',
      lg: '30px',
      xl: '40px',
    },
    border: {
      subtle: '1px solid rgba(255, 255, 255, 0.1)',
      light: '1px solid rgba(255, 255, 255, 0.15)',
      medium: '1px solid rgba(255, 255, 255, 0.2)',
      accent: '1px solid rgba(99, 102, 241, 0.3)',
    },
  },
  
  // Shadows
  shadows: {
    glass: {
      sm: '0 2px 16px -4px rgba(99, 102, 241, 0.1), 0 4px 24px -8px rgba(99, 102, 241, 0.05)',
      md: '0 8px 32px -4px rgba(99, 102, 241, 0.15), 0 12px 48px -8px rgba(99, 102, 241, 0.1)',
      lg: '0 16px 64px -8px rgba(99, 102, 241, 0.2), 0 24px 96px -16px rgba(99, 102, 241, 0.15)',
      glow: '0 0 20px rgba(99, 102, 241, 0.3), 0 0 40px rgba(99, 102, 241, 0.2)',
    },
  },
  
  // Typography
  typography: {
    fonts: {
      primary: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      heading: "'Satoshi', 'Inter', sans-serif",
      mono: "'JetBrains Mono', 'Fira Code', monospace",
    },
    sizes: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '3.75rem',
      '7xl': '4.5rem',
    },
    weights: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },
  },
  
  // Spacing
  spacing: {
    1: '0.25rem',
    2: '0.5rem',
    3: '0.75rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    8: '2rem',
    10: '2.5rem',
    12: '3rem',
    16: '4rem',
    20: '5rem',
    24: '6rem',
    32: '8rem',
  },
  
  // Border Radius
  radius: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '32px',
    full: '9999px',
  },
  
  // Transitions
  transitions: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    base: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '500ms cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: '600ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
  
  // Breakpoints
  breakpoints: {
    xs: '480px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
};

// CSS Custom Properties Generator
export function generateCSSVariables() {
  return `
    /* Colors */
    --primary-500: ${glassTheme.colors.primary[500]};
    --primary-600: ${glassTheme.colors.primary[600]};
    --bg-primary: ${glassTheme.colors.background.primary};
    --bg-secondary: ${glassTheme.colors.background.secondary};
    --text-primary: ${glassTheme.colors.text.primary};
    --text-secondary: ${glassTheme.colors.text.secondary};
    
    /* Glass */
    --glass-white-light: ${glassTheme.colors.glass.white.light};
    --glass-white-medium: ${glassTheme.colors.glass.white.medium};
    
    /* Gradients */
    --gradient-primary: ${glassTheme.gradients.primary};
    --gradient-background: ${glassTheme.gradients.background};
    
    /* Shadows */
    --shadow-glass-md: ${glassTheme.shadows.glass.md};
    --shadow-glass-lg: ${glassTheme.shadows.glass.lg};
    
    /* Typography */
    --font-primary: ${glassTheme.typography.fonts.primary};
    
    /* Transitions */
    --transition-base: ${glassTheme.transitions.base};
  `;
}
