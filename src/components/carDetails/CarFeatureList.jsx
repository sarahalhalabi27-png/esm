import {
  Gauge,
  Leaf,
  Droplet,
  Users,
  Briefcase,
  Thermometer,
} from "lucide-react";

const iconMap = {
  gauge: Gauge,
  leaf: Leaf,
  droplet: Droplet,
  users: Users,
  briefcase: Briefcase,
  thermometer: Thermometer,
};

export default function CarFeatureList({ car }) {
  return (
    <section className="border-b border-white/5">
      <div className="max-w-content mx-auto px-6 py-10">
        <h2 className="text-sm font-medium text-teal-accent mb-2">
          Description About {car.name}
        </h2>
        <p className="text-sm text-gray-400 leading-relaxed mb-8 max-w-3xl">
          {car.description}
        </p>
        <h3 className="text-sm font-medium text-teal-accent mb-4">
          Car Features
        </h3>
        <div className="flex flex-wrap gap-x-8 gap-y-4">
          {car.features.map((feature) => {
            const Icon = iconMap[feature.icon] || Gauge;
            return (
              <span
                key={feature.label}
                className="flex items-center gap-2 text-sm text-gray-300"
              >
                <Icon size={16} className="text-teal-accent" /> {feature.label}
              </span>
            );
          })}
        </div>
      </div>
    </section>
  );
}
