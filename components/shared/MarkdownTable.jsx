"use client";

import React from 'react';
import styled from 'styled-components';

const TableContainer = styled.div`
  width: 100%;
  overflow-x: auto;
  margin: 40px 0;
  border-radius: 16px;
  box-shadow: 
    0 4px 24px -1px rgba(0, 0, 0, 0.2),
    0 0 0 1px ${({ theme }) => theme.primary}25;
  background: ${({ theme }) => theme.card};
  position: relative;

  @media (max-width: 768px) {
    margin: 24px 0;
    border-radius: 12px;
    box-shadow: 
      0 2px 12px -1px rgba(0, 0, 0, 0.15),
      0 0 0 1px ${({ theme }) => theme.primary}20;
  }

  /* Custom Scrollbar */
  &::-webkit-scrollbar {
    height: 6px;
  }

  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.bg};
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.primary}40;
    border-radius: 4px;
    
    &:hover {
      background: ${({ theme }) => theme.primary}60;
    }
  }
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 15px;
  min-width: 600px;

  @media (max-width: 768px) {
    font-size: 13px;
    min-width: 100%; /* Allow full width but scroll if needed */
  }

  th, td {
    padding: 18px 24px;
    text-align: left;
    border-bottom: 1px solid ${({ theme }) => theme.primary}15;
    border-right: 1px solid ${({ theme }) => theme.primary}15;
    line-height: 1.6;
    
    &:last-child {
      border-right: none;
    }

    @media (max-width: 768px) {
      padding: 12px 16px; /* Tighter padding for mobile */
      white-space: normal;
    }
  }

  /* Sticky First Column */
  th:first-child, td:first-child {
    position: sticky;
    left: 0;
    z-index: 5;
    border-right: 2px solid ${({ theme }) => theme.primary}30;
    
    /* Add shadow to indicate scroll */
    &::after {
      content: '';
      position: absolute;
      top: 0;
      right: -10px;
      bottom: 0;
      width: 10px;
      background: linear-gradient(to right, rgba(0,0,0,0.1), transparent);
      pointer-events: none;
    }
  }

  th:first-child {
    z-index: 15;
  }

  td:first-child {
    background: ${({ theme }) => theme.card};
  }

  th {
    background: ${({ theme }) => theme.primary}15;
    color: ${({ theme }) => theme.text_primary};
    font-weight: 800;
    text-transform: uppercase;
    font-size: 12px;
    letter-spacing: 1.2px;
    position: sticky;
    top: 0;
    z-index: 10;
    backdrop-filter: blur(12px);
    border-bottom: 2px solid ${({ theme }) => theme.primary}30;
    
    @media (max-width: 768px) {
      font-size: 11px;
      letter-spacing: 0.5px;
      padding: 12px 16px;
    }
  }

  td {
    color: ${({ theme }) => theme.text_secondary};
    transition: all 0.2s ease;
  }

  tr:last-child td {
    border-bottom: none;
  }

  tr:nth-child(even) {
    background: ${({ theme }) => theme.primary}05;
    
    td:first-child {
      background: ${({ theme }) => theme.card};
      background-image: linear-gradient(${({ theme }) => theme.primary}05, ${({ theme }) => theme.primary}05);
    }
  }

  tr:hover {
    background: ${({ theme }) => theme.primary}08;
    
    td {
      color: ${({ theme }) => theme.text_primary};
    }

    td:first-child {
      background: ${({ theme }) => theme.card};
      background-image: linear-gradient(${({ theme }) => theme.primary}08, ${({ theme }) => theme.primary}08);
    }
  }
`;

const MarkdownTable = (props) => {
  return (
    <TableContainer>
      <StyledTable {...props} />
    </TableContainer>
  );
};

export default MarkdownTable;
