// The user's initials: the first letters of up to two words of the name, or
// the first letter of the email when there is no name yet.
function userInitials({ name, email }) {
  const words = (name || "").trim().split(/\s+/).filter(Boolean);
  if (words.length)
    return words
      .slice(0, 2)
      .map((w) => w[0])
      .join("");
  return (email || "?").trim()[0] ?? "?";
}

// A round avatar: the user's photo, or their initials on the brand teal.
// `size` is in px; `className` is added (e.g. a ring or a margin).
export default function UserAvatar({ user, size = 40, className = "" }) {
  const box = { width: size, height: size };

  if (user.photo) {
    return (
      <img
        src={user.photo}
        alt=""
        loading="lazy"
        decoding="async"
        style={box}
        className={`shrink-0 rounded-full object-cover ${className}`}
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      style={{ ...box, fontSize: Math.round(size * 0.38) }}
      className={`grid shrink-0 place-items-center rounded-full bg-[#24B9A5] font-semibold uppercase text-black ${className}`}
    >
      {userInitials(user)}
    </span>
  );
}
