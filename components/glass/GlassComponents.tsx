/**
 * Glassmorphism Utility Classes
 * Reusable glass effect components
 */

import styled from 'styled-components';

// Glass Card Levels
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

// Glass Button
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
  font-family: 'Inter', sans-serif;
  
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

// Glass Input
export const GlassInput = styled.input`
  width: 100%;
  padding: 14px 20px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 16px;
  font-family: 'Inter', sans-serif;
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

// Glass Badge
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
  font-family: 'JetBrains Mono', monospace;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(99, 102, 241, 0.2);
    transform: translateY(-2px);
  }
`;

// Glass Container
export const GlassContainer = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
  
  @media (max-width: 768px) {
    padding: 0 16px;
  }
`;

// Glass Section
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

// Animated Background
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
