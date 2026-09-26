import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
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
  "md:whitespace-nowrap font-semibold text-xl md:text-[25px] leading-[100%] tracking-[0%] capitalize text-teal-accent mb-6 md:mb-[40px] max-md:mb-4 max-md:text-lg";

const itemClass =
  "flex items-center gap-2 md:whitespace-nowrap font-normal text-base md:text-[20px] leading-[120%] md:leading-[100%] tracking-[0%] capitalize text-fg max-md:text-[15px] max-md:min-h-[32px] max-md:[overflow-wrap:anywhere]";

export default function SiteFooter() {
  const { t } = useTranslation();
  return (
    <footer className="relative overflow-visible w-full px-6 mb-[-40px] mt-[55px] max-md:mt-10 max-md:mb-0 font-display md:w-[calc(100%-100px)] md:mx-[50px] md:px-0 md:-translate-x-[10px]">
      <div
        className="hidden lg:block pointer-events-none absolute left-[1280px] top-[458px] w-[60px] h-[100px] bg-[#24B9A5] opacity-50 blur-[90px] z-[5]"
      />
      <img
        src={cityArt}
        alt=""
        className="hidden lg:block pointer-events-none absolute left-[732px] top-10 w-[640px] h-[542px] object-cover opacity-20 z-0 scale-[1.4]"
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

          <p className="mt-[14px] w-full max-w-[312px] text-center font-normal text-lg md:text-[20px] leading-[120%] md:leading-[100%] tracking-[0%] capitalize text-teal-accent">
  {t("footer.tagline")}
</p>

          <div className="w-full max-w-[314px] h-0 border-t border-fg mt-[8px]" />
        </div>

        {/* Columns */}
        <div className="max-w-content mx-auto px-6 pt-0 mt-16 md:mt-[137px] pb-10 max-md:px-0 max-md:mt-10">
          {/* Phones: Explore + Quick Links side by side, then Quick Contact and
              Follow Us as full-width rows (the long email/address need it). */}
          <div className="grid grid-cols-2 gap-y-10 md:flex md:justify-between mb-14 max-md:gap-x-6 max-md:gap-y-9 max-md:mb-6">
            {/* Explore */}
            <div className="max-md:order-1">
              <h4 className={headingClass}>{t("footer.explore")}</h4>
              <ul className="space-y-[32px] max-md:space-y-2">
                <li>
                  <NavLink to="/" className={itemClass}>
                    {t("footer.overview")}
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/services" className={itemClass}>
                    {t("footer.services")}
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/about" className={itemClass}>
                    {t("footer.about")}
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/fleet" className={itemClass}>
                    {t("footer.ourCar")}
                  </NavLink>
                </li>
              </ul>
            </div>

            {/* Quick Contact */}
            <div className="max-md:order-3 max-md:col-span-2">
              <h4 className={headingClass}>{t("footer.quickContact")}</h4>
              <ul className="space-y-[32px] max-md:space-y-2">
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
                  {t("footer.hours")}
                </li>
                <li className={itemClass}>
                  <MapPin size={18} className="text-teal-accent shrink-0" />
                  {t("footer.address")}
                </li>
              </ul>
            </div>

            {/* Quick Links */}
            <div className="max-md:order-2">
              <h4 className={headingClass}>{t("footer.quickLinks")}</h4>
              <ul className="space-y-[32px] max-md:space-y-2">
                <li className={itemClass}>{t("footer.terms")}</li>
                <li className={itemClass}>{t("footer.privacy")}</li>
                <li className={itemClass}>{t("footer.disclaimer")}</li>
                <li className={itemClass}>{t("footer.faq")}</li>
              </ul>
            </div>

            {/* Follow Us */}
            <div className="max-md:order-4 max-md:col-span-2 max-md:border-t max-md:border-line/15 max-md:pt-7 max-md:text-center">
              <h4 className={headingClass}>{t("footer.followUs")}</h4>
              <div className="flex gap-6 text-fg max-md:justify-center">
                {companyInfo.socials.map((social) => {
                  const Icon = socialIcons[social.id];
                  if (!Icon) return null;
                  return (
                    <a
                      key={social.id}
                      href={social.url}
                      aria-label={social.id}
                      className="hover:text-teal-accent transition-colors max-md:p-2 max-md:-m-2"
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
