import { Car } from "lucide-react";

export default function CarInteriorGallery({ car }) {
  return (
    <section className="border-b border-white/5">
      <div className="max-w-content mx-auto px-6 py-10">
        <h3 className="text-sm font-medium text-teal-accent mb-4">
          Car Interior
        </h3>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
          {car.interiorImages.map((image, index) => (
            <div
              key={index}
              className="h-20 rounded-lg border border-white/10 bg-white/[0.02] flex items-center justify-center"
            >
              {image ? (
                <img
                  src={image}
                  alt={`${car.name} interior ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <Car size={22} className="text-gray-600" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
