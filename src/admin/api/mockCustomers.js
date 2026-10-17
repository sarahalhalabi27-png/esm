import { bookingCustomers, bookingStatsFor } from "./mockBookings.js";

// Mock customer accounts (people who signed up on the website) until the
// backend exists. Seeded from the people in the mock bookings, so their
// bookings match up, plus a few who haven't booked yet. Changes last until
// the page reloads.
//
// A customer, as the backend should send it:
// {
//   id, name, email, phone, photo: url | null,
//   emailVerified: boolean,
//   status: "active" | "blocked",       blocked accounts can't sign in
//   createdAt, lastLoginAt,
//   bookings: { total, upcoming, completed, cancelled },
// }

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));
const copy = (value) => structuredClone(value);

function apiError(code, status) {
  const error = new Error(code);
  error.status = status;
  return error;
}

const daysAgo = (days) => new Date(Date.now() - days * 864e5).toISOString();

let customers = [
  ...bookingCustomers(),
  {
    name: "Mona Fares",
    email: "mona.fares@example.com",
    phone: "+971501234567",
  },
  { name: "Peter Novak", email: "peter.novak@example.com", phone: "" },
  {
    name: "Aisha Rahman",
    email: "aisha.rahman@example.com",
    phone: "+971559876543",
  },
].map((person, index) => ({
  id: String(301 + index),
  name: person.name,
  email: person.email,
  phone: person.phone,
  photo: null,
  emailVerified: index % 7 !== 3,
  status: index === 5 ? "blocked" : "active",
  createdAt: daysAgo(40 + index * 9),
  lastLoginAt: daysAgo(index % 5),
}));

const customerOut = (customer) => ({
  ...customer,
  bookings: bookingStatsFor(customer.email),
});

function findCustomer(id) {
  const customer = customers.find((c) => c.id === id);
  if (!customer) throw apiError("NOT_FOUND", 404);
  return customer;
}

// GET /admin/customers?q&status&page&pageSize
// -> { items, total, page, pageSize, counts: { all, active, blocked } }
// Newest accounts first.
export async function listCustomers({
  q = "",
  status = "",
  page = 1,
  pageSize = 15,
} = {}) {
  await delay();
  const needle = q.trim().toLowerCase();
  const found = customers
    .filter(
      (c) =>
        !needle ||
        [c.name, c.email, c.phone].some((v) => v.toLowerCase().includes(needle))
    )
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const list = status ? found.filter((c) => c.status === status) : found;
  const start = (page - 1) * pageSize;
  return copy({
    items: list.slice(start, start + pageSize).map(customerOut),
    total: list.length,
    page,
    pageSize,
    counts: {
      all: found.length,
      active: found.filter((c) => c.status === "active").length,
      blocked: found.filter((c) => c.status === "blocked").length,
    },
  });
}

// GET /admin/customers/:id
export async function getCustomer(id) {
  await delay(200);
  return copy(customerOut(findCustomer(id)));
}

// PATCH /admin/customers/:id  { status: "active" | "blocked" }
export async function updateCustomer({ id, status }) {
  await delay();
  const customer = findCustomer(id);
  customers = customers.map((c) =>
    c.id === customer.id ? { ...c, status } : c
  );
  return copy(customerOut({ ...customer, status }));
}

// DELETE /admin/customers/:id
// Removes the account; their bookings stay (with the contact details given
// on each booking), as records of the trips.
export async function deleteCustomer(id) {
  await delay();
  findCustomer(id);
  customers = customers.filter((c) => c.id !== id);
  return { id };
}
