"use client";

import { useState, useEffect, createContext, useContext } from "react";
import { ThemeProvider } from "styled-components";
import { darkTheme, lightTheme } from "@/utils/themes";
import { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

// Create Theme Context
const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProviderWrapper");
  }
  return context;
};

export default function ThemeProviderWrapper({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(true); // Default to dark

  // Load theme preference from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setIsDarkMode(savedTheme === "dark");
    }
  }, []);

  // Save theme preference to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      <ThemeProvider theme={theme}>
        <SkeletonTheme 
          baseColor={isDarkMode ? "#202020" : "#ebebeb"} 
          highlightColor={isDarkMode ? "#444" : "#f5f5f5"}
        >
          {children}
        </SkeletonTheme>
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}

