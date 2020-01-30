import i18n from "i18next";
import { reactI18nextModule } from "react-i18next";
import translationAR from '../public/locales/arabic/translation.json';
import translationCN from '../public/locales/chinese/translation.json';
import translationEN from '../public/locales/english/translation.json';
import translationFR from '../public/locales/french/translation.json';
import translationHI from '../public/locales/hindi/translation.json';
import translationES from '../public/locales/spanish/translation.json';
import translationVT from '../public/locales/vietnamese/translation.json';

// the translations
const resources = {
  arabic: { translation: translationAR },
  chinese: { translation: translationCN },
  english: { translation: translationEN },
  french: { translation: translationFR },
  hindi: { translation: translationHI },
  spanish: { translation: translationES },
  vietnamese: { translation: translationVT }
};

//i18n configurations

i18n
  .use(reactI18nextModule)
  .init({
    resources,
    lng: "english",
    defaultTransParent: 'div',
    keySeparator: false, 

    interpolation: {
      escapeValue: false
    }
  });

  export default i18n;