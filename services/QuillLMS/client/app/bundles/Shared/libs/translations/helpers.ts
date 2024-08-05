import { ENGLISH } from '../../utils/languageList'

export const getlanguageOptions = (translations) => ([
  { value: ENGLISH, label: ENGLISH },
  ...Object.keys(translations).map(language => ({
    value: language,
    label: language
  }))
]);

// Temporary feature flag until we are ready to ship this.
export const hasTranslationFlag = (): boolean => {
  const urlParams = new URLSearchParams(window.location.search)
  if (urlParams.get('showTranslations') !== 'true') return false;
  return true;
};

export const showTranslations = (language, languageOptions): boolean => {
  return hasTranslationFlag() && !!languageOptions && !!language && Object.keys(languageOptions).length > 1;
};
