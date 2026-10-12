// Mock bookings "table" and service until the backend exists. The data is
// generated once per page load (seeded, so it's the same every time) and
// changes made in the dashboard last until the page is reloaded.
//
// A booking, as the backend should send it:
// {
//   id, reference: "ESM-1042", createdAt: ISO string,
//   service: "pointToPoint" | "hourly" | "airportTransfer" | "cityTour"
//          | "carReservation" (Reserve on a car's page)
//          | "quickRequest"   (the short form on the home page),
//   status: "new" | "confirmed" | "completed" | "cancelled",
//   customer: { name, email, phone },
//   pickup: { location, date: "YYYY-MM-DD", time: "HH:mm" },
//   dropOff: { location, date, time },        (any of them may be empty)
//   car: { id, name } | null, carType, passengers,
//   details: { ...fields only some services have, see SERVICE_DETAILS },
//   notes,
// }

export const BOOKING_STATUSES = ["new", "confirmed", "completed", "cancelled"];
export const BOOKING_SERVICES = [
  "pointToPoint",
  "hourly",
  "airportTransfer",
  "cityTour",
  "carReservation",
  "quickRequest",
];

const delay = (ms = 350) => new Promise((resolve) => setTimeout(resolve, ms));

// Small seeded random generator, so the mock data is stable across reloads.
function seededRandom(seed) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const NAMES = [
  "Ahmed Al Mansouri",
  "Sarah Johnson",
  "Omar Haddad",
  "Layla Nasser",
  "James Carter",
  "Fatima Al Zaabi",
  "Daniel Smith",
  "Noor Khalil",
  "Michael Brown",
  "Rania Saleh",
  "Khalid Al Suwaidi",
  "Emma Wilson",
  "Yousef Darwish",
  "Hana Ibrahim",
  "Lucas Martin",
  "Mariam Al Hashimi",
];
const PLACES = [
  "Dubai Marina",
  "Downtown Dubai",
  "Palm Jumeirah",
  "Business Bay",
  "Jumeirah Beach Residence",
  "Dubai Mall",
  "Burj Al Arab",
  "DIFC",
  "Al Barsha",
  "Dubai Hills",
  "Atlantis The Palm",
  "City Walk",
];
const AIRPORTS = ["DXB Terminal 1", "DXB Terminal 3", "DWC Al Maktoum"];
const CARS = [
  { id: "gmc-yukon", name: "GMC Yukon" },
  { id: "mercedes-eqc", name: "Mercedes-Benz EQC" },
  { id: "cadillac-escalade", name: "Cadillac Escalade" },
  { id: "bmw-760li", name: "BMW 760Li" },
  { id: "audi-a8", name: "Audi A8" },
  { id: "mercedes-eqs", name: "Mercedes-Benz EQS" },
  { id: "lexus-es", name: "Lexus ES 300h" },
];
const CAR_TYPES = ["businessClass", "businessVan", "sprinterClass"];
const NOTES = [
  "",
  "",
  "Child seat please.",
  "Meet at the main lobby.",
  "Two large suitcases.",
  "Please call on arrival.",
];

const pad = (n) => String(n).padStart(2, "0");
const isoDate = (date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

function generateBookings() {
  const random = seededRandom(42);
  const pick = (list) => list[Math.floor(random() * list.length)];
  const now = new Date();
  const today = isoDate(now);
  const bookings = [];

  for (let i = 0; i < 56; i += 1) {
    const service = pick([
      "pointToPoint",
      "pointToPoint",
      "hourly",
      "airportTransfer",
      "airportTransfer",
      "cityTour",
      "carReservation",
      "quickRequest",
    ]);
    const createdAt = new Date(now);
    createdAt.setDate(now.getDate() - Math.floor(random() * 30));
    createdAt.setHours(
      8 + Math.floor(random() * 14),
      Math.floor(random() * 60)
    );
    const pickupDay = new Date(createdAt);
    pickupDay.setDate(createdAt.getDate() + Math.floor(random() * 14));
    const pickupDate = isoDate(pickupDay);
    const pickupTime = `${pad(6 + Math.floor(random() * 16))}:${pick(["00", "15", "30", "45"])}`;

    let status;
    if (pickupDate < today)
      status = random() < 0.85 ? "completed" : "cancelled";
    else if (now - createdAt < 3 * 864e5)
      status = random() < 0.7 ? "new" : "confirmed";
    else status = random() < 0.85 ? "confirmed" : "cancelled";

    const name = pick(NAMES);
    const email = `${name.toLowerCase().replace(/[^a-z]+/g, ".")}@example.com`;
    const phone = `+9715${Math.floor(10000000 + random() * 89999999)}`;
    const car = service === "quickRequest" ? null : pick(CARS);
    const passengers = String(1 + Math.floor(random() * 5));

    const booking = {
      id: String(1001 + i),
      reference: `ESM-${1001 + i}`,
      createdAt: createdAt.toISOString(),
      service,
      status,
      customer: { name, email, phone },
      pickup: { location: pick(PLACES), date: pickupDate, time: pickupTime },
      dropOff: { location: "", date: "", time: "" },
      car,
      carType: ["carReservation", "quickRequest"].includes(service)
        ? ""
        : pick(CAR_TYPES),
      passengers: service === "quickRequest" ? "" : passengers,
      details: {},
      notes: pick(NOTES),
    };

    if (service === "pointToPoint" || service === "quickRequest") {
      booking.dropOff.location = pick(PLACES);
    } else if (service === "hourly") {
      booking.details = {
        hours: String(2 + Math.floor(random() * 7)),
        stops: random() < 0.4 ? [pick(PLACES), pick(PLACES)] : [],
      };
    } else if (service === "airportTransfer") {
      const toAirport = random() < 0.5;
      const airport = pick(AIRPORTS);
      booking.details = {
        transferType: toAirport ? "toAirport" : "fromAirport",
        airport,
        flightNumber: `${pick(["EK", "FZ", "QR", "BA"])}${100 + Math.floor(random() * 899)}`,
      };
      if (toAirport) booking.dropOff.location = airport;
      else {
        booking.dropOff.location = booking.pickup.location;
        booking.pickup.location = airport;
      }
    } else if (service === "cityTour") {
      booking.pickup.location = "Dubai";
      booking.details = {
        duration: pick(["halfDay", "fullDay"]),
        places: "Burj Khalifa, Dubai Frame, Old Dubai souks",
      };
    } else if (service === "carReservation") {
      const dropOffDay = new Date(pickupDay);
      dropOffDay.setDate(pickupDay.getDate() + 1 + Math.floor(random() * 3));
      booking.dropOff = {
        location: booking.pickup.location,
        date: isoDate(dropOffDay),
        time: pickupTime,
      };
      booking.details = { bookingDuration: pick(["daily", "weekly"]) };
    }

    bookings.push(booking);
  }

  return bookings.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

let bookings = generateBookings();

// For the other mocks (customers): who has booked, and their bookings'
// statuses, matched by email as the backend would by account.
export function bookingCustomers() {
  const byEmail = new Map();
  [...bookings].reverse().forEach(({ customer }) => {
    if (!byEmail.has(customer.email)) byEmail.set(customer.email, customer);
  });
  return [...byEmail.values()].map((c) => ({ ...c }));
}

export function bookingStatsFor(email) {
  const mine = bookings.filter((b) => b.customer.email === email);
  return {
    total: mine.length,
    completed: mine.filter((b) => b.status === "completed").length,
    cancelled: mine.filter((b) => b.status === "cancelled").length,
    upcoming: mine.filter((b) => ["new", "confirmed"].includes(b.status))
      .length,
  };
}

// Answers are copies, as from a real API: the store freezes what it keeps,
// so handing it these objects would stop later updates to them.
const copy = (value) => structuredClone(value);

function notFound() {
  const error = new Error("NOT_FOUND");
  error.status = 404;
  return error;
}

function matchesSearch(booking, q) {
  if (!q) return true;
  const needle = q.trim().toLowerCase();
  return [
    booking.reference,
    booking.customer.name,
    booking.customer.email,
    booking.customer.phone,
  ].some((value) => value.toLowerCase().includes(needle));
}

// GET /admin/bookings?page&pageSize&status&service&q&from&to
// -> { items, total, page, pageSize, counts: { all, new, confirmed, ... } }
// `from`/`to` filter the pickup date (YYYY-MM-DD, inclusive). `counts` are
// per status for the other filters, for the status tabs.
export async function listBookings({
  page = 1,
  pageSize = 10,
  status = "",
  service = "",
  q = "",
  from = "",
  to = "",
} = {}) {
  await delay();
  const filtered = bookings.filter(
    (b) =>
      (!service || b.service === service) &&
      (!from || b.pickup.date >= from) &&
      (!to || b.pickup.date <= to) &&
      matchesSearch(b, q)
  );
  const counts = { all: filtered.length };
  BOOKING_STATUSES.forEach((s) => {
    counts[s] = filtered.filter((b) => b.status === s).length;
  });
  const withStatus = status
    ? filtered.filter((b) => b.status === status)
    : filtered;
  const start = (page - 1) * pageSize;
  return {
    items: copy(withStatus.slice(start, start + pageSize)),
    total: withStatus.length,
    page,
    pageSize,
    counts,
  };
}

// GET /admin/bookings/:id
export async function getBooking(id) {
  await delay(250);
  const booking = bookings.find((b) => b.id === id);
  if (!booking) throw notFound();
  return copy(booking);
}

// PATCH /admin/bookings/:id  { status }
export async function updateBooking({ id, ...changes }) {
  await delay();
  const index = bookings.findIndex((b) => b.id === id);
  if (index === -1) throw notFound();
  bookings[index] = { ...bookings[index], ...changes };
  return copy(bookings[index]);
}

// GET /admin/bookings/stats  (for the Overview; "today" is the company's
// local day, Dubai time, on the backend)
// -> {
//   todayPickups,      pickups today, not cancelled
//   newRequests,       bookings still "new" (waiting for the team)
//   nextSevenDays,     pickups today and the 6 days after, not cancelled
//   receivedThisMonth, bookings received since the 1st of this month
//   upcoming: [booking, ...]   next 6 pickups from now, new or confirmed
//   byService: [{ service, count }, ...]  received in the last 30 days, most first
// }
export async function getBookingStats() {
  await delay();
  const now = new Date();
  const today = isoDate(now);
  const inSevenDays = new Date(now);
  inSevenDays.setDate(now.getDate() + 6);
  const weekEnd = isoDate(inSevenDays);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const thirtyDaysAgo = new Date(now - 30 * 864e5);
  const nowTime = `${today}T${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  const active = bookings.filter((b) => b.status !== "cancelled");
  const pickupAt = (b) => `${b.pickup.date}T${b.pickup.time}`;

  const byService = BOOKING_SERVICES.map((service) => ({
    service,
    count: bookings.filter(
      (b) => b.service === service && new Date(b.createdAt) >= thirtyDaysAgo
    ).length,
  })).sort((a, b) => b.count - a.count);

  return copy({
    todayPickups: active.filter((b) => b.pickup.date === today).length,
    newRequests: bookings.filter((b) => b.status === "new").length,
    nextSevenDays: active.filter(
      (b) => b.pickup.date >= today && b.pickup.date <= weekEnd
    ).length,
    receivedThisMonth: bookings.filter(
      (b) => new Date(b.createdAt) >= monthStart
    ).length,
    upcoming: bookings
      .filter(
        (b) => ["new", "confirmed"].includes(b.status) && pickupAt(b) >= nowTime
      )
      .sort((a, b) => pickupAt(a).localeCompare(pickupAt(b)))
      .slice(0, 6),
    byService,
  });
}

// DELETE /admin/bookings/:id
export async function deleteBooking(id) {
  await delay();
  const before = bookings.length;
  bookings = bookings.filter((b) => b.id !== id);
  if (bookings.length === before) throw notFound();
  return { id };
}
