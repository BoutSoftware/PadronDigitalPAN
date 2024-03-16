"use client";

import { NextUIProvider, Switch } from "@nextui-org/react";
import { useEffect, useState } from "react";

export default function GlobalProviders({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark">();

  const changeTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";

    localStorage.setItem("theme", newTheme);
    setTheme(newTheme);

    window.document.documentElement.classList.remove("light", "dark");
    window.document.documentElement.classList.add(newTheme);
  };

  useEffect(() => {
    const userPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const localTheme = localStorage.getItem("theme");

    if (!localTheme) {
      localStorage.setItem("theme", userPrefersDark ? "dark" : "light");
      setTheme(userPrefersDark ? "dark" : "light");
    } else {
      setTheme(localTheme as "light" | "dark");
    }

    window.document.documentElement.classList.remove("light", "dark");
    window.document.documentElement.classList.add(localTheme || (userPrefersDark ? "dark" : "light"));
  }, []);

  return (
    <NextUIProvider className={`flex flex-col min-h-screen bg-background text-foreground ${theme}`}>
      <Switch
        isSelected={theme === "dark"}
        // size="lg"
        onChange={changeTheme}
        endContent={<span>dark_mode</span>}
        startContent={<span>light_mode</span>}
        classNames={{
          endContent: "flex items-center material-symbols-outlined icon-xs",
          startContent: "flex items-center material-symbols-outlined icon-xs",
          thumbIcon: "flex items-center material-symbols-outlined icon-xs",
          base: "fixed top-4 right-4",
        }}
      />

      {children}
    </NextUIProvider>
  );
}