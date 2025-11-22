"use client";

import React from "react";
import styled from "styled-components";
import { LightMode, DarkMode } from "@mui/icons-material";
import { useTheme } from "./ThemeProvider";

const ToggleButton = styled.button`
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: ${({ theme }) => theme.primary};
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 20px ${({ theme }) => theme.primary}40;
  transition: all 0.3s ease;
  z-index: 1000;
  color: white;

  &:hover {
    transform: scale(1.1) rotate(15deg);
    box-shadow: 0 6px 30px ${({ theme }) => theme.primary}60;
  }

  &:active {
    transform: scale(0.95);
  }

  @media (max-width: 768px) {
    width: 50px;
    height: 50px;
    bottom: 20px;
    right: 20px;
  }
`;

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <ToggleButton onClick={toggleTheme} aria-label="Toggle theme">
      {isDarkMode ? <LightMode /> : <DarkMode />}
    </ToggleButton>
  );
};

export default ThemeToggle;
