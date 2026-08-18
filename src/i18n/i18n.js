import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "@/i18n/locales/en/translation.json";
import ur from "@/i18n/locales/ur/translation.json";

// Languages that should flip the document to RTL
export const RTL_LANGUAGES = ["ur"];

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ur: { translation: ur },
    },
    fallbackLng: "en",
    supportedLngs: ["en", "ur"],
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: "solar_portal_lang",
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
