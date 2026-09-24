import { useState } from "react";
import { useTranslation } from "react-i18next";
import i18n from "../../i18n.js";
import { NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { navigationLinks } from "../../data/navigationLinks.js";
import ThemeToggle from "../common/ThemeToggle.jsx";
import logo from "../../assets/logo.png";

export default function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { i18n: currentI18n } = useTranslation();
  const toggleLanguage = () => {
  const nextLanguage = currentI18n.language === "en" ? "ar" : "en";

  currentI18n.changeLanguage(nextLanguage);

  document.documentElement.dir = nextLanguage === "ar" ? "rtl" : "ltr";
  document.documentElement.lang = nextLanguage;
};

  return (
    <header className="w-full bg-page sticky top-0 z-30">
      <div className="flex items-start pl-[50px] pt-[41px] pb-[40px] pr-[135px] md:pr-[50px]">
        <NavLink to="/" className="flex items-center">
          <img src={logo} alt="ESM Limo" className="w-[83px] h-[25px]" />
        </NavLink>

        <nav className="hidden md:flex items-center gap-[51px] ml-[157px] text-[25px] font-normal leading-[100%] tracking-[0%] capitalize font-display">
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
              {link.label}
            </NavLink>
          ))}
        </nav>

        <ThemeToggle className="ml-auto self-center shrink-0" />

       <button
  type="button"
  onClick={toggleLanguage}
  className="ml-5 self-center shrink-0 text-fg/80 hover:text-fg transition-colors font-display text-[18px]"
>
  {currentI18n.language === "en" ? "AR" : "EN"}
</button>
      </div>

      {/* Mobile: dim overlay + right-side sidebar drawer */}
      <div
        className={`md:hidden fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ${
          isMenuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setIsMenuOpen(false)}
        aria-hidden="true"
      />
      <nav
        className={`md:hidden fixed top-0 right-0 z-50 h-full w-64 max-w-[80%] bg-page shadow-2xl flex flex-col gap-6 px-6 pt-6 pb-8 text-lg font-display transition-transform duration-300 ${
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
            {link.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
