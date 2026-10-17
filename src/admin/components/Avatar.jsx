import { initials } from "../utils/people.js";

const SIZES = {
  md: "h-10 w-10 text-sm",
  lg: "h-16 w-16 text-xl",
};

// A person's photo, or their initials ("Sara Admin" -> "SA") in a teal
// circle when there's none.
export default function Avatar({ name, photo, size = "md", className = "" }) {
  const box = `${SIZES[size]} shrink-0 rounded-full ${className}`;
  if (photo) {
    return <img src={photo} alt="" className={`${box} object-cover`} />;
  }
  return (
    <span
      aria-hidden="true"
      className={`${box} grid place-items-center bg-teal-accent/15 font-semibold text-teal-accent`}
    >
      {initials(name)}
    </span>
  );
}
