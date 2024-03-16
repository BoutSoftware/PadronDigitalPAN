(function () {
  const useSystemTheme = false;

  const userPrefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  const localStorageTheme = localStorage.getItem("theme"); // "dark" | "light" | null
  const defaultTheme = useSystemTheme ? (userPrefersDark ? "dark" : "light") : "light";
  const theme = localStorageTheme || defaultTheme;

  if (!localStorageTheme) {
    localStorage.setItem("theme", theme);
  }

  document.documentElement.classList.add(theme);
})();