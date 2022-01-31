import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import translationAR from './modules/translation/arabic/translation.json';
import translationCN from './modules/translation/chinese/translation.json';
import translationDE from './modules/translation/german/translation.json';
import translationDR from './modules/translation/dari/translation.json';
import translationEN from './modules/translation/english/translation.json';
import translationES from './modules/translation/spanish/translation.json';
import translationFR from './modules/translation/french/translation.json';
import translationHI from './modules/translation/hindi/translation.json';
import translationJP from './modules/translation/japanese/translation.json';
import translationKR from './modules/translation/korean/translation.json';
import translationPT from './modules/translation/portuguese/translation.json';
import translationRU from './modules/translation/russian/translation.json';
import translationTG from './modules/translation/tagalog/translation.json';
import translationTH from './modules/translation/thai/translation.json';
import translationUK from './modules/translation/ukrainian/translation.json';
import translationUR from './modules/translation/urdu/translation.json';
import translationVT from './modules/translation/vietnamese/translation.json';

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
