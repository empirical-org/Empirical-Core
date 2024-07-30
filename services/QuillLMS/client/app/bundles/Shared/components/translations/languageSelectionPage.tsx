import React from 'react';

import { defaultLanguageOptions, ENGLISH } from '../../utils/languageList';
import { TrackAnalyticsEvent } from '../../../Diagnostic/actions/analytics';
import { Events } from '../../../Diagnostic/modules/analytics';

interface LanguageSelectionPageProps {
  questionCount?: number,
  dispatch: (any) => void,
  setLanguage: (language: string) => void,
  previewMode: boolean,
  begin: () => void,
  languages: string[]
}

export const LanguageSelectionPage = ({
  questionCount,
  dispatch,
  setLanguage,
  previewMode,
  begin,
  languages
}: LanguageSelectionPageProps) => {

  function handleClickLanguage (e) {
    const language = e.currentTarget.value;
    const isDiagnosticActivity = window.location.href.includes('diagnostic')
    if (isDiagnosticActivity && language !== ENGLISH) {
      dispatch(TrackAnalyticsEvent(Events.DIAGNOSTIC_LANGUAGE_SELECTED, { language }));
    }
    setLanguage(language);
    if (previewMode) {
      begin();
    }
  }
  return (
    <div className="language-page">
      <div className="introductory-text">
        {questionCount && <p>{`Hello there! You are about to start a ${questionCount} question placement activity.`}</p>}
        <p>First, let's set up your language preference. All the directions are in English by default.</p>
        <p>Show directions in English only.</p>
      </div>
      <div className="language-button-container english">
        <button className="language-button" onClick={handleClickLanguage} type="button" value="english">
          <img alt="flag" className="language-button-img" src={defaultLanguageOptions[ENGLISH].flag} />
          <p className="language-label">English</p>
        </button>
      </div>
      <div className="divider-container">
        <div className="divider" />
        <p className="divider-label">or</p>
        <div className="divider" />
      </div>
      <div className="introductory-text">
        <p>Show directions in English <span>and</span> another language.</p>
      </div>
      <div className="language-button-container">
        {languages.map(language => {
          if (language !== ENGLISH) {
            return (
              <button className="language-button" key={`${language}-button`} onClick={handleClickLanguage} type="button" value={language}>
                <img alt="flag" className="language-button-img" src={defaultLanguageOptions[language].flag} />
                <p className="language-label">{defaultLanguageOptions[language].label}</p>
              </button>
            );
          }
        })}
      </div>
    </div>
  );
}

export default LanguageSelectionPage;
