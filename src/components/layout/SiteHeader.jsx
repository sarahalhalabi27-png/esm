import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { navigationLinks } from "../../data/navigationLinks.js";
import ThemeToggle from "../common/ThemeToggle.jsx";
import BrandLogo from "../common/BrandLogo.jsx";

export default function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const toggleLanguage = () => {
    // i18n.js listens for languageChanged and syncs <html> dir/lang + storage.
    i18n.changeLanguage(i18n.language === "en" ? "ar" : "en");
  };

  // Esc closes the phone menu.
  useEffect(() => {
    if (!isMenuOpen) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape") setIsMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isMenuOpen]);

  return (
    <header className="w-full bg-page sticky top-0 z-30">
      {/* Bar: 64px tall on phones, 88px from md (common header heights),
          everything vertically centred. */}
      <div className="flex items-center h-16 md:h-[88px] ps-6 lg:ps-[50px] pe-6 lg:pe-[50px]">
        <NavLink to="/" className="flex items-center shrink-0">
          <BrandLogo className="w-[100px] text-[#00BFA8] light:text-[#006D5D]" />
        </NavLink>

        {/* Desktop nav (lg+): 16px links on 1024–1279, 18px from xl, with
            24–40px gaps, centred in the space between the logo and the
            buttons. Below lg the drawer takes over. */}
        <nav className="hidden lg:flex flex-1 justify-center items-center gap-[clamp(24px,2.78vw,40px)] mx-8 text-base xl:text-[18px] font-normal leading-[100%] tracking-[0%] capitalize font-display whitespace-nowrap">
          {navigationLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === "/"}
              className={({ isActive }) =>
                `transition-colors capitalize ${
                  isActive ? "text-teal-accent" : "text-fg/80 hover:text-fg"
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
          aria-label={t(
            i18n.language === "en"
              ? "nav.switchToArabic"
              : "nav.switchToEnglish"
          )}
          // before: widens the tap area to 44px tall without moving anything
          className="relative ms-5 self-center shrink-0 text-fg/80 hover:text-fg transition-colors font-display text-base before:absolute before:-inset-x-[6px] before:-inset-y-[11px] before:content-['']"
        >
          {i18n.language === "en" ? "AR" : "EN"}
        </button>

        {/* Mobile menu trigger (opens the right-side sidebar) */}
        <button
          type="button"
          className="lg:hidden relative self-center shrink-0 text-fg/80 ms-4 before:absolute before:-inset-x-[10px] before:-inset-y-[11px] before:content-['']"
          onClick={() => setIsMenuOpen((open) => !open)}
          aria-label={t("nav.toggleMenu")}
          aria-expanded={isMenuOpen}
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
        // Closed (off screen): out of the tab order and hidden from screen
        // readers. (React 18 passes `inert` through as a plain attribute.)
        inert={isMenuOpen ? undefined : ""}
        className={`lg:hidden fixed top-0 right-0 z-50 h-full w-64 max-w-[80%] bg-page flex flex-col gap-6 px-6 pt-6 pb-8 text-lg font-display transition-[transform,box-shadow] duration-300 ${
          isMenuOpen ? "translate-x-0 shadow-2xl" : "translate-x-full"
        }`}
      >
        {/* Sidebar top row: theme toggle + close button */}
        <div className="flex items-center justify-between mb-2">
          <ThemeToggle />
          <button
            type="button"
            className="text-fg/80"
            onClick={() => setIsMenuOpen(false)}
            aria-label={t("nav.closeMenu")}
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
