import SectionEyebrow from "../common/SectionEyebrow.jsx";
import ServiceTimelineCard from "./ServiceTimelineCard.jsx";
import { limoServices } from "../../data/servicesData.js";

export default function ServiceTimelineGrid() {
  return (
    <section className="border-t border-white/5 bg-white/[0.015] font-display ">
      <div className="max-w-content mx-auto px-6 py-20">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <SectionEyebrow>ESM Limo Services</SectionEyebrow>
          <p className="text-gray-400 text-sm">
            ESM Limo Offers Premium Transportation Solutions Tailored To Meet
            Your Every Need. From Luxury Rides To Professional Chauffeur
            Services, We Ensure A Seamless And Stylish Travel Experience Across
            The UAE.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 gap-10">
          {limoServices.map((service, index) => (
            <ServiceTimelineCard
              key={service.id}
              service={service}
              flip={index % 2 === 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
