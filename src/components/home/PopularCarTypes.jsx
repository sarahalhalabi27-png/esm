import SectionEyebrow from "../common/SectionEyebrow.jsx";
import CarSilhouetteIcon from "../common/CarSilhouetteIcon.jsx";

const popularTypes = [
  { id: "mercedes-1", brand: "Mercedes", count: "15 Car" },
  { id: "mercedes-2", brand: "Mercedes", count: "15 Car" },
  { id: "mercedes-3", brand: "Mercedes", count: "15 Car" },
  { id: "mercedes-4", brand: "Mercedes", count: "15 Car" },
];

export default function PopularCarTypes() {
  return (
    <section className="border-t border-white/5 font-display ">
      <div className="max-w-content mx-auto px-6 py-20">
        <SectionEyebrow>Most Popular Types Of Cars</SectionEyebrow>
        <p className="text-gray-400 text-sm mb-10">
          Explore Our Luxurious Fleet Designed To Elevate Every Occasion:
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {popularTypes.map((type) => (
            <div
              key={type.id}
              className="rounded-2xl border border-white/10 bg-white/[0.02] py-10 flex flex-col items-center gap-3"
            >
              <CarSilhouetteIcon size={36} />
              <div className="text-center text-sm">
                <p>{type.brand}</p>
                <p className="text-gray-500 text-xs">{type.count}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
