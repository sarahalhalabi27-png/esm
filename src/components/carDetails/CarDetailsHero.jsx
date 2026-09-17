import { Car } from "lucide-react";

export default function CarDetailsHero({ car }) {
  return (
    <section className="border-b border-white/5">
      <div className="max-w-content mx-auto px-6 pt-10 pb-10">
        <h1 className="text-2xl font-semibold mb-8">Car Details</h1>
        <div className="relative h-64 md:h-80 rounded-2xl border border-white/10 bg-white/[0.02] flex items-center justify-center overflow-hidden">
          {car.image ? (
            <img
              src={car.image}
              alt={car.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <Car size={80} className="text-teal-accent" strokeWidth={1} />
          )}
          <span className="absolute top-4 right-4 rounded-full bg-teal-accent text-[#04241a] text-xs font-medium px-4 py-1.5">
            AED {car.pricePerHour.toFixed(2)}
          </span>
        </div>
        <p className="text-center text-sm text-gray-400 mt-4">{car.name}</p>
      </div>
    </section>
  );
}
