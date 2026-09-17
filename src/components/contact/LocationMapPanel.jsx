import { MapPin } from "lucide-react";

// Swap the placeholder below for a real embed (Google Maps / Mapbox)
// once an API key is available, e.g.
// <iframe src={`https://www.google.com/maps/embed?...`} className="w-full h-72" />
export default function LocationMapPanel() {
  return (
    <div className="h-72 rounded-2xl border border-white/10 bg-white/[0.02] flex items-center justify-center">
      <div className="text-center text-gray-500 text-sm">
        <MapPin className="mx-auto mb-2 text-teal-accent" size={28} />
        Map Embed Placeholder
      </div>
    </div>
  );
}
