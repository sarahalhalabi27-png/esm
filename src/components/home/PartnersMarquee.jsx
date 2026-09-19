import SectionEyebrow from "../common/SectionEyebrow.jsx";
import { partners } from "../../data/partnersData.js";

export default function PartnersMarquee() {
  return (
    <section className="font-display">
      <div className="max-w-content mx-auto px-6 py-16 text-center">
        <SectionEyebrow>Our Best Partners</SectionEyebrow>
        <div className="flex flex-wrap justify-center items-center gap-10 mt-6 opacity-80">
          {partners.map((partner, index) => (
            <span
              key={`${partner.id}-${index}`}
              className="text-lg font-semibold tracking-wide text-gray-300"
            >
              {partner.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
