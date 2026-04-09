'use client';

import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  padding: 40px 20px;
`;

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid ${({ theme }) => theme.primary}20;
  border-top-color: ${({ theme }) => theme.primary};
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

const LoadingText = styled.p`
  margin-top: 16px;
  color: ${({ theme }) => theme.text_secondary};
  font-size: 14px;
`;

interface LoadingSpinnerProps {
  text?: string;
}

export function LoadingSpinner({ text = 'Loading...' }: LoadingSpinnerProps) {
  return (
    <LoadingContainer>
      <Spinner />
      {text && <LoadingText>{text}</LoadingText>}
    </LoadingContainer>
  );
}
