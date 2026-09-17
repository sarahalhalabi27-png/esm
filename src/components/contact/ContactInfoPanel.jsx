import { MapPin, Phone } from "lucide-react";
import { companyInfo } from "../../data/companyInfo.js";

export default function ContactInfoPanel() {
  return (
    <div className="space-y-4 pt-2">
      <p className="text-xs uppercase tracking-wide text-gray-500">
        Keep Close
      </p>
      <p className="flex items-center gap-2 text-sm text-gray-300">
        <MapPin size={16} className="text-teal-accent shrink-0" />{" "}
        {companyInfo.address}
      </p>
      <p className="flex items-center gap-2 text-sm text-gray-300">
        <Phone size={16} className="text-teal-accent shrink-0" />{" "}
        {companyInfo.secondaryPhone}
      </p>
      <p className="flex items-center gap-2 text-sm text-gray-300">
        <Phone size={16} className="text-teal-accent shrink-0" />{" "}
        {companyInfo.phone}
      </p>
    </div>
  );
}
