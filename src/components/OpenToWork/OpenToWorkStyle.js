import styled, { keyframes, css } from "styled-components";
import { motion } from "framer-motion";

// Pulse animation for the status indicator
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
    ${({ $position }) =>
      $position === "bottom-left"
        ? css`
            left: 12px;
            bottom: 80px;
          `
        : css`
            right: 12px;
            bottom: 80px;
          `}
  }
`;

export const MinimalWidget = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 18px;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  background: linear-gradient(
    135deg,
    rgba(34, 197, 94, 0.15) 0%,
    rgba(34, 197, 94, 0.08) 100%
  );
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(34, 197, 94, 0.3);
  box-shadow: 
    0 4px 20px rgba(0, 0, 0, 0.15),
    0 0 40px rgba(34, 197, 94, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  animation: ${float} 4s ease-in-out infinite;

  &:hover {
    transform: scale(1.05) translateY(-2px);
    box-shadow: 
      0 8px 30px rgba(0, 0, 0, 0.2),
      0 0 60px rgba(34, 197, 94, 0.2);
    border-color: rgba(34, 197, 94, 0.5);
  }

  &:focus {
    outline: 2px solid rgba(34, 197, 94, 0.6);
    outline-offset: 2px;
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
  font-size: 13px;
  font-weight: 600;
  color: #22c55e;
  white-space: nowrap;
  letter-spacing: 0.3px;
  text-shadow: 0 0 20px rgba(34, 197, 94, 0.3);
`;

export const ExpandedWidget = styled(motion.div)`
  background: ${({ theme }) =>
    theme.bg === "#000000"
      ? "linear-gradient(145deg, rgba(23, 23, 33, 0.95) 0%, rgba(25, 25, 36, 0.98) 100%)"
      : "linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(245, 245, 245, 0.98) 100%)"};
  backdrop-filter: blur(30px);
  -webkit-backdrop-filter: blur(30px);
  border-radius: 20px;
  padding: 24px;
  min-width: 300px;
  max-width: 340px;
  border: 1px solid ${({ theme }) =>
    theme.bg === "#000000"
      ? "rgba(255, 255, 255, 0.08)"
      : "rgba(0, 0, 0, 0.08)"};
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.3),
    0 0 100px rgba(34, 197, 94, 0.08);
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(
      90deg,
      transparent,
      #22c55e,
      transparent
    );
    background-size: 200% 100%;
    animation: ${shimmer} 3s linear infinite;
  }

  @media (max-width: 480px) {
    min-width: 280px;
    max-width: 300px;
    padding: 20px;
  }
`;

export const WidgetHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

export const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const HeaderTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
  margin: 0;
  color: ${({ theme }) => theme.text_primary};
  display: flex;
  align-items: center;
  gap: 8px;
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
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const CloseButton = styled.button`
  width: 32px;
  height: 32px;
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
  font-size: 18px;

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
`;

export const WidgetDescription = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.text_secondary};
  margin: 0 0 20px 0;
  line-height: 1.6;
`;

export const ContactMethods = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const ContactButton = styled.a`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 12px;
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
        $variant === "twitter" ? "29, 161, 242" :
        "34, 197, 94"
      }, 0.15) 0%,
      rgba(${({ $variant }) => 
        $variant === "email" ? "59, 130, 246" :
        $variant === "linkedin" ? "10, 102, 194" :
        $variant === "twitter" ? "29, 161, 242" :
        "34, 197, 94"
      }, 0.08) 100%
    );
    border-color: ${({ $variant }) =>
      $variant === "email" ? "rgba(59, 130, 246, 0.4)" :
      $variant === "linkedin" ? "rgba(10, 102, 194, 0.4)" :
      $variant === "twitter" ? "rgba(29, 161, 242, 0.4)" :
      "rgba(34, 197, 94, 0.4)"};
    transform: translateX(4px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }

  &:focus {
    outline: 2px solid ${({ theme }) => theme.primary};
    outline-offset: 2px;
  }
`;

export const ContactIcon = styled.span`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  background: ${({ $variant }) =>
    $variant === "email"
      ? "linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(59, 130, 246, 0.1) 100%)"
      : $variant === "linkedin"
      ? "linear-gradient(135deg, rgba(10, 102, 194, 0.2) 0%, rgba(10, 102, 194, 0.1) 100%)"
      : $variant === "twitter"
      ? "linear-gradient(135deg, rgba(29, 161, 242, 0.2) 0%, rgba(29, 161, 242, 0.1) 100%)"
      : "linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(34, 197, 94, 0.1) 100%)"};
  color: ${({ $variant }) =>
    $variant === "email" ? "#3b82f6" :
    $variant === "linkedin" ? "#0a66c2" :
    $variant === "twitter" ? "#1da1f2" :
    "#22c55e"};
`;

export const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
`;

export const ContactLabel = styled.span`
  font-size: 11px;
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

  ${ContactButton}:hover & {
    opacity: 1;
    transform: translateX(0);
  }
`;

export const Divider = styled.div`
  height: 1px;
  background: ${({ theme }) =>
    theme.bg === "#000000"
      ? "rgba(255, 255, 255, 0.06)"
      : "rgba(0, 0, 0, 0.06)"};
  margin: 16px 0;
`;

export const FooterNote = styled.p`
  font-size: 11px;
  color: ${({ theme }) => theme.text_secondary};
  margin: 0;
  text-align: center;
  opacity: 0.7;
`;

export const LoadingDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ theme }) => theme.text_secondary};
  animation: ${pulseGlow} 1s ease-in-out infinite;
`;
