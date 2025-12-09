import i18n from 'i18next';
import HttpApi from 'i18next-http-backend'; // add this import
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(HttpApi)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    supportedLngs: ['en', 'es', 'th'],
    fallbackLng: 'en',
    ns: ['common','home','profile','header','auth','error','cart'],
    defaultNS: 'common',
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    detection: {
      order: ['cookie', 'localStorage', 'htmlTag'],
      caches: ['cookie'],
    },
  });

export default i18n;