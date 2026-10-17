// Permission keys the dashboard checks, as "<resource>.<action>".
//
// The backend owns roles: an admin builds them in the Roles tab and the
// backend decides which keys each staff member has (sent with the login and
// /admin/auth/me answers). The dashboard never hardcodes a role; it only reads
// that key list to show or hide tabs, routes and buttons. The backend still
// checks every request itself.
//
// Keep this list in sync with the backend's permission catalog.
export const PERMISSION_RESOURCES = {
  dashboard: ["view"],
  bookings: ["view", "create", "update", "delete"],
  fleet: ["view", "create", "update", "delete"],
  messages: ["view", "update", "delete"],
  blog: ["view", "create", "update", "delete"],
  comments: ["view", "update", "delete"],
  content: ["view", "update"],
  customers: ["view", "update", "delete"],
  staff: ["view", "create", "update", "delete"],
  roles: ["view", "create", "update", "delete"],
  settings: ["view", "update"],
};

// P.bookings.view === "bookings.view". A typo (P.bokings) throws instead of
// silently checking a key that doesn't exist.
export const P = Object.fromEntries(
  Object.entries(PERMISSION_RESOURCES).map(([resource, actions]) => [
    resource,
    Object.fromEntries(
      actions.map((action) => [action, `${resource}.${action}`])
    ),
  ])
);
