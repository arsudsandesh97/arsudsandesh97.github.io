# Glassmorphism Design System

A modern, premium design system built around **Glassmorphism**, dark space aesthetics, and smooth micro-animations. This system is designed for high visual appeal, excellent contrast, and fluid responsiveness.

---

## 1. Visual Identity & Aesthetic Philosophy

- **Atmosphere:** Deep Space, Cosmic, Modern, and Immersive. It pairs deep, dark backgrounds with vibrant neon gradients and translucent frosted glass overlays.
- **Core Principle:** Layered depth through variable glass blur, borders, shadows, and glowing accent states.
- **Primary Stack:** Built for Next.js and styled with **Styled Components** & **CSS Custom Variables**. Supports full dark/light theme switching.

---

## 2. Design Tokens

### A. Color Palette & Roles

#### Brand Colors (Purple-Indigo Gradient)
- **Primary Accent / Interactive:** `#6366f1` (Indigo-500)
- **Primary Accent Hover:** `#4f46e5` (Indigo-600)
- **Primary Accent Active:** `#4338ca` (Indigo-700)
- **Muted Primary:** `#a5bfff` (Indigo-300)

#### Background Palette (Dark Mode)
- **Base Canvas Background:** `#0f0f1e`
- **Secondary Section Background:** `#1a1a2e`
- **Tertiary/Card Background:** `#16213e`

#### Text Colors (Dark Mode)
- **Primary Text:** `rgba(255, 255, 255, 0.95)` (High contrast readability)
- **Secondary Text:** `rgba(255, 255, 255, 0.70)` (Captions, descriptive text)
- **Muted Text:** `rgba(255, 255, 255, 0.50)` (Placeholders, disabled status)
- **Text Accent:** `#6366f1` (Highlights, labels)

#### Glass Opacity Presets
- **Glass White subtle:** `rgba(255, 255, 255, 0.05)`
- **Glass White light:** `rgba(255, 255, 255, 0.1)`
- **Glass White medium:** `rgba(255, 255, 255, 0.15)`
- **Glass White strong:** `rgba(255, 255, 255, 0.25)`
- **Glass Dark subtle:** `rgba(0, 0, 0, 0.1)`
- **Glass Dark light:** `rgba(0, 0, 0, 0.15)`
- **Glass Dark medium:** `rgba(0, 0, 0, 0.25)`
- **Glass Dark strong:** `rgba(0, 0, 0, 0.35)`

#### Theme Variations (Fallback / Basic Styles)
| Property | Dark Theme | Light Theme |
| :--- | :--- | :--- |
| **Background (bg)** | `#000000` | `#FFFFFF` |
| **Light Background (bgLight)** | `#2E0249` | `#f0f0f0` |
| **Primary Theme Accent** | `#BF40BF` / `#854CE6` | `#be1adb` |
| **Card Fill** | `#171721` | `#FFFFFF` |
| **Light Card Fill** | `#191924` | *N/A* |
| **Button Color** | `#AA336A` | `#5c5b5b` |

---

### B. Gradients
Dynamic, colorful linear gradients that provide contrast and direct the user's eye:
- **Primary (Royal-Purple):** `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`
- **Accent (Pink-Sunset):** `linear-gradient(135deg, #f093fb 0%, #f5576c 100%)`
- **Cosmic (Teal-Cyan):** `linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)`
- **Sunset (Rose-Gold):** `linear-gradient(135deg, #fa709a 0%, #fee140 100%)`
- **Background Shift:** `linear-gradient(135deg, #0f0f1e 0%, #1a1a35 50%, #0f0f1e 100%)`

---

### C. Typography Rules

Fonts are optimized for scanning and readability, loading custom fonts with standard system fallbacks.

- **Primary Font Family:** `'Poppins', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif`
- **Heading Font Family:** `'Satoshi', 'Poppins', 'Inter', sans-serif`
- **Monospace Font Family:** `'Space Mono', 'JetBrains Mono', 'Fira Code', monospace`

#### Font Weights
- `Light` (300)
- `Normal` (400)
- `Medium` (500)
- `Semibold` (600)
- `Bold` (700)
- `Extrabold` (800)

#### Size Scale
- **`xs`**: `0.75rem` (12px)
- **`sm`**: `0.875rem` (14px)
- **`base`**: `1.00rem` (16px)
- **`lg`**: `1.125rem` (18px)
- **`xl`**: `1.25rem` (20px)
- **`2xl`**: `1.50rem` (24px)
- **`3xl`**: `1.875rem` (30px)
- **`4xl`**: `2.25rem` (36px)
- **`5xl`**: `3.00rem` (48px)
- **`6xl`**: `3.75rem` (60px)
- **`7xl`**: `4.50rem` (72px)

---

### D. Geometry, Borders & Elevation

#### Border Radii
- **`sm`**: `8px` — Inner elements, tags, badge borders
- **`md`**: `12px` — Buttons, text fields, small widgets
- **`lg`**: `16px` — Nested containers, list items
- **`xl` / `2xl`**: `20px` / `24px` — Cards, modals, dialogs
- **`3xl`**: `32px` — Large hero containers
- **`full`**: `9999px` — Pill buttons, circular avatars

#### Glass Borders (Semi-transparent strokes)
- **Subtle:** `1px solid rgba(255, 255, 255, 0.1)`
- **Light:** `1px solid rgba(255, 255, 255, 0.15)`
- **Medium:** `1px solid rgba(255, 255, 255, 0.2)`
- **Accent Highlight:** `1px solid rgba(99, 102, 241, 0.3)`

#### Shadows & Glows
- **Glass Shadow Small:** `0 2px 16px -4px rgba(99, 102, 241, 0.1), 0 4px 24px -8px rgba(99, 102, 241, 0.05)`
- **Glass Shadow Medium:** `0 8px 32px -4px rgba(99, 102, 241, 0.15), 0 12px 48px -8px rgba(99, 102, 241, 0.1)`
- **Glass Shadow Large:** `0 16px 64px -8px rgba(99, 102, 241, 0.2), 0 24px 96px -16px rgba(99, 102, 241, 0.15)`
- **Accent Glow Pulse:** `0 0 20px rgba(99, 102, 241, 0.3), 0 0 40px rgba(99, 102, 241, 0.2)`

---

## 3. Global CSS Variables & Classes
You can import or inject these definitions directly into your global stylesheet.

```css
/* Custom variables injected into :root */
:root {
  /* Colors */
  --primary-500: #6366f1;
  --primary-600: #4f46e5;
  --bg-primary: #0f0f1e;
  --bg-secondary: #1a1a2e;
  --text-primary: rgba(255, 255, 255, 0.95);
  --text-secondary: rgba(255, 255, 255, 0.70);
  
  /* Glass overlays */
  --glass-white-light: rgba(255, 255, 255, 0.1);
  --glass-white-medium: rgba(255, 255, 255, 0.15);
  
  /* Gradients */
  --gradient-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --gradient-background: linear-gradient(135deg, #0f0f1e 0%, #1a1a35 50%, #0f0f1e 100%);
  
  /* Shadows */
  --shadow-glass-md: 0 8px 32px -4px rgba(99, 102, 241, 0.15), 0 12px 48px -8px rgba(99, 102, 241, 0.1);
  --shadow-glass-lg: 0 16px 64px -8px rgba(99, 102, 241, 0.2), 0 24px 96px -16px rgba(99, 102, 241, 0.15);
  --shadow-glass-glow: 0 0 20px rgba(99, 102, 241, 0.3), 0 0 40px rgba(99, 102, 241, 0.2);
  
  /* Typography */
  --font-primary: 'Poppins', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: 'Space Mono', 'JetBrains Mono', monospace;
  
  /* Transitions */
  --transition-base: 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

/* Custom Scrollbar Styles */
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  background: #1a1a1a;
}
::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #854CE6, #6366f1);
  border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #6f3bb8, #4f46e5);
}

/* Glassmorphism Levels utility classes */
.glass-1 {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px) saturate(180%);
  -webkit-backdrop-filter: blur(10px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.glass-2 {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.glass-3 {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(30px) saturate(200%);
  -webkit-backdrop-filter: blur(30px) saturate(200%);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* Text with Gradient clipping */
.gradient-text {
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

---

## 4. Keyframe Animations & Micro-Animations

Incorporate these animations to add a dynamic, fluid atmosphere to the website.

```css
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

@keyframes glow-pulse {
  0%, 100% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
}

@keyframes gradient-shift {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes scale-in {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Active Animation Classes */
.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animate-glow {
  animation: glow-pulse 2s ease-in-out infinite;
}

.animate-fade-in-up {
  animation: fade-in-up 0.6s ease-out forwards;
}

.animate-scale-in {
  animation: scale-in 0.4s ease-out forwards;
}
```

---

## 5. Reusable Component Code (Styled Components)

Copy and paste these definitions to create consistent UI components in other React/Styled-Components projects.

```tsx
import styled from 'styled-components';

// 1. Frosted Glass Cards
export const GlassCard = styled.div<{ level?: 1 | 2 | 3 }>`
  position: relative;
  background: ${({ level = 2 }) => 
    level === 1 ? 'rgba(255, 255, 255, 0.05)' :
    level === 2 ? 'rgba(255, 255, 255, 0.1)' :
    'rgba(255, 255, 255, 0.15)'
  };
  backdrop-filter: blur(${({ level = 2 }) => 
    level === 1 ? '10px' :
    level === 2 ? '20px' :
    '30px'
  }) saturate(180%);
  -webkit-backdrop-filter: blur(${({ level = 2 }) => 
    level === 1 ? '10px' :
    level === 2 ? '20px' :
    '30px'
  }) saturate(180%);
  border-radius: 24px;
  border: 1px solid ${({ level = 2 }) => 
    level === 1 ? 'rgba(255, 255, 255, 0.1)' :
    level === 2 ? 'rgba(255, 255, 255, 0.15)' :
    'rgba(255, 255, 255, 0.2)'
  };
  padding: 32px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    transform: translateY(-8px);
    border-color: rgba(99, 102, 241, 0.3);
    box-shadow: 
      0 16px 64px -8px rgba(99, 102, 241, 0.2),
      0 24px 96px -16px rgba(99, 102, 241, 0.15);
  }
`;

// Glowing Aura Overlay for Glass Cards (Child Element)
export const GlassCardGlow = styled.div`
  position: absolute;
  inset: 0;
  border-radius: 24px;
  background: linear-gradient(
    135deg,
    rgba(99, 102, 241, 0.1),
    transparent
  );
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
  
  ${GlassCard}:hover & {
    opacity: 1;
  }
`;

// 2. Interactive Glass Buttons
export const GlassButton = styled.button<{ variant?: 'primary' | 'secondary' | 'ghost' }>`
  position: relative;
  padding: 14px 32px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: 'Poppins', 'Inter', sans-serif;
  
  ${({ variant = 'primary' }) => {
    if (variant === 'primary') {
      return `
        background: linear-gradient(135deg, #6366f1, #4f46e5);
        color: white;
        border: 1px solid rgba(99, 102, 241, 0.3);
        box-shadow: 0 4px 20px rgba(99, 102, 241, 0.3);
        
        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(99, 102, 241, 0.4);
        }
      `;
    } else if (variant === 'secondary') {
      return `
        background: rgba(99, 102, 241, 0.1);
        backdrop-filter: blur(10px);
        color: #6366f1;
        border: 1px solid rgba(99, 102, 241, 0.2);
        
        &:hover {
          background: rgba(99, 102, 241, 0.15);
          border-color: rgba(99, 102, 241, 0.3);
          transform: translateY(-2px);
        }
      `;
    } else {
      return `
        background: transparent;
        color: rgba(255, 255, 255, 0.9);
        border: 1px solid rgba(255, 255, 255, 0.1);
        
        &:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.2);
        }
      `;
    }
  }}
  
  &:active {
    transform: translateY(0);
  }
`;

// 3. Glassmorphic Input Fields
export const GlassInput = styled.input`
  width: 100%;
  padding: 14px 20px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 16px;
  font-family: 'Poppins', 'Inter', sans-serif;
  transition: all 0.3s ease;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }
  
  &:focus {
    outline: none;
    border-color: rgba(99, 102, 241, 0.5);
    background: rgba(255, 255, 255, 0.08);
    box-shadow: 0 0 20px rgba(99, 102, 241, 0.2);
  }
`;

// 4. Code & Technical Badges
export const GlassBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 6px 14px;
  background: rgba(99, 102, 241, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: 8px;
  color: #a5bfff;
  font-size: 13px;
  font-weight: 600;
  font-family: 'Space Mono', monospace;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(99, 102, 241, 0.2);
    transform: translateY(-2px);
  }
`;

// 5. Layout Containers
export const GlassContainer = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
  
  @media (max-width: 768px) {
    padding: 0 16px;
  }
`;

export const GlassSection = styled.section`
  position: relative;
  padding: 120px 0;
  min-height: 100vh;
  display: flex;
  align-items: center;
  
  @media (max-width: 768px) {
    padding: 80px 0;
    min-height: auto;
  }
`;

// 6. Immersive Moving Background with Floating Lights
export const AnimatedBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
  background: linear-gradient(
    135deg,
    #0f0f1e 0%,
    #1a1a35 50%,
    #0f0f1e 100%
  );
  background-size: 200% 200%;
  animation: gradientShift 15s ease infinite;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: 
      radial-gradient(circle at 20% 50%, rgba(99, 102, 241, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(147, 51, 234, 0.1) 0%, transparent 50%);
    animation: float 20s ease-in-out infinite;
  }
  
  @keyframes gradientShift {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
  }
`;
```

---

## 6. Setup Guide for New Web Applications

To integrate this design system into a new Next.js / React application:

1. **Include Fonts:** Update your root layout or HTML headers to load the `'Poppins'` and `'Space Mono'` fonts from Google Fonts (or via Next.js Google Fonts integration).
2. **Setup Global Styles:** Create a stylesheet named `globals.css` containing the CSS variables, custom scrollbar styling, and keyframes shown in **Section 3 & 4**.
3. **Register Theme Provider:** Set up styled-components or your framework's custom registry, wrapping the application's root with a `<ThemeProvider>` component. Use the primary tokens from **Section 2** inside your theme object.
4. **Import Glass Components:** Copy **Section 5** into a `GlassComponents.tsx` file inside your components folder to immediately begin constructing sections with pre-configured glassmorphism values.
