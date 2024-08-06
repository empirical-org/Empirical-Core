import * as React from 'react';
import { ENGLISH } from '../../utils/languageList'

export const getlanguageOptions = (translations) => ([
  { value: ENGLISH, label: ENGLISH },
  ...Object.keys(translations).map(language => ({
    value: language,
    label: language
  }))
]);

export function renderSaveAndExitButton({ language, languageOptions, translate }) {
  const languages = languageOptions && languageOptions.map(option => option.value)
  let buttonText = 'Save and exit'
  if (language && languages && languages.includes(language)) {
    buttonText = translate('buttons^save and exit')
  }
  return <a className="quill-button medium contained white focus-on-dark" href={ process.env.DEFAULT_URL}>{buttonText}</a>
}

// Temporary feature flag until we are ready to ship this.
export const hasTranslationFlag = (): boolean => {
  const urlParams = new URLSearchParams(window.location.search)
  if (urlParams.get('showTranslations') !== 'true') return false;
  return true;
};

export const showTranslations = (language, languageOptions): boolean => {
  return hasTranslationFlag() && !!languageOptions && !!language && Object.keys(languageOptions).length > 1;
};
