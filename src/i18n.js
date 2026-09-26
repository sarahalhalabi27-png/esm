import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en/translation.json";
import ar from "./locales/ar/translation.json";

// Remembered language (set by the header language toggle).
const savedLanguage = localStorage.getItem("lang") || "en";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ar: { translation: ar },
  },
  lng: savedLanguage,
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

// Keep <html> lang/dir in sync with the language, on load and on every change.
function applyDocumentLanguage(language) {
  document.documentElement.lang = language;
  document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
}

applyDocumentLanguage(savedLanguage);
i18n.on("languageChanged", (language) => {
  localStorage.setItem("lang", language);
  applyDocumentLanguage(language);
});

export default i18n;
