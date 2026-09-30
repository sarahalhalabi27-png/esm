import { Sun, Moon } from "lucide-react";
import { useTranslation } from "react-i18next";
import useIsLightTheme from "../../hooks/useIsLightTheme.js";

// The theme lives on <html data-theme> (restored before paint by the script
// in index.html). Every toggle reads it from there, so the header's and the
// phone menu's toggles always agree.
function applyTheme(theme) {
  const root = document.documentElement;
  if (theme === "light") root.setAttribute("data-theme", "light");
  else root.removeAttribute("data-theme");
  try {
    localStorage.setItem("esm-theme", theme);
  } catch {
    // ignore storage errors (private mode, etc.)
  }
}

export default function ThemeToggle({ className = "" }) {
  const { t } = useTranslation();
  const isLight = useIsLightTheme();

  return (
    <button
      type="button"
      onClick={() => applyTheme(isLight ? "dark" : "light")}
      aria-label={t(
        isLight ? "nav.switchToDarkTheme" : "nav.switchToLightTheme"
      )}
      className={`grid place-items-center w-[42px] h-[42px] rounded-full border border-teal-accent/40 text-teal-accent transition-colors hover:bg-teal-accent/10 ${className}`}
    >
      {isLight ? <Moon size={20} /> : <Sun size={20} />}
    </button>
  );
}
