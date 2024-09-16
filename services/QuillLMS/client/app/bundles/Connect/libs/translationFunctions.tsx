import * as React from 'react'
import { ConceptExplanation } from "../../Shared";

export const getTranslatedData = (key, conceptsFeedback, showTranslation) => {
  return showTranslation && conceptsFeedback?.translated_data ? conceptsFeedback.translated_data[key] : null
}

export const renderExplanation = ({ data, key, conceptsFeedback, showTranslation }) => {
  if (!data) return null;
  const translatedData = getTranslatedData(key, conceptsFeedback, showTranslation);
  return <ConceptExplanation {...data} translatedExplanation={translatedData} />;
};
