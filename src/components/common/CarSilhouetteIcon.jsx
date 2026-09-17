import { Car } from "lucide-react";

export default function CarSilhouetteIcon({ size = 56, className = "" }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Car size={size} className="text-teal-accent" strokeWidth={1.1} />
    </div>
  );
}
