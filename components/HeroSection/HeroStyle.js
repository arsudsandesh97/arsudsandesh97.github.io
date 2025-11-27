import styled, { keyframes } from "styled-components";
import { motion } from "framer-motion";

export const HeroContainer = styled.div`
  background: ${({ theme }) => theme.card_light};
  background: linear-gradient(
    38.73deg,
    rgba(204, 0, 187, 0.15) 0%,
    rgba(201, 32, 184, 0) 50%
  ),
  linear-gradient(
    141.27deg,
    rgba(0, 70, 209, 0) 50%,
    rgba(0, 70, 209, 0.15) 100%
  );
  display: flex;
  justify-content: center;
  position: relative;
  padding: 80px 30px;
  z-index: 1;
  clip-path: polygon(0 0, 100% 0, 100% 100%, 70% 95%, 0 100%);

  @media (max-width: 960px) {
    padding: 66px 16px;
  }
  
  @media (max-width: 640px) {
    padding: 32px 16px 60px 16px;
    clip-path: none;
  }
`;

export const HeroBg = styled.div`
  position: absolute;
  display: flex;
  justify-content: end;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  max-width: 1360px;
  overflow: hidden;
  padding: 0 30px;
  top: 50%;
  left: 50%;
  -webkit-transform: translateX(-50%) translateY(-50%);
  transform: translateX(-50%) translateY(-50%);

  @media (max-width: 960px) {
    justify-content: center;
    padding: 0 0px;
  }
`;

export const HeroInnerContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1100px;
  z-index: 2;

  @media (max-width: 960px) {
    flex-direction: column;
  }
`;

export const HeroLeftContainer = styled.div`
  width: 100%;
  order: 1;
  
  @media (max-width: 960px) {
    order: 2;
    margin-bottom: 30px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  @media (max-width: 640px) {
    order: 1; /* Prioritize text on mobile */
    margin-bottom: 30px;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    max-width: 100%;
    padding: 0 16px;
  }
`;

export const HeroRightContainer = styled.div`
  width: 100%;
  display: flex;
  order: 2;
  justify-content: end;
  gap: 12px;
  
  @media (max-width: 960px) {
    order: 1;
    justify-content: center;
    align-items: center;
    margin-bottom: 80px;
  }

  @media (max-width: 640px) {
    order: 2; /* Image below text on mobile */
    margin-bottom: 30px;
    justify-content: center;
  }
`;

export const Img = styled.img`
  width: 100%;
  height: 100%;
  position: relative;
  border-radius: 50%;
  max-width: 400px;
  max-height: 400px;
  object-fit: cover;
  border: 2px solid ${({ theme }) => theme.primary + "50"}; /* Lighter border */
  padding: 6px;
  background: ${({ theme }) => theme.card_light};
  box-shadow: 0 0 40px ${({ theme }) => theme.primary + "30"}; /* Softer shadow */
  transition: all 0.3s ease-in-out;

  @media (max-width: 768px) {
    max-width: 300px;
    max-height: 300px;
  }

  @media (max-width: 640px) {
    max-width: 250px; /* Smaller on mobile */
    max-height: 250px;
  }
`;

export const Title = styled.div`
  font-weight: 700;
  font-size: 50px;
  color: ${({ theme }) => theme.text_primary};
  line-height: 1.2;
  
  @media (max-width: 960px) {
    text-align: center;
  }

  @media (max-width: 640px) {
    font-size: 40px; /* Increased for mobile */
    line-height: 1.2;
    margin-bottom: 8px;
    width: 100%;
    max-width: 100%;
    padding: 0 4px;
  }
`;

export const Tagline = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.primary};
  font-family: 'Space Mono', monospace;
  letter-spacing: 2px;
  margin-bottom: 16px;
  
  @media (max-width: 960px) {
    text-align: center;
    font-size: 12px;
  }

  @media (max-width: 640px) {
    font-size: 11px;
  }
`;

export const TextLoop = styled.div`
  font-weight: 600;
  font-size: 32px;
  display: flex;
  gap: 12px;
  color: ${({ theme }) => theme.text_primary};
  line-height: 1.5;
  flex-wrap: wrap;
  justify-content: flex-start;
  min-height: 68px; /* Prevent layout shift */
  
  @media (max-width: 960px) {
    text-align: center;
    justify-content: center;
  }
  @media (max-width: 640px) {
    font-size: 22px;
    line-height: 1.5;
    margin-bottom: 16px;
    min-height: 48px;
  }
`;

export const Span = styled.span`
  color: ${({ theme }) => theme.primary};
  cursor: pointer;
  font-family: 'Space Mono', monospace;
`;

export const SubTitle = styled.div`
  font-size: 20px;
  line-height: 32px;
  margin-bottom: 42px;
  color: ${({ theme }) => theme.text_primary + "95"};

  @media (max-width: 960px) {
    text-align: center;
  }

  @media (max-width: 640px) {
    font-size: 16px;
    line-height: 26px;
    width: 100%;
    max-width: 100%;
    word-wrap: break-word;
    overflow-wrap: break-word;
    padding: 0 8px;
    text-align: center;
    color: ${({ theme }) => theme.text_primary + "CC"};
    margin-bottom: 32px;
  }

  @media (max-width: 480px) {
    font-size: 15px;
    line-height: 24px;
    margin-bottom: 24px;
  }
`;

export const CTAContainer = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 32px;
  width: 100%;
  max-width: 600px;
  
  @media (max-width: 960px) {
    justify-content: center;
    max-width: 500px;
  }

  @media (max-width: 640px) {
    flex-direction: column;
    gap: 12px;
    padding: 0 8px;
    width: 100%;
    max-width: 100%;
    margin-top: 24px;
    align-items: stretch;
  }
`;

export const ResumeButton = styled.a`
    text-decoration: none;
    flex: 1;
    text-align: center;
    padding: 16px 24px;
    color:${({ theme }) => theme.white};
    border-radius: 50px;
    cursor: pointer;
    font-size: 16px;
    font-weight: 600;
    transition: all 0.3s ease;
    background: ${({ theme }) => theme.primary};
    background: linear-gradient(225deg, hsla(271, 100%, 50%, 1) 0%, hsla(294, 100%, 50%, 1) 100%);
    box-shadow: 0 4px 20px rgba(133, 76, 230, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    border: none;
    
    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 30px rgba(133, 76, 230, 0.6);
        filter: brightness(1.1);
    }
    
    &:focus-visible {
        outline: 2px solid ${({ theme }) => theme.text_primary};
        outline-offset: 2px;
    }
    
    @media (max-width: 640px) {
        width: 100%;
        padding: 14px 20px;
        font-size: 16px;
    } 
`;

export const ContactButton = styled.a`
  text-decoration: none;
  flex: 1;
  text-align: center;
  padding: 16px 24px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 50px;
  color: ${({ theme }) => theme.primary};
  background: transparent;
  border: 1.5px solid ${({ theme }) => theme.primary};
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  
  &:hover {
    background: ${({ theme }) => theme.primary}10;
    transform: translateY(-2px);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.text_primary};
    outline-offset: 2px;
  }

  @media (max-width: 640px) {
    width: 100%;
    padding: 14px 20px;
    font-size: 16px;
  }
`;

export const FloatingImage = styled(motion.div)`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  filter: drop-shadow(0px 5px 15px rgba(0, 0, 0, 0.25));
`;

export const LoadingContainer = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${({ theme }) => theme.card_light};
  color: ${({ theme }) => theme.text_primary};
  font-size: 1.5rem;
`;

export const ImageContainer = styled.div`
  position: relative;
  border-radius: 50%;
  &::after {
    content: "";
    position: absolute;
    top: -10px;
    left: -10px;
    right: -10px;
    bottom: -10px;
    background: linear-gradient(
      45deg,
      ${({ theme }) => theme.primary + "20"} 0%,
      transparent 100%
    );
    border-radius: 50%;
    z-index: -1;
    animation: pulse 2s ease-in-out infinite;
  }

  @keyframes pulse {
    0% {
      opacity: 0.5;
      transform: scale(1);
    }
    50% {
      opacity: 0.8;
      transform: scale(1.05);
    }
    100% {
      opacity: 0.5;
      transform: scale(1);
    }
  }
`;

