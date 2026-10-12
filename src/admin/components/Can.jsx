import useCan from "../hooks/useCan.js";

// Renders its children only for staff with `permission`, e.g.
//   <Can permission={P.bookings.delete}><DeleteButton /></Can>
export default function Can({ permission, children, fallback = null }) {
  const can = useCan();
  return can(permission) ? children : fallback;
}
