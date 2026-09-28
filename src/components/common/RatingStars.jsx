import starsIcon from "../../assets/our-luxury-fleet/stars.svg";

// The stars strip (97x17) used as a mask and filled with the theme accent:
// #24B9A5 in dark mode, #072E2A in light mode.
export default function RatingStars({ rating = 0, size = 12 }) {
  return (
    <span
      role="img"
      aria-label={`${rating} out of 5 stars`}
      className="block shrink-0 bg-teal-accent"
      style={{
        width: (size * 97) / 17,
        height: size,
        WebkitMask: `url(${starsIcon}) center / contain no-repeat`,
        mask: `url(${starsIcon}) center / contain no-repeat`,
      }}
    />
  );
}
