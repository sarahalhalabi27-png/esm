import { PERMISSION_RESOURCES } from "../permissions.js";

// Stand-in for the backend's staff and roles tables until the API exists.
// Only the admin mock services use it (auth, staff, roles), and they share
// these same arrays, so a role edited in the dashboard changes what its
// staff can do at their next sign-in or reload of /admin/auth/me. Changes
// last until the page is reloaded.

// Password for every demo staff account below (mock only).
export const DEMO_STAFF_PASSWORD = "Admin1234";

const ALL_PERMISSIONS = Object.entries(PERMISSION_RESOURCES).flatMap(
  ([resource, actions]) => actions.map((action) => `${resource}.${action}`)
);

const daysAgo = (days) => new Date(Date.now() - days * 864e5).toISOString();

export const adminDb = {
  roles: [
    {
      id: 1,
      name: "Super Admin",
      description: "Full access to everything.",
      // System roles can't be edited or deleted.
      system: true,
      permissions: ALL_PERMISSIONS,
    },
    {
      id: 2,
      name: "Bookings Agent",
      description: "Handles bookings and customer messages.",
      system: false,
      permissions: [
        "dashboard.view",
        "bookings.view",
        "bookings.create",
        "bookings.update",
        "messages.view",
        "messages.update",
        "customers.view",
        "fleet.view",
      ],
    },
    {
      id: 3,
      name: "Content Editor",
      description:
        "Writes the blog and keeps the website's content up to date.",
      system: false,
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
      description: "Looks after the cars, their photos and prices.",
      system: false,
      permissions: [
        "dashboard.view",
        "fleet.view",
        "fleet.create",
        "fleet.update",
        "fleet.delete",
        "bookings.view",
      ],
    },
  ],

  // status: "active" | "invited" (hasn't set a password yet) | "disabled"
  staff: [
    {
      id: 1,
      name: "Sara Admin",
      email: "admin@esmlimo.com",
      roleId: 1,
      status: "active",
      createdAt: daysAgo(120),
      lastLoginAt: daysAgo(0),
    },
    {
      id: 2,
      name: "Omar Bookings",
      email: "bookings@esmlimo.com",
      roleId: 2,
      status: "active",
      createdAt: daysAgo(90),
      lastLoginAt: daysAgo(1),
    },
    {
      id: 3,
      name: "Lina Editor",
      email: "editor@esmlimo.com",
      roleId: 3,
      status: "active",
      createdAt: daysAgo(60),
      lastLoginAt: daysAgo(3),
    },
    {
      id: 4,
      name: "Karim Fleet",
      email: "fleet@esmlimo.com",
      roleId: 4,
      status: "active",
      createdAt: daysAgo(45),
      lastLoginAt: daysAgo(2),
    },
    {
      id: 5,
      name: "Hana Ibrahim",
      email: "hana@esmlimo.com",
      roleId: 2,
      status: "invited",
      createdAt: daysAgo(2),
      lastLoginAt: null,
    },
    {
      id: 6,
      name: "Rami Saleh",
      email: "rami@esmlimo.com",
      roleId: 4,
      status: "disabled",
      createdAt: daysAgo(200),
      lastLoginAt: daysAgo(40),
    },
  ],
};

// The demo accounts that can sign in (shown on the login page in dev).
export const DEMO_ACCOUNTS = adminDb.staff
  .filter((staff) => staff.status === "active")
  .map(({ id, name, email }) => ({ id, name, email }));
