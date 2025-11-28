'use client';

import { useEffect } from 'react';
import styled from 'styled-components';

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #1C1C27;
  color: white;
  text-align: center;
  padding: 20px;
`;

const ErrorTitle = styled.h2`
  font-size: 24px;
  margin-bottom: 16px;
  color: #ef4444;
`;

const ErrorMessage = styled.p`
  font-size: 16px;
  margin-bottom: 24px;
  color: #9ca3af;
  max-width: 600px;
  font-family: monospace;
  background: #000;
  padding: 10px;
  border-radius: 8px;
`;

const ResetButton = styled.button`
  padding: 12px 24px;
  background-color: #854CE6;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #6C35C9;
  }
`;

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error('Global Error:', error);
  }, [error]);

  return (
    <html>
      <body>
        <ErrorContainer>
          <ErrorTitle>Something went wrong!</ErrorTitle>
          <ErrorMessage>{error.message || "Unknown error occurred"}</ErrorMessage>
          <ResetButton onClick={() => reset()}>Try again</ResetButton>
        </ErrorContainer>
      </body>
    </html>
  );
}
