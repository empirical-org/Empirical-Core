import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import translationAR from './modules/arabic/translation.json';
import translationCN from './modules/chinese/translation.json';
import translationDR from './modules/dari/translation.json';
import translationEN from './modules/english/translation.json';
import translationFR from './modules/french/translation.json';
import translationDE from './modules/german/translation.json';
import translationHI from './modules/hindi/translation.json';
import translationJP from './modules/japanese/translation.json';
import translationKR from './modules/korean/translation.json';
import translationPT from './modules/portuguese/translation.json';
import translationRU from './modules/russian/translation.json';
import translationES from './modules/spanish/translation.json';
import translationTG from './modules/tagalog/translation.json';
import translationTH from './modules/thai/translation.json';
import translationUK from './modules/ukrainian/translation.json';
import translationUR from './modules/urdu/translation.json';
import translationVT from './modules/vietnamese/translation.json';

// the translations
const resources = {
  arabic: { translation: translationAR },
  chinese: { translation: translationCN },
  dari: { translation: translationDR },
  english: { translation: translationEN },
  french: { translation: translationFR },
  german: { translation: translationDE },
  hindi: { translation: translationHI },
  japanese: { translation: translationJP},
  korean: { translation: translationKR},
  portuguese: { translation: translationPT},
  russian: { translation: translationRU},
  spanish: { translation: translationES },
  tagalog: { translation: translationTG },
  thai: { translation: translationTH },
  ukrainian: { translation: translationUK },
  urdu: { translation: translationUR },
  vietnamese: { translation: translationVT }
};

//i18n configurations

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "english",
    defaultTransParent: 'div',
    // we use the ^ and | as separators because many label strings contain a period or colon,
    // which will cause the translation to fail
    keySeparator: '^',
    nsSeparator: '|',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
