import styled, { keyframes } from 'styled-components';

const gradientAnimation = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -200% center;
  }
  100% {
    background-position: 200% center;
  }
`;

export const Container = styled.div`
    background: 
      linear-gradient(343.07deg, rgba(132, 59, 206, 0.08) 5.71%, rgba(132, 59, 206, 0) 64.83%),
      radial-gradient(circle at 80% 20%, rgba(132, 59, 206, 0.04) 0%, transparent 50%);
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: relative;
    z-index: 1;
    align-items: center;
    clip-path: polygon(0 0, 100% 0, 100% 100%,100% 98%, 0 100%);
    padding: 80px 0;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: 
        radial-gradient(circle at 30% 50%, rgba(132, 59, 206, 0.05) 0%, transparent 40%),
        radial-gradient(circle at 70% 80%, rgba(132, 59, 206, 0.03) 0%, transparent 40%);
      pointer-events: none;
      z-index: 0;
    }

    @media (max-width: 960px) {
        padding: 60px 0;
    }
`;

export const Wrapper = styled.div`
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: column;
    width: 100%;\r
    max-width: 1350px;
    padding: 20px 16px 100px 16px;
    gap: 16px;
    z-index: 1;

    @media (max-width: 960px) {
        flex-direction: column;
        padding: 16px 12px 80px 12px;
    }
`;

export const Title = styled.div`
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
      letter-spacing: -0.5px;

      &::after {
        bottom: -8px;
        width: 60px;
        height: 3px;
      }
  }
`;

export const Desc = styled.div`
    font-size: 19px;
    text-align: center;
    max-width: 650px;
    line-height: 1.6;
    color: ${({ theme }) => theme.text_secondary};
    margin-bottom: 8px;
    letter-spacing: 0.2px;
    font-weight: 400;

    @media (max-width: 768px) {
        margin-top: 16px;
        font-size: 17px;
        max-width: 90%;
        line-height: 1.5;
    }
`;

