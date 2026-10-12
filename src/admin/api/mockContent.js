import en from "../../locales/en/translation.json";
import ar from "../../locales/ar/translation.json";
import offerCar from "../../assets/promo/offer_car.webp";
import uberLogo from "../../assets/partners/uber.png";
import boltLogo from "../../assets/partners/bolt.png";
import yangoLogo from "../../assets/partners/yango.png";

// Mock editable website content until the backend exists, seeded from the
// texts the website shows today (its translation files) and its images.
// Changes last until the page reloads.
//
// Every text is { en, ar }. The blocks, by key:
//   faq:        { items: [{ id, question, answer }] }
//   promo:      { enabled, eyebrow, heading, headingAccent, description, cta, image }
//                 (headingAccent: the words of the heading shown in teal)
//   partners:   { items: [{ id, name, logo, url }] }   (url optional)
//   terms | privacy | disclaimer:
//               { title, intro, sections: [{ id, heading, body }] }
//                 (body: paragraphs separated by a blank line)
// Each comes back with `updatedAt`.

export const CONTENT_KEYS = [
  "faq",
  "promo",
  "partners",
  "terms",
  "privacy",
  "disclaimer",
];
export const LEGAL_PAGES = ["terms", "privacy", "disclaimer"];

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));
const copy = (value) => structuredClone(value);

function apiError(code, status) {
  const error = new Error(code);
  error.status = status;
  return error;
}

let nextId = 1;
const newId = () => `c${nextId++}`;
const both = (enText = "", arText = "") => ({ en: enText, ar: arText });
const paragraphs = (body) =>
  Array.isArray(body) ? body.join("\n\n") : (body ?? "");

const legalPage = (page) => ({
  title: both(en.legal[page].title, ar.legal[page].title),
  intro: both(en.legal[page].intro, ar.legal[page].intro),
  sections: en.legal[page].sections.map((section, index) => ({
    id: newId(),
    heading: both(section.heading, ar.legal[page].sections[index]?.heading),
    body: both(
      paragraphs(section.body),
      paragraphs(ar.legal[page].sections[index]?.body)
    ),
  })),
});

const seededAt = new Date(Date.now() - 10 * 864e5).toISOString();

let content = {
  faq: {
    items: en.legal.faq.items.map((item, index) => ({
      id: newId(),
      question: both(item.q, ar.legal.faq.items[index]?.q),
      answer: both(item.a, ar.legal.faq.items[index]?.a),
    })),
  },
  promo: {
    enabled: true,
    eyebrow: both(en.home.promo.eyebrow, ar.home.promo.eyebrow),
    heading: both(en.home.promo.heading, ar.home.promo.heading),
    headingAccent: both(
      en.home.promo.headingAccent,
      ar.home.promo.headingAccent
    ),
    description: both(en.home.promo.description, ar.home.promo.description),
    cta: both(en.home.promo.cta, ar.home.promo.cta),
    image: offerCar,
  },
  partners: {
    items: [
      { id: newId(), name: "Uber", logo: uberLogo, url: "" },
      { id: newId(), name: "Bolt", logo: boltLogo, url: "" },
      { id: newId(), name: "Yango", logo: yangoLogo, url: "" },
    ],
  },
  terms: legalPage("terms"),
  privacy: legalPage("privacy"),
  disclaimer: legalPage("disclaimer"),
};

let updatedAt = Object.fromEntries(CONTENT_KEYS.map((key) => [key, seededAt]));

function assertKey(key) {
  if (!CONTENT_KEYS.includes(key)) throw apiError("NOT_FOUND", 404);
}

// GET /admin/content/:key
export async function getContent(key) {
  await delay();
  assertKey(key);
  return copy({ ...content[key], updatedAt: updatedAt[key] });
}

// PUT /admin/content/:key  { ...the whole block }
// List items without an id (new ones) get one.
export async function saveContent({ key, value }) {
  await delay(400);
  assertKey(key);
  const withIds = (list) =>
    list.map((item) => ({ ...item, id: item.id || newId() }));
  const next = { ...value };
  if (next.items) next.items = withIds(next.items);
  if (next.sections) next.sections = withIds(next.sections);
  delete next.updatedAt;
  content = { ...content, [key]: next };
  updatedAt = { ...updatedAt, [key]: new Date().toISOString() };
  return copy({ ...next, updatedAt: updatedAt[key] });
}
