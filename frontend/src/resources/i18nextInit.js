import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translation from './resources';

const i18nInit = () => {
  i18n
    .use(initReactI18next)
    .init({
      resources: translation,
      lng: 'ru', // default language
      fallbackLng: 'ru',
      interpolation: {
        escapeValue: false, // allows usage of HTML tags in translations
      },
    });
};

export default i18nInit;
