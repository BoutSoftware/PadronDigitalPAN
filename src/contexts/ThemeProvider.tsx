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

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";

    setTheme(newTheme);
  };

  useEffect(() => {
    const userPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const localTheme = localStorage.getItem("theme");

    setTheme(localTheme as "light" | "dark" || (userPrefersDark ? "dark" : "light"));
  }, []);

  useEffect(() => {
    if (!theme) return;

    localStorage.setItem("theme", theme);

    window.document.documentElement.classList.remove("light", "dark");
    window.document.documentElement.classList.add(theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}