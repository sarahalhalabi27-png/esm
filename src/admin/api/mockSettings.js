import { companyInfo } from "../../data/companyInfo.js";

// Mock site settings until the backend exists, seeded from the website's
// contact details (data/companyInfo.js and the Arabic texts in its
// translations). Changes last until the page reloads.
//
// Settings, as the backend should send them:
// {
//   contact: {
//     phone, secondaryPhone, whatsapp, email,
//     address: { en, ar },    shown on the Contact page and used for the map
//     hours: { en, ar },      working hours
//   },
//   socials: { instagram, facebook, linkedin, twitter },   full URLs or ""
//   notifications: {        where the team gets alerts
//     email, newBooking, newMessage, newComment,
//   },
//   updatedAt,
// }

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));
const copy = (value) => structuredClone(value);

const socialUrl = (id) => {
  const url = companyInfo.socials.find((s) => s.id === id)?.url ?? "";
  return url === "#" ? "" : url;
};

let settings = {
  contact: {
    phone: companyInfo.phone,
    secondaryPhone: companyInfo.secondaryPhone,
    whatsapp: companyInfo.whatsapp,
    email: companyInfo.email.toLowerCase(),
    address: {
      en: companyInfo.address,
      ar: "الإمارات، دبي، القوز 3، شارع 12، بناية حسن علي علي بهاي",
    },
    hours: {
      en: companyInfo.hours,
      ar: "الإثنين - السبت، 09:00 - 23:00",
    },
  },
  socials: {
    instagram: socialUrl("instagram"),
    facebook: socialUrl("facebook"),
    linkedin: socialUrl("linkedin"),
    twitter: socialUrl("twitter"),
  },
  notifications: {
    email: "team@esmlimo.com",
    newBooking: true,
    newMessage: true,
    newComment: false,
  },
  updatedAt: new Date(Date.now() - 6 * 864e5).toISOString(),
};

// GET /admin/settings
export async function getSettings() {
  await delay();
  return copy(settings);
}

// PATCH /admin/settings  { contact?, socials?, notifications? }
export async function updateSettings(changes) {
  await delay(400);
  settings = { ...settings, ...changes, updatedAt: new Date().toISOString() };
  return copy(settings);
}
