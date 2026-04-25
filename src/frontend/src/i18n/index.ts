import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import as from "./locales/as.json";
import bn from "./locales/bn.json";
import brx from "./locales/brx.json";
import doi from "./locales/doi.json";
import en from "./locales/en.json";
import gu from "./locales/gu.json";
import hi from "./locales/hi.json";
import kn from "./locales/kn.json";
import kok from "./locales/kok.json";
import ks from "./locales/ks.json";
import mai from "./locales/mai.json";
import ml from "./locales/ml.json";
import mr from "./locales/mr.json";
import ne from "./locales/ne.json";
import or from "./locales/or.json";
import pa from "./locales/pa.json";
import sa from "./locales/sa.json";
import sd from "./locales/sd.json";
import ta from "./locales/ta.json";
import te from "./locales/te.json";
import ur from "./locales/ur.json";

const STORAGE_KEY = "reliefconnect_language";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      hi: { translation: hi },
      bn: { translation: bn },
      te: { translation: te },
      mr: { translation: mr },
      ta: { translation: ta },
      ur: { translation: ur },
      gu: { translation: gu },
      kn: { translation: kn },
      ml: { translation: ml },
      or: { translation: or },
      pa: { translation: pa },
      as: { translation: as },
      mai: { translation: mai },
      sa: { translation: sa },
      kok: { translation: kok },
      ne: { translation: ne },
      sd: { translation: sd },
      doi: { translation: doi },
      ks: { translation: ks },
      brx: { translation: brx },
    },
    fallbackLng: "en",
    defaultNS: "translation",
    detection: {
      order: ["localStorage", "navigator"],
      lookupLocalStorage: STORAGE_KEY,
      caches: ["localStorage"],
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
export { STORAGE_KEY };
