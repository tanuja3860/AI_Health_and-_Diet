import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      welcome: "Clinical AI Health Platform",
      selectLanguage: "Language",
    }
  },
  es: {
    translation: {
      welcome: "Plataforma de Salud de IA Clínica",
      selectLanguage: "Idioma",
    }
  },
  hi: {
    translation: {
      welcome: "क्लीनिकल एआई स्वास्थ्य मंच",
      selectLanguage: "भाषा",
    }
  }
};

if (!i18n.isInitialized) {
  i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: "en",
      fallbackLng: "en",
      interpolation: {
        escapeValue: false
      }
    });
}

export default i18n;