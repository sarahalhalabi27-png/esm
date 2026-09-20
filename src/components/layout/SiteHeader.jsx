import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { navigationLinks } from "../../data/navigationLinks.js";
import logo from "../../assets/logo.png";

export default function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="w-full bg-black sticky top-0 z-30">
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
                    : "text-gray-300 hover:text-white"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <button
          className="md:hidden text-gray-300"
          onClick={() => setIsMenuOpen((open) => !open)}
          aria-label="Toggle navigation menu"
        >
          {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {isMenuOpen && (
        <nav className="md:hidden flex flex-col gap-4 px-6 pb-5 text-sm font-display">
          {navigationLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === "/"}
              onClick={() => setIsMenuOpen(false)}
              className={({ isActive }) =>
                isActive ? "text-teal-accent" : "text-gray-300"
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
}
