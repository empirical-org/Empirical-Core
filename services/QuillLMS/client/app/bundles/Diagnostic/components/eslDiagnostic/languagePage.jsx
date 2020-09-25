import React from 'react';

import { ENGLISH, languages, languagesV2, languageData, languageDataV2 } from '../../modules/translation/languagePageInfo';
import { TrackAnalyticsEvent} from '../../actions/analytics'
import { Events } from '../../modules/analytics'

export class LanguagePage extends React.Component {

  handleClickLanguage = (e) => {
    const language = e.currentTarget.value;
    const { diagnosticID, dispatch, setLanguage, } = this.props;
    if(language !== ENGLISH && diagnosticID !== 'ell') {
      dispatch(TrackAnalyticsEvent(Events.DIAGNOSTIC_LANGUAGE_SELECTED, { language }));
    }
    setLanguage(language);
  }

  render() {
    const { diagnosticID } = this.props;
    // once we remove the original ELL Diagnostic, we can move to have only have the second versions
    let langs = diagnosticID === 'ell' ? languages : languagesV2;
    let langData = diagnosticID === 'ell' ? languageData : languageDataV2;
    return (
      <div className="language-page">
        <div className="introductory-text">
          <p>Hello there! You are about to start a 22 question placement activity.</p>
          <p>First, let’s set up your language preference. All the directions are in English by default.</p>
          <p>Show directions in English only.</p>
        </div>
        <div className="language-button-container english">
          <button className="language-button" onClick={this.handleClickLanguage} type="button" value="english">
            <img alt="flag" className="language-button-img" src={langData[ENGLISH].flag} />
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
          {langs.map(language => {
            if(language !== ENGLISH) {
              return(
                <button className="language-button" key={`${language}-button`} onClick={this.handleClickLanguage} type="button" value={language}>
                  <img alt="flag" className="language-button-img" src={langData[language].flag} />
                  <p className="language-label">{langData[language].label}</p>
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
