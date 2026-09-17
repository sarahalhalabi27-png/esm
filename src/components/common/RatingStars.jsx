import { Star } from "lucide-react";

export default function RatingStars({ rating = 0, size = 12 }) {
  return (
    <span
      className="flex items-center gap-0.5 text-teal-accent"
      aria-label={`${rating} out of 5 stars`}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={size}
          fill={i < rating ? "currentColor" : "none"}
          stroke="currentColor"
        />
      ))}
    </span>
  );
}
