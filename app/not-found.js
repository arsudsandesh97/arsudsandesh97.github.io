"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1C1C27 0%, #0a0a0f 100%);
  padding: 40px 20px;
`;

const Content = styled.div`
  text-align: center;
  max-width: 600px;
`;

const Title = styled.h1`
  font-size: 120px;
  font-weight: 900;
  background: linear-gradient(135deg, #854CE6 0%, #b47bff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0 0 24px 0;
  line-height: 1;
`;

const Subtitle = styled.h2`
  font-size: 32px;
  color: #ffffff;
  margin: 0 0 16px 0;
  font-weight: 600;
`;

const Message = styled.p`
  font-size: 18px;
  color: rgba(255, 255, 255, 0.7);
  margin: 0 0 40px 0;
  line-height: 1.6;
`;

const RedirectMessage = styled.p`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.5);
  margin: 0;
`;

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to home after 3 seconds
    const timer = setTimeout(() => {
      router.push('/');
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <Container>
      <Content>
        <Title>404</Title>
        <Subtitle>Page Not Found</Subtitle>
        <Message>
          Oops! The page you're looking for doesn't exist or has been moved.
        </Message>
        <RedirectMessage>
          Redirecting to home in 3 seconds...
        </RedirectMessage>
      </Content>
    </Container>
  );
}
