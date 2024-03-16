(function () {
  const userPrefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  const localStorageTheme = localStorage.getItem("theme"); // "dark" | "light" | null

  const theme = localStorageTheme || (userPrefersDark ? "dark" : "light");

  if (!localStorageTheme) {
    localStorage.setItem("theme", theme);
  }

  document.documentElement.classList.add(theme);
})();