import { useState } from "react";
import { useTranslation } from "react-i18next";
import "../../i18n.js";
import { NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { navigationLinks } from "../../data/navigationLinks.js";
import ThemeToggle from "../common/ThemeToggle.jsx";
import logo from "../../assets/logo.png";

export default function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t, i18n: currentI18n } = useTranslation();
  const toggleLanguage = () => {
    // i18n.js listens for languageChanged and syncs <html> dir/lang + storage.
    const nextLanguage = currentI18n.language === "en" ? "ar" : "en";
    currentI18n.changeLanguage(nextLanguage);
  };

  return (
    <header className="w-full bg-page sticky top-0 z-30">
      <div className="flex items-start ps-6 lg:ps-[50px] pt-[41px] pb-[40px] max-md:py-5 pe-6 lg:pe-[50px]">
        <NavLink to="/" className="flex items-center">
          <img src={logo} alt="ESM Limo" className="w-[83px] h-[25px]" />
        </NavLink>

        <nav className="hidden lg:flex items-center gap-[51px] ms-[157px] text-[25px] font-normal leading-[100%] tracking-[0%] capitalize font-display">
          {navigationLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === "/"}
              className={({ isActive }) =>
                `transition-colors capitalize ${
                  isActive
                    ? "text-teal-accent"
                    : "text-fg/80 hover:text-fg"
                }`
              }
            >
              {t(link.tKey)}
            </NavLink>
          ))}
        </nav>

        <ThemeToggle className="ms-auto self-center shrink-0" />

        <button
          type="button"
          onClick={toggleLanguage}
          className="ms-5 self-center shrink-0 text-fg/80 hover:text-fg transition-colors font-display text-[18px]"
        >
          {currentI18n.language === "en" ? "AR" : "EN"}
        </button>

        {/* Mobile menu trigger (opens the right-side sidebar) */}
        <button
          type="button"
          className="lg:hidden self-center shrink-0 text-fg/80 ms-4"
          onClick={() => setIsMenuOpen((open) => !open)}
          aria-label="Toggle navigation menu"
        >
          {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile: dim overlay + right-side sidebar drawer */}
      <div
        className={`lg:hidden fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ${
          isMenuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setIsMenuOpen(false)}
        aria-hidden="true"
      />
      <nav
        className={`lg:hidden fixed top-0 right-0 z-50 h-full w-64 max-w-[80%] bg-page shadow-2xl flex flex-col gap-6 px-6 pt-6 pb-8 text-lg font-display transition-transform duration-300 ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Sidebar top row: theme toggle + close button */}
        <div className="flex items-center justify-between mb-2">
          <ThemeToggle />
          <button
            className="text-fg/80"
            onClick={() => setIsMenuOpen(false)}
            aria-label="Close navigation menu"
          >
            <X size={24} />
          </button>
        </div>
        {navigationLinks.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            end={link.path === "/"}
            onClick={() => setIsMenuOpen(false)}
            className={({ isActive }) =>
              `transition-colors ${
                isActive ? "text-teal-accent" : "text-fg/80 hover:text-fg"
              }`
            }
          >
            {t(link.tKey)}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
