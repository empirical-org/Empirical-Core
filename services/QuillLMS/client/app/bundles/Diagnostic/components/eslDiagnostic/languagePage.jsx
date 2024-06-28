import React from 'react';

import { TrackAnalyticsEvent } from '../../actions/analytics';
import { Events } from '../../modules/analytics';
import { ENGLISH, languages, languageOptions } from '../../../Shared/utils/languageList';

export class LanguagePage extends React.Component {

  handleClickLanguage = (e) => {
    const language = e.currentTarget.value;
    const { dispatch, setLanguage, previewMode, begin } = this.props;
    if(language !== ENGLISH) {
      dispatch(TrackAnalyticsEvent(Events.DIAGNOSTIC_LANGUAGE_SELECTED, { language }));
    }
    setLanguage(language);
    if(previewMode) {
      begin();
    }
  }

  render() {
    const { questionCount } = this.props;
    return (
      <div className="language-page">
        <div className="introductory-text">
          <p>{`Hello there! You are about to start a ${questionCount} question placement activity.`}</p>
          <p>First, let’s set up your language preference. All the directions are in English by default.</p>
          <p>Show directions in English only.</p>
        </div>
        <div className="language-button-container english">
          <button className="language-button" onClick={this.handleClickLanguage} type="button" value="english">
            <img alt="flag" className="language-button-img" src={languageOptions[ENGLISH].flag} />
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
            if(language !== ENGLISH) {
              return(
                <button className="language-button" key={`${language}-button`} onClick={this.handleClickLanguage} type="button" value={language}>
                  <img alt="flag" className="language-button-img" src={languageOptions[language].flag} />
                  <p className="language-label">{languageOptions[language].label}</p>
                </button>
              );
            }
          })}
        </div>
      </div>
    );
  }
}

export default LanguagePage;
