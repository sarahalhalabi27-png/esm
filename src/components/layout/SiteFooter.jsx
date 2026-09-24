import { NavLink } from "react-router-dom";
import {
  Phone,
  Mail,
  Clock,
  MapPin,
  Instagram,
  Facebook,
  Linkedin,
  Twitter,
} from "lucide-react";

import { companyInfo } from "../../data/companyInfo.js";
import whiteLogo from "../../assets/white_logo.png";
import darkLogo from "../../assets/logo.png";
import cityArt from "../../assets/building.png";

const socialIcons = {
  instagram: Instagram,
  facebook: Facebook,
  linkedin: Linkedin,
  twitter: Twitter,
};

const headingClass =
  "md:whitespace-nowrap font-['Montserrat_Alternates'] font-semibold text-xl md:text-[25px] leading-[100%] tracking-[0%] capitalize text-teal-accent mb-6 md:mb-[40px]";
const itemClass =
  "flex items-center gap-2 md:whitespace-nowrap font-['Montserrat_Alternates'] font-normal text-base md:text-[20px] leading-[120%] md:leading-[100%] tracking-[0%] capitalize text-fg";

export default function SiteFooter() {
  return (
    <footer className="relative overflow-visible w-full px-6 mb-[-40px] mt-[55px] font-display md:w-[calc(100%-100px)] md:mx-[50px] md:px-0 md:-translate-x-[10px]">
      <div
        className="hidden md:block pointer-events-none absolute left-[1280px] top-[458px] w-[60px] h-[100px] bg-[#24B9A5] opacity-50 blur-[90px] z-[5]"
      />
      <img
        src={cityArt}
        alt=""
        className="hidden md:block pointer-events-none absolute left-[732px] top-10 w-[640px] h-[542px] object-cover opacity-20 z-0 scale-[1.4]"
      />

      <div className="relative z-10 -translate-y-[30px]">
        {/* Logo + tagline */}
        <div className="flex flex-col items-center pt-8">
          <img
            src={whiteLogo}
            alt="ESM Limo"
            className="dark-only w-[161px] h-[53px] object-contain"
          />
          <img
            src={darkLogo}
            alt="ESM Limo"
            className="light-only w-[161px] h-[53px] object-contain"
          />

          <p className="mt-[14px] w-full max-w-[312px] text-center font-['Montserrat_Alternates'] font-normal text-lg md:text-[20px] leading-[120%] md:leading-[100%] tracking-[0%] capitalize text-teal-accent">
            Luxury, Defined by Every Ride.
          </p>

          <div className="w-full max-w-[314px] h-0 border-t border-fg mt-[8px]" />
        </div>

        {/* Columns */}
        <div className="max-w-content mx-auto px-6 pt-0 mt-16 md:mt-[137px] pb-10">
          <div className="grid grid-cols-2 gap-y-10 md:flex md:justify-between mb-14">
            {/* Explore */}
            <div>
              <h4 className={headingClass}>Explore</h4>
              <ul className="space-y-[32px]">
                <li>
                  <NavLink to="/" className={itemClass}>
                    Overview
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/services" className={itemClass}>
                    Services
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/about" className={itemClass}>
                    About Us
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/fleet" className={itemClass}>
                    Our Car
                  </NavLink>
                </li>
              </ul>
            </div>

            {/* Quick Contact */}
            <div className="">
              <h4 className={headingClass}>Quick Contact</h4>
              <ul className="space-y-[32px]">
                <li className={itemClass}>
                  <Phone size={18} className="text-teal-accent shrink-0" />
                  {companyInfo.phone}
                </li>
                <li className={itemClass}>
                  <Mail size={18} className="text-teal-accent shrink-0" />
                  {companyInfo.email}
                </li>
                <li className={itemClass}>
                  <Clock size={18} className="text-teal-accent shrink-0" />
                  {companyInfo.hours}
                </li>
                <li className={itemClass}>
                  <MapPin size={18} className="text-teal-accent shrink-0" />
                  UAE , Dubai Al Qouz 3 ,St 12
                </li>
              </ul>
            </div>

            {/* Quick Links */}
            <div className="">
              <h4 className={headingClass}>Quick Links</h4>
              <ul className="space-y-[32px]">
                <li className={itemClass}>Terms Of Services</li>
                <li className={itemClass}>Privacy Policy</li>
                <li className={itemClass}>Disclaimer</li>
                <li className={itemClass}>FAQ</li>
              </ul>
            </div>

            {/* Follow Us */}
            <div className="">
              <h4 className={headingClass}>Follow Us</h4>
              <div className="flex gap-6 text-fg">
                {companyInfo.socials.map((social) => {
                  const Icon = socialIcons[social.id];
                  if (!Icon) return null;
                  return (
                    <a
                      key={social.id}
                      href={social.url}
                      aria-label={social.id}
                      className="hover:text-teal-accent transition-colors"
                    >
                      <Icon size={22} />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
