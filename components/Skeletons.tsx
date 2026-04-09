'use client';

import styled, { keyframes } from 'styled-components';

const shimmer = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`;

const SkeletonBase = styled.div`
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.card_light}40 0%,
    ${({ theme }) => theme.card_light}80 50%,
    ${({ theme }) => theme.card_light}40 100%
  );
  background-size: 2000px 100%;
  animation: ${shimmer} 2s infinite linear;
  border-radius: 8px;
`;

export const SkeletonCard = styled(SkeletonBase)`
  width: 100%;
  max-width: 330px;
  height: 540px;
  border-radius: 20px;
`;

export const SkeletonBlogCard = styled(SkeletonBase)`
  width: 100%;
  max-width: 400px;
  height: 480px;
  border-radius: 16px;
`;

export const SkeletonText = styled(SkeletonBase)<{ width?: string; height?: string }>`
  width: ${({ width }) => width || '100%'};
  height: ${({ height }) => height || '16px'};
  border-radius: 4px;
`;

export const SkeletonImage = styled(SkeletonBase)<{ width?: string; height?: string }>`
  width: ${({ width }) => width || '100%'};
  height: ${({ height}) => height || '200px'};
  border-radius: 12px;
`;

export const SkeletonCircle = styled(SkeletonBase)<{ size?: string }>`
  width: ${({ size }) => size || '40px'};
  height: ${({ size }) => size || '40px'};
  border-radius: 50%;
`;

interface SkeletonProjectCardProps {}

export function SkeletonProjectCard({}: SkeletonProjectCardProps) {
  return <SkeletonCard />;
}

export function SkeletonBlogCardComponent() {
  return <SkeletonBlogCard />;
}
