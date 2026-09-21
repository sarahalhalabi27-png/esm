import SectionEyebrow from "../common/SectionEyebrow.jsx";
import ServiceTimelineCard from "./ServiceTimelineCard.jsx";
import { limoServices } from "../../data/servicesData.js";

export default function ServiceTimelineGrid() {
  return (
    <section className="font-display ">
      <div className="max-w-content mx-auto px-6 py-20">
      <div className="text-center mb-14">
  <SectionEyebrow>ESM Limo Services</SectionEyebrow>

  <p
    className="
      w-[1350px]
      h-[72px]
      ml-[0px]
      mt-[30px]
      text-[22px]
      font-medium
      leading-[164%]
      tracking-[0%]
      text-center
      capitalize
      text-fg
    "
  >
    ESM Limo Offers Premium Transportation Solutions Tailored To Meet Your
    Every Need. From Luxury Rides To Professional Chauffeur Services, We
    Ensure A Seamless And Stylish Travel Experience Across The UAE.
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
