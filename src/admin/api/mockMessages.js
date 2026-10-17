// Mock "Contact Us" messages and service until the backend exists. Seeded
// (the same every load); changes last until the page reloads.
//
// A message, as the backend should send it:
// {
//   id, createdAt: ISO string,
//   name, email, phone, subject, message,   (from the Contact Us form;
//                                            phone and subject may be empty)
//   read: boolean,      opened by someone on the team
//   replied: boolean,   marked as answered
//   archived: boolean,  out of the inbox
// }

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));
const copy = (value) => structuredClone(value);

function apiError(code, status) {
  const error = new Error(code);
  error.status = status;
  return error;
}

const SAMPLES = [
  {
    name: "Sarah Johnson",
    subject: "Wedding car hire",
    message:
      "Hello, we're getting married on 14 November and would like two cars for the bridal party, from Jumeirah to the Atlantis The Palm. Could you share options and prices?",
  },
  {
    name: "Khalid Al Suwaidi",
    subject: "Corporate account",
    message:
      "We regularly need airport pickups for visiting executives (around 10 a month). Do you offer monthly invoicing for companies?",
  },
  {
    name: "Emma Wilson",
    subject: "",
    message:
      "Is there a child seat available in the Mercedes EQS? I'm booking for my family next week.",
  },
  {
    name: "Yousef Darwish",
    subject: "Lost item",
    message:
      "I think I left my sunglasses in the car yesterday (booking ESM-1031). Could you check with the driver please?",
  },
  {
    name: "Noor Khalil",
    subject: "Abu Dhabi day trip",
    message:
      "Can you do a full-day trip to Abu Dhabi with stops at the Grand Mosque and the Louvre? Four passengers.",
  },
  {
    name: "Daniel Smith",
    subject: "Invoice request",
    message:
      "Could you send me a VAT invoice for my airport transfer on 3 October? My company needs it for reimbursement.",
  },
  {
    name: "Fatima Al Zaabi",
    subject: "Feedback",
    message:
      "Just wanted to say the driver on Saturday was excellent, very professional and on time. Thank you!",
  },
  {
    name: "Lucas Martin",
    subject: "Change pickup time",
    message:
      "I need to move my pickup tomorrow from 7:00 to 8:30. Booking reference ESM-1042.",
  },
];

function seededRandom(seed) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function generateMessages() {
  const random = seededRandom(7);
  const now = Date.now();
  return Array.from({ length: 24 }, (_, i) => {
    const sample = SAMPLES[i % SAMPLES.length];
    const ageHours = i < 3 ? i * 3 + 1 : i * 19 + Math.floor(random() * 12);
    const read = i >= 5 || random() < 0.2;
    return {
      id: String(501 + i),
      createdAt: new Date(now - ageHours * 36e5).toISOString(),
      name: sample.name,
      email: `${sample.name.toLowerCase().replace(/[^a-z]+/g, ".")}@example.com`,
      phone:
        random() < 0.7
          ? `9715${Math.floor(10000000 + random() * 89999999)}`
          : "",
      subject: sample.subject,
      message: sample.message,
      read,
      replied: read && random() < 0.6,
      archived: i > 15 && random() < 0.6,
    };
  });
}

let messages = generateMessages();

const matches = (m, needle) =>
  !needle ||
  [m.name, m.email, m.subject, m.message].some((v) =>
    v.toLowerCase().includes(needle)
  );

// GET /admin/messages?view&q&page&pageSize
//   view: "" (inbox: not archived) | "unread" (inbox, not read) | "archived"
// -> { items, total, page, pageSize, counts: { inbox, unread, archived } }
// Newest first. `counts` follow the search, for the tabs.
export async function listMessages({
  view = "",
  q = "",
  page = 1,
  pageSize = 15,
} = {}) {
  await delay();
  const needle = q.trim().toLowerCase();
  const found = messages.filter((m) => matches(m, needle));
  const inbox = found.filter((m) => !m.archived);
  const lists = {
    "": inbox,
    unread: inbox.filter((m) => !m.read),
    archived: found.filter((m) => m.archived),
  };
  const list = lists[view] ?? inbox;
  const start = (page - 1) * pageSize;
  return copy({
    items: list.slice(start, start + pageSize),
    total: list.length,
    page,
    pageSize,
    counts: {
      inbox: inbox.length,
      unread: lists.unread.length,
      archived: lists.archived.length,
    },
  });
}

// GET /admin/messages/stats -> { unread, latestUnread: [up to 3 messages] }
export async function getMessageStats() {
  await delay(200);
  const unread = messages.filter((m) => !m.read && !m.archived);
  return copy({ unread: unread.length, latestUnread: unread.slice(0, 3) });
}

// GET /admin/messages/:id
export async function getMessage(id) {
  await delay(200);
  const message = messages.find((m) => m.id === id);
  if (!message) throw apiError("NOT_FOUND", 404);
  return copy(message);
}

// PATCH /admin/messages/:id  { read?, replied?, archived? }
export async function updateMessage({ id, ...changes }) {
  await delay();
  const index = messages.findIndex((m) => m.id === id);
  if (index === -1) throw apiError("NOT_FOUND", 404);
  messages[index] = { ...messages[index], ...changes };
  return copy(messages[index]);
}

// DELETE /admin/messages/:id
export async function deleteMessage(id) {
  await delay();
  if (!messages.some((m) => m.id === id)) throw apiError("NOT_FOUND", 404);
  messages = messages.filter((m) => m.id !== id);
  return { id };
}
