import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const Section = styled(motion.div)`
  text-align: center;
  margin-bottom: 60px;
  position: relative;
  padding: 20px 0;
`;

const Title = styled.h1`
  font-size: 52px;
  text-align: center;
  font-weight: 700;
  margin-top: 20px;
  margin-bottom: 8px;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.text_primary} 0%,
    ${({ theme }) => theme.primary} 50%,
    ${({ theme }) => theme.text_primary} 100%
  );
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  position: relative;
  letter-spacing: -1px;
  animation: gradientFlow 8s ease infinite;

  @keyframes gradientFlow {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -12px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 4px;
    background: linear-gradient(90deg, transparent, ${({ theme }) => theme.primary}, transparent);
    border-radius: 2px;
  }

  @media (max-width: 768px) {
      margin-top: 16px;
      font-size: 38px;
      letter-spacing: -1px;

      &::after {
        bottom: -8px;
        width: 60px;
        height: 3px;
      }
  }
`;

const Subtitle = styled.p`
  font-size: 19px;
  text-align: center;
  max-width: 650px;
  margin: 0 auto;
  line-height: 1.6;
  color: ${({ theme }) => theme.text_secondary};
  margin-top: 24px;
  letter-spacing: 0.2px;
  font-weight: 400;
  
  @media (max-width: 768px) {
    font-size: 17px;
    margin-top: 20px;
    max-width: 90%;
    line-height: 1.5;
  }
`;

const HeroSection = () => {
  return (
    <Section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Title>Blog</Title>
      <Subtitle>
        Thoughts, tutorials, and insights on development and design.
      </Subtitle>
    </Section>
  );
};

export default React.memo(HeroSection);
