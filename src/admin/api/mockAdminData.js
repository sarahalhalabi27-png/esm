import { PERMISSION_RESOURCES } from "../permissions.js";

// Stand-in for the backend's staff and roles tables until the API exists.
// Only the admin mock services read this file.

// Password for every demo staff account below (mock only).
export const DEMO_STAFF_PASSWORD = "Admin1234";

const ALL_PERMISSIONS = Object.entries(PERMISSION_RESOURCES).flatMap(
  ([resource, actions]) => actions.map((action) => `${resource}.${action}`)
);

export const MOCK_ROLES = [
  { id: 1, name: "Super Admin", permissions: ALL_PERMISSIONS },
  {
    id: 2,
    name: "Bookings Agent",
    permissions: [
      "dashboard.view",
      "bookings.view",
      "bookings.create",
      "bookings.update",
      "messages.view",
      "messages.update",
      "customers.view",
    ],
  },
  {
    id: 3,
    name: "Content Editor",
    permissions: [
      "blog.view",
      "blog.create",
      "blog.update",
      "blog.delete",
      "comments.view",
      "comments.update",
      "comments.delete",
      "content.view",
      "content.update",
    ],
  },
  {
    id: 4,
    name: "Fleet Manager",
    permissions: [
      "dashboard.view",
      "fleet.view",
      "fleet.create",
      "fleet.update",
      "fleet.delete",
      "bookings.view",
    ],
  },
];

export const MOCK_STAFF = [
  {
    id: 1,
    name: "Sara Admin",
    email: "admin@esmlimo.com",
    roleId: 1,
    active: true,
  },
  {
    id: 2,
    name: "Omar Bookings",
    email: "bookings@esmlimo.com",
    roleId: 2,
    active: true,
  },
  {
    id: 3,
    name: "Lina Editor",
    email: "editor@esmlimo.com",
    roleId: 3,
    active: true,
  },
  {
    id: 4,
    name: "Karim Fleet",
    email: "fleet@esmlimo.com",
    roleId: 4,
    active: true,
  },
];
