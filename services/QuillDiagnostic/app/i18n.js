import i18n from "i18next";
import { reactI18nextModule } from "react-i18next";
import translationAR from '../public/locales/arabic/translation.json';
import translationCN from '../public/locales/chinese/translation.json';
import translationDE from '../public/locales/german/translation.json';
import translationDR from '../public/locales/dari/translation.json';
import translationEN from '../public/locales/english/translation.json';
import translationES from '../public/locales/spanish/translation.json';
import translationFR from '../public/locales/french/translation.json';
import translationHI from '../public/locales/hindi/translation.json';
import translationJP from '../public/locales/japanese/translation.json';
import translationKR from '../public/locales/korean/translation.json';
import translationPT from '../public/locales/portuguese/translation.json';
import translationRU from '../public/locales/russian/translation.json';
import translationTG from '../public/locales/tagalog/translation.json';
import translationTH from '../public/locales/thai/translation.json';
import translationUK from '../public/locales/ukrainian/translation.json';
import translationUR from '../public/locales/urdu/translation.json';
import translationVT from '../public/locales/vietnamese/translation.json';

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
  .use(reactI18nextModule)
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