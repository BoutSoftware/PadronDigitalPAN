import { createContext, useEffect, useState } from "react";

interface ThemeContext {
  theme: "light" | "dark" | undefined;
  setTheme: (theme: "light" | "dark") => void;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContext>({
  theme: "light",
  setTheme: () => { },
  toggleTheme: () => { },
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark">();

  // Utility function to toggle theme
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";

    setTheme(newTheme);
  };

  // Set theme from local storage
  useEffect(() => {
    const localTheme = localStorage.getItem("theme") as "light" | "dark";

    setTheme(localTheme);
  }, []);

  // Apply theme to HTML
  useEffect(() => {
    if (!theme) return;

    localStorage.setItem("theme", theme);

    window.document.documentElement.classList.remove("light", "dark");
    window.document.documentElement.classList.add(theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      <ThemeScript />
      {children}
    </ThemeContext.Provider>
  );
}

const ThemeScript = () => {
  function script() {
    const useSystemTheme = false;

    // Window Variables
    const userPrefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    const localStorageTheme = localStorage.getItem("theme"); // "dark" | "light" | null

    // Decide Theme
    const defaultTheme = useSystemTheme ? (userPrefersDark ? "dark" : "light") : "light";
    const theme = localStorageTheme || defaultTheme;

    // Save Theme
    if (!localStorageTheme) {
      localStorage.setItem("theme", theme);
    }

    // Apply Theme to HTML
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
  }

  return (
    <script
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: `(${script.toString()})()` }}
    />
  );
};