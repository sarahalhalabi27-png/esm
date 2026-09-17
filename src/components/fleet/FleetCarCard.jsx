import { Link } from "react-router-dom";
import { ArrowRight, Users, Briefcase } from "lucide-react";
import CarSilhouetteIcon from "../common/CarSilhouetteIcon.jsx";
import RatingStars from "../common/RatingStars.jsx";

export default function FleetCarCard({ car }) {
  return (
    <Link
      to={`/fleet/${car.id}`}
      className="group rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden block hover:border-teal-accent/50 transition-colors"
    >
      <div className="h-36 flex items-center justify-center bg-gradient-to-b from-white/[0.04] to-transparent">
        {car.image ? (
          <img
            src={car.image}
            alt={car.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <CarSilhouetteIcon size={56} />
        )}
      </div>
      <div className="p-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium mb-1">{car.name}</p>
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Users size={12} /> {car.passengers}
            </span>
            <span className="flex items-center gap-1">
              <Briefcase size={12} /> {car.luggage}
            </span>
            <RatingStars rating={car.rating} size={10} />
          </div>
        </div>
        <ArrowRight
          size={16}
          className="text-teal-accent opacity-0 group-hover:opacity-100 transition-opacity"
        />
      </div>
    </Link>
  );
}
