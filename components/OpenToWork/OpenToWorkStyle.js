import styled, { keyframes, css } from "styled-components";
import { motion } from "framer-motion";

// Animations
const pulseGlow = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.5);
  }
  50% {
    box-shadow: 0 0 0 8px rgba(34, 197, 94, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(34, 197, 94, 0);
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
`;

const glow = keyframes`
  0%, 100% {
    box-shadow: 0 0 20px rgba(34, 197, 94, 0.3);
  }
  50% {
    box-shadow: 0 0 30px rgba(34, 197, 94, 0.5);
  }
`;

// Container
export const WidgetContainer = styled(motion.div)`
  position: fixed;
  ${({ $position }) =>
    $position === "bottom-left"
      ? css`
          left: 20px;
          bottom: 20px;
        `
      : css`
          right: 20px;
          bottom: 20px;
        `}
  z-index: 1000;
  font-family: var(--font-poppins), "Poppins", sans-serif;

  @media (max-width: 768px) {
    left: 12px !important;
    right: 12px !important;
    bottom: 90px !important;
    width: auto;
    max-width: none;
  }

  @media (max-width: 480px) {
    left: 10px !important;
    right: 10px !important;
    bottom: 85px !important;
  }
`;

// Minimal Widget Button
export const MinimalWidget = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 14px 20px;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  background: linear-gradient(
    135deg,
    rgba(34, 197, 94, 0.2) 0%,
    rgba(34, 197, 94, 0.1) 100%
  );
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 2px solid rgba(34, 197, 94, 0.4);
  box-shadow: 
    0 4px 24px rgba(0, 0, 0, 0.2),
    0 0 40px rgba(34, 197, 94, 0.15);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  animation: ${float} 4s ease-in-out infinite, ${glow} 3s ease-in-out infinite;
  min-height: 48px; /* Touch-friendly minimum height */

  &:hover {
    transform: scale(1.08) translateY(-2px);
    box-shadow: 
      0 8px 32px rgba(0, 0, 0, 0.25),
      0 0 60px rgba(34, 197, 94, 0.25);
    border-color: rgba(34, 197, 94, 0.6);
  }

  &:focus {
    outline: 2px solid rgba(34, 197, 94, 0.6);
    outline-offset: 2px;
  }

  &:active {
    transform: scale(0.98);
  }

  @media (max-width: 768px) {
    width: 100%;
    padding: 16px 24px;
  }
`;

export const StatusDot = styled.span`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  animation: ${pulseGlow} 2s ease-in-out infinite;
  flex-shrink: 0;
`;

export const StatusText = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #22c55e;
  white-space: nowrap;
  letter-spacing: 0.3px;
  text-shadow: 0 0 20px rgba(34, 197, 94, 0.4);
`;

// Expanded Widget
export const ExpandedWidget = styled(motion.div)`
  background: ${({ theme }) =>
    theme.bg === "#000000"
      ? "linear-gradient(160deg, rgba(20, 20, 28, 0.98) 0%, rgba(25, 25, 36, 0.99) 100%)"
      : "linear-gradient(160deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 248, 252, 0.99) 100%)"};
  backdrop-filter: blur(40px);
  -webkit-backdrop-filter: blur(40px);
  border-radius: 24px;
  padding: 0;
  width: 380px;
  max-width: calc(100vw - 40px);
  max-height: calc(100vh - 120px);
  overflow-y: auto;
  -webkit-overflow-scrolling: touch; /* Smooth scrolling on iOS */
  border: 1px solid ${({ theme }) =>
    theme.bg === "#000000"
      ? "rgba(255, 255, 255, 0.1)"
      : "rgba(0, 0, 0, 0.08)"};
  box-shadow: 
    0 25px 80px rgba(0, 0, 0, 0.4),
    0 0 120px rgba(34, 197, 94, 0.1);
  position: relative;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(
      90deg,
      #22c55e,
      #16a34a,
      #22c55e
    );
    background-size: 200% 100%;
    animation: ${shimmer} 2s linear infinite;
    border-radius: 24px 24px 0 0;
  }

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(34, 197, 94, 0.3);
    border-radius: 3px;
  }

  @media (max-width: 768px) {
    width: 100%;
    max-width: 100%;
    max-height: calc(100vh - 180px);
    border-radius: 20px;
  }

  @media (max-width: 480px) {
    max-height: calc(100vh - 160px);
    border-radius: 18px;
  }
`;

// Header
export const WidgetHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px 16px;

  @media (max-width: 480px) {
    padding: 16px 16px 12px;
  }
`;

export const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 20px;
  background: linear-gradient(
    135deg,
    rgba(34, 197, 94, 0.2) 0%,
    rgba(34, 197, 94, 0.1) 100%
  );
  border: 1px solid rgba(34, 197, 94, 0.3);
  font-size: 12px;
  font-weight: 600;
  color: #22c55e;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const CloseButton = styled.button`
  width: 40px;
  height: 40px;
  min-width: 40px; /* Prevent shrinking */
  border-radius: 50%;
  border: none;
  background: ${({ theme }) =>
    theme.bg === "#000000"
      ? "rgba(255, 255, 255, 0.05)"
      : "rgba(0, 0, 0, 0.05)"};
  color: ${({ theme }) => theme.text_secondary};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  font-size: 16px;

  &:hover {
    background: ${({ theme }) =>
      theme.bg === "#000000"
        ? "rgba(255, 255, 255, 0.1)"
        : "rgba(0, 0, 0, 0.1)"};
    color: ${({ theme }) => theme.text_primary};
    transform: scale(1.1);
  }

  &:focus {
    outline: 2px solid ${({ theme }) => theme.primary};
    outline-offset: 2px;
  }

  &:active {
    transform: scale(0.95);
  }
`;

// Profile Section
export const ProfileSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 0 24px 20px;

  @media (max-width: 480px) {
    padding: 0 16px 16px;
    gap: 12px;
  }
`;

export const ProfileImage = styled.img`
  width: 72px;
  height: 72px;
  min-width: 72px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid rgba(34, 197, 94, 0.4);
  box-shadow: 0 0 20px rgba(34, 197, 94, 0.2);

  @media (max-width: 480px) {
    width: 60px;
    height: 60px;
    min-width: 60px;
  }
`;

export const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
`;

export const ProfileName = styled.h3`
  font-size: 20px;
  font-weight: 700;
  margin: 0;
  color: ${({ theme }) => theme.text_primary};
  line-height: 1.2;

  @media (max-width: 480px) {
    font-size: 18px;
  }
`;

export const ProfileRole = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.text_secondary};
  margin: 0;
  font-weight: 500;
`;

export const AvailabilityBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 12px;
  background: linear-gradient(
    135deg,
    rgba(250, 204, 21, 0.15) 0%,
    rgba(234, 179, 8, 0.1) 100%
  );
  border: 1px solid rgba(250, 204, 21, 0.3);
  font-size: 11px;
  font-weight: 600;
  color: #facc15;
  width: fit-content;
  margin-top: 4px;
`;

// Sections
export const Section = styled.div`
  padding: 0 24px;
  margin-bottom: 16px;

  @media (max-width: 480px) {
    padding: 0 16px;
    margin-bottom: 14px;
  }
`;

export const SectionTitle = styled.h4`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.text_secondary};
  margin: 0 0 10px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

// Tags
export const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

export const Tag = styled.span`
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.2s ease;

  ${({ $variant }) =>
    $variant === "primary"
      ? css`
          background: linear-gradient(
            135deg,
            rgba(139, 92, 246, 0.15) 0%,
            rgba(139, 92, 246, 0.08) 100%
          );
          border: 1px solid rgba(139, 92, 246, 0.3);
          color: #a78bfa;
        `
      : $variant === "secondary"
      ? css`
          background: linear-gradient(
            135deg,
            rgba(59, 130, 246, 0.15) 0%,
            rgba(59, 130, 246, 0.08) 100%
          );
          border: 1px solid rgba(59, 130, 246, 0.3);
          color: #60a5fa;
        `
      : css`
          background: ${({ theme }) =>
            theme.bg === "#000000"
              ? "rgba(255, 255, 255, 0.05)"
              : "rgba(0, 0, 0, 0.05)"};
          border: 1px solid ${({ theme }) =>
            theme.bg === "#000000"
              ? "rgba(255, 255, 255, 0.1)"
              : "rgba(0, 0, 0, 0.1)"};
          color: ${({ theme }) => theme.text_primary};
        `}

  &:hover {
    transform: translateY(-1px);
  }
`;

// Info Grid
export const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  padding: 0 24px;
  margin-bottom: 16px;
`;

export const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  border-radius: 12px;
  background: ${({ theme, $highlight }) =>
    $highlight
      ? "linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%)"
      : theme.bg === "#000000"
      ? "rgba(255, 255, 255, 0.03)"
      : "rgba(0, 0, 0, 0.02)"};
  border: 1px solid ${({ theme, $highlight }) =>
    $highlight
      ? "rgba(168, 85, 247, 0.3)"
      : theme.bg === "#000000"
      ? "rgba(255, 255, 255, 0.06)"
      : "rgba(0, 0, 0, 0.06)"};
  ${({ $highlight }) =>
    $highlight &&
    css`
      box-shadow: 0 0 20px rgba(168, 85, 247, 0.1);
    `}
`;

export const InfoIcon = styled.span`
  font-size: 18px;
`;

export const InfoContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const InfoLabel = styled.span`
  font-size: 10px;
  color: ${({ theme }) => theme.text_secondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const InfoValue = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.text_primary};
`;

// Contact Methods
export const ContactMethods = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const ContactButton = styled.a`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 14px;
  background: ${({ theme }) =>
    theme.bg === "#000000"
      ? "rgba(255, 255, 255, 0.03)"
      : "rgba(0, 0, 0, 0.02)"};
  border: 1px solid ${({ theme }) =>
    theme.bg === "#000000"
      ? "rgba(255, 255, 255, 0.06)"
      : "rgba(0, 0, 0, 0.06)"};
  text-decoration: none;
  color: ${({ theme }) => theme.text_primary};
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;

  &:hover {
    background: linear-gradient(
      135deg,
      rgba(${({ $variant }) => 
        $variant === "email" ? "59, 130, 246" :
        $variant === "linkedin" ? "10, 102, 194" :
        "34, 197, 94"
      }, 0.15) 0%,
      rgba(${({ $variant }) => 
        $variant === "email" ? "59, 130, 246" :
        $variant === "linkedin" ? "10, 102, 194" :
        "34, 197, 94"
      }, 0.08) 100%
    );
    border-color: ${({ $variant }) =>
      $variant === "email" ? "rgba(59, 130, 246, 0.4)" :
      $variant === "linkedin" ? "rgba(10, 102, 194, 0.4)" :
      "rgba(34, 197, 94, 0.4)"};
    transform: translateX(4px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  }

  &:focus {
    outline: 2px solid ${({ theme }) => theme.primary};
    outline-offset: 2px;
  }
`;

export const ContactIcon = styled.span`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  background: ${({ $variant }) =>
    $variant === "email"
      ? "linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(59, 130, 246, 0.1) 100%)"
      : $variant === "linkedin"
      ? "linear-gradient(135deg, rgba(10, 102, 194, 0.2) 0%, rgba(10, 102, 194, 0.1) 100%)"
      : "linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(34, 197, 94, 0.1) 100%)"};
`;

export const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
`;

export const ContactLabel = styled.span`
  font-size: 10px;
  color: ${({ theme }) => theme.text_secondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const ContactValue = styled.span`
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.text_primary};
`;

export const ArrowIcon = styled.span`
  color: ${({ theme }) => theme.text_secondary};
  opacity: 0;
  transform: translateX(-8px);
  transition: all 0.3s ease;
  font-size: 16px;

  ${ContactButton}:hover & {
    opacity: 1;
    transform: translateX(0);
  }
`;

// Divider
export const Divider = styled.div`
  height: 1px;
  background: ${({ theme }) =>
    theme.bg === "#000000"
      ? "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.08), transparent)"
      : "linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.08), transparent)"};
  margin: 16px 24px;

  @media (max-width: 480px) {
    margin: 12px 16px;
  }
`;

// Footer Actions
export const FooterActions = styled.div`
  display: flex;
  gap: 10px;
  padding: 16px 24px 24px;

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 8px;
    padding: 12px 16px 20px;
  }
`;

export const PrimaryButton = styled.a`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 20px;
  border-radius: 14px;
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  color: white;
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(34, 197, 94, 0.3);
  min-height: 48px; /* Touch-friendly */

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 25px rgba(34, 197, 94, 0.4);
  }

  &:active {
    transform: scale(0.98);
  }

  @media (max-width: 480px) {
    padding: 16px 24px;
    font-size: 14px;
  }
`;

export const SecondaryButton = styled.a`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 20px;
  border-radius: 14px;
  background: ${({ theme }) =>
    theme.bg === "#000000"
      ? "rgba(255, 255, 255, 0.05)"
      : "rgba(0, 0, 0, 0.05)"};
  border: 1px solid ${({ theme }) =>
    theme.bg === "#000000"
      ? "rgba(255, 255, 255, 0.1)"
      : "rgba(0, 0, 0, 0.1)"};
  color: ${({ theme }) => theme.text_primary};
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;

  &:hover {
    background: ${({ theme }) =>
      theme.bg === "#000000"
        ? "rgba(255, 255, 255, 0.1)"
        : "rgba(0, 0, 0, 0.1)"};
    transform: translateY(-2px);
  }
`;

// Legacy exports for backwards compatibility
export const WidgetDescription = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.text_secondary};
  margin: 0 0 20px 0;
  line-height: 1.6;
  padding: 0 24px;
`;

export const HeaderTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
  margin: 0;
  color: ${({ theme }) => theme.text_primary};
`;

export const OpenBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 20px;
  background: linear-gradient(
    135deg,
    rgba(34, 197, 94, 0.2) 0%,
    rgba(34, 197, 94, 0.1) 100%
  );
  border: 1px solid rgba(34, 197, 94, 0.3);
  font-size: 11px;
  font-weight: 600;
  color: #22c55e;
`;

export const FooterNote = styled.p`
  font-size: 11px;
  color: ${({ theme }) => theme.text_secondary};
  margin: 0;
  text-align: center;
  padding: 0 24px 20px;
  opacity: 0.7;
`;

// Fresher Badge - Special highlight for fresh graduates/entry-level
export const FresherBadge = styled.div`
  margin: 0 24px 16px;
  padding: 12px 16px;
  border-radius: 12px;
  background: linear-gradient(
    135deg,
    rgba(168, 85, 247, 0.12) 0%,
    rgba(59, 130, 246, 0.08) 50%,
    rgba(34, 197, 94, 0.08) 100%
  );
  border: 1px solid rgba(168, 85, 247, 0.25);
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.text_secondary};
  text-align: center;
  line-height: 1.5;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(168, 85, 247, 0.1),
      transparent
    );
    animation: ${shimmer} 3s linear infinite;
  }
`;
