import React from 'react';
import { withNamespaces } from 'react-i18next';
import { languages, languageData } from '../../../public/locales/languagePageInfo';

export class LanguagePage extends React.Component {

  handleClickLanguage = (e) => {
    const language = e.currentTarget.value;
    const { setLanguage, } = this.props;
    setLanguage(language)
  }

  render() {
    return (
      <div className="language-page">
        <div className="introductory-text">
          <p>Hello there! You are about to start a 21 question placement activity.</p>
          <p>First, let’s set up your language preference. All the directions are in English by default.</p>
          <p>Show directions only in:</p>
        </div>
        <div className="language-button-container english">
          <button className="language-button" onClick={this.handleClickLanguage} type="button" value="english">
            <img alt="flag" className="language-button-img" src='https://s3.amazonaws.com/empirical-core-prod/assets/flags/U.S._Outlying_Islands.png' />
            <p className="language-label">English</p>
          </button>
        </div>
        <div className="divider-container">
          <div className="divider" />
          <p className="divider-label">or</p>
          <div className="divider" />
        </div>
        <div className="introductory-text">
          <p>Show directions in English <span>and</span>:</p>
        </div>
        <div className="language-button-container">
          {languages.map(language => {
            return(
              <button className="language-button" key={`${language}-button`} onClick={this.handleClickLanguage} type="button" value={language}>
                <img alt="flag" className="language-button-img" src={languageData[language].flag} />
                <p className="language-label">{languageData[language].label}</p>
              </button>
            );
          })}
        </div>
      </div>
    );
  }
}

export default withNamespaces()(LanguagePage);
