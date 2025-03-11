import React, { createContext, useContext } from 'react';
import useLocalStorage from './useLocalStorage'; // Adjust the path as necessary

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useLocalStorage("theme", "light");

    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === "light" ? "dark" : "light"));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    return useContext(ThemeContext);
};