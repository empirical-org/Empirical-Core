import * as React from 'react';
import { ENGLISH } from '../../utils/languageList'
import { ConceptExplanation } from '../../components/feedback/conceptExplanation';
import { defaultLanguages } from '../../utils/languageList.js'

export const getlanguageOptions = (translations) => ([
  { value: ENGLISH, label: ENGLISH },
  ...Object.keys(translations).map(language => ({
    value: language,
    label: language
  }))
]);

interface renderSaveAndExitArguments {
  isELLDiagnostic: boolean,
  language: string,
  languageOptions?: { label: string, value: string }[],
  translate: (language: string) => string
}

export function renderSaveAndExitButton({ isELLDiagnostic, language, languageOptions, translate }: renderSaveAndExitArguments) {
  const languages = isELLDiagnostic ? defaultLanguages : languageOptions?.map(option => option.value)
  let buttonText = 'Save and exit'
  if (language && language !== ENGLISH && languages && languages.includes(language)) {
    buttonText = translate('buttons^save and exit')
  }
  return <a className="quill-button medium contained white focus-on-dark" href={`${process.env.DEFAULT_URL}/profile`}>{buttonText}</a>
}

export const showTranslations = (language, languageOptions): boolean => {
  return !!languageOptions && !!language && Object.keys(languageOptions).length > 1;
};

const getTranslatedConceptsFeedbackData = (key, conceptsFeedback, showTranslation) => {
  return showTranslation && conceptsFeedback?.translated_data ? conceptsFeedback.translated_data[key] : null
}

export const renderExplanation = ({ data, key, conceptsFeedback, showTranslation }) => {
  if (!data) return null;
  const translatedData = getTranslatedConceptsFeedbackData(key, conceptsFeedback, showTranslation);
  return <ConceptExplanation {...data} translatedExplanation={translatedData} />;
};
