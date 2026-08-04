import { useState } from "react";

type Theme = "light" | "dark";

const storageKey = "ht-macro-theme";

function currentTheme(): Theme {
  if (document.documentElement.dataset.theme === "dark" || localStorage.getItem(storageKey) === "dark") {
    return "dark";
  }

  return "light";
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(currentTheme);
  const destination = theme === "light" ? "dark" : "light";

  function toggleTheme() {
    document.documentElement.dataset.theme = destination;
    localStorage.setItem(storageKey, destination);
    setTheme(destination);
  }

  return (
    <button className="theme-toggle" type="button" onClick={toggleTheme} aria-label={`切换至${destination === "dark" ? "深色" : "浅色"}主题`}>
      <span aria-hidden="true">{theme === "light" ? "◐" : "◑"}</span>
    </button>
  );
}
