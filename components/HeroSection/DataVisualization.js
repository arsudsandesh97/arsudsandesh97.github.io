"use client";

import React from "react";
import styled, { keyframes } from "styled-components";

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.4; }
  50% { opacity: 0.8; }
`;

const Container = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
`;

const DataPoint = styled.div`
  position: absolute;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  border-radius: 50%;
  background: ${({ theme }) => theme.primary};
  opacity: 0.3;
  animation: ${float} ${props => props.duration}s ease-in-out infinite;
  animation-delay: ${props => props.delay}s;
`;

const GridLine = styled.div`
  position: absolute;
  background: ${({ theme }) => theme.primary}15;
  
  ${props => props.horizontal ? `
    width: 100%;
    height: 1px;
    top: ${props.position}%;
  ` : `
    width: 1px;
    height: 100%;
    left: ${props.position}%;
  `}
`;

const ChartBar = styled.div`
  position: absolute;
  bottom: 10%;
  left: ${props => props.left}%;
  width: 40px;
  height: ${props => props.height}%;
  background: linear-gradient(to top, ${({ theme }) => theme.primary}40, ${({ theme }) => theme.primary}10);
  border-radius: 4px 4px 0 0;
  animation: ${pulse} ${props => props.duration}s ease-in-out infinite;
  animation-delay: ${props => props.delay}s;
  
  @media (max-width: 768px) {
    width: 20px;
  }
`;

const TrendLine = styled.svg`
  position: absolute;
  width: 300px;
  height: 150px;
  top: ${props => props.top}%;
  right: ${props => props.right}%;
  opacity: 0.2;
  
  @media (max-width: 768px) {
    width: 150px;
    height: 75px;
  }
`;

const DataVisualization = () => {
  return (
    <Container>
      {/* Grid Lines */}
      {[20, 40, 60, 80].map((pos) => (
        <React.Fragment key={`grid-${pos}`}>
          <GridLine horizontal position={pos} />
          <GridLine position={pos} />
        </React.Fragment>
      ))}

      {/* Floating Data Points */}
      <DataPoint size={8} duration={4} delay={0} style={{ top: '20%', left: '15%' }} />
      <DataPoint size={6} duration={5} delay={1} style={{ top: '60%', left: '25%' }} />
      <DataPoint size={10} duration={3} delay={2} style={{ top: '40%', left: '80%' }} />
      <DataPoint size={7} duration={4.5} delay={0.5} style={{ top: '75%', left: '70%' }} />

      {/* Chart Bars */}
      <ChartBar left={10} height={30} duration={3} delay={0} />
      <ChartBar left={15} height={50} duration={3.5} delay={0.5} />
      <ChartBar left={20} height={40} duration={3.2} delay={1} />
      <ChartBar left={25} height={60} duration={3.8} delay={1.5} />

      {/* Trend Line */}
      <TrendLine top={15} right={10} viewBox="0 0 300 150">
        <path
          d="M 0 100 Q 75 80, 150 60 T 300 20"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          opacity="0.3"
        />
        <circle cx="0" cy="100" r="4" fill="currentColor" opacity="0.5" />
        <circle cx="150" cy="60" r="4" fill="currentColor" opacity="0.5" />
        <circle cx="300" cy="20" r="4" fill="currentColor" opacity="0.5" />
      </TrendLine>
    </Container>
  );
};

export default DataVisualization;
