
import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // --- DEBUG LOG: Initialization Start ---
    console.log("ThemeContext: Initializing theme...");

    // 1. Try to get theme from localStorage
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      console.log("ThemeContext: Found stored theme in localStorage:", storedTheme);
      return storedTheme;
    }

    // 2. If no stored theme, check system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) {
      console.log("ThemeContext: No stored theme. System prefers dark mode.");
      return 'dark';
    }

    // 3. Default to 'light'
    console.log("ThemeContext: No stored theme or system preference. Defaulting to 'light'.");
    return 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    // --- DEBUG LOG: useEffect Theme Change ---
    console.log(`ThemeContext: useEffect triggered. Current theme: "${theme}". Applying classes.`);

    // Apply or remove 'dark' class based on the theme state
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light'); // Ensure 'light' class is explicitly removed if it somehow got there
    } else {
      root.classList.remove('dark');
      root.classList.add('light'); // Explicitly add 'light' class (can be useful for debugging/specificity)
    }

    // Store the current theme in localStorage for persistence
    localStorage.setItem('theme', theme);

    // --- DEBUG LOG: Current root classes ---
    console.log("ThemeContext: root.classList:", Array.from(root.classList));

  }, [theme]); // Rerun this effect whenever the 'theme' state changes

  const toggleTheme = () => {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      // --- DEBUG LOG: Theme Toggle ---
      console.log(`ThemeContext: Toggle button clicked. Changing theme from "${prevTheme}" to "${newTheme}".`);
      return newTheme;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};