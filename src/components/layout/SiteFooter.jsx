import { NavLink } from "react-router-dom";
import {
  Phone,
  Mail,
  Clock,
  MapPin,
  Instagram,
  Facebook,
  Twitter,
} from "lucide-react";
import { companyInfo } from "../../data/companyInfo.js";

const socialIcons = {
  instagram: Instagram,
  facebook: Facebook,
  twitter: Twitter,
};

export default function SiteFooter() {
  return (
    <footer className="border-t border-white/5 font-display">
      <div className="max-w-content mx-auto px-6 pt-16 pb-10">
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-10 mb-14">
          <div>
            <h4 className="text-sm font-medium text-teal-accent mb-4">
              Explore
            </h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <NavLink to="/" className="hover:text-white">
                  Overview
                </NavLink>
              </li>
              <li>
                <NavLink to="/services" className="hover:text-white">
                  Services
                </NavLink>
              </li>
              <li>
                <NavLink to="/about" className="hover:text-white">
                  About Us
                </NavLink>
              </li>
              <li>
                <NavLink to="/fleet" className="hover:text-white">
                  Our Car
                </NavLink>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-medium text-teal-accent mb-4">
              Quick Contact
            </h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <Phone size={14} /> {companyInfo.phone}
              </li>
              <li className="flex items-center gap-2">
                <Mail size={14} /> {companyInfo.email}
              </li>
              <li className="flex items-center gap-2">
                <Clock size={14} /> {companyInfo.hours}
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={14} /> {companyInfo.address}
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-medium text-teal-accent mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Terms Of Services</li>
              <li>Privacy Policy</li>
              <li>Disclaimer</li>
              <li>FAQ</li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-medium text-teal-accent mb-4">
              Follow Us
            </h4>
            <div className="flex gap-4 text-gray-400">
              {companyInfo.socials.map((social) => {
                const Icon = socialIcons[social.id];
                return (
                  <a
                    key={social.id}
                    href={social.url}
                    aria-label={social.id}
                    className="hover:text-teal-accent"
                  >
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
        <div className="text-center border-t border-white/5 pt-8">
          <p className="text-lg font-semibold text-teal-accent">
            {companyInfo.name}
          </p>
          <p className="text-xs text-gray-500 mt-1">{companyInfo.tagline}</p>
        </div>
      </div>
    </footer>
  );
}
