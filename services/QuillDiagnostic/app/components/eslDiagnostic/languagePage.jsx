import React from 'react';

export default class LanguagePage extends React.Component {

  handleClickLanguage = (language) => {
    const { setLanguage, } = this.props
    setLanguage(language)
  }

  handleClickSpanish = () => this.handleClickLanguage('spanish')

  handleClickChinese = () => this.handleClickLanguage('chinese')

  handleClickFrench = () => this.handleClickLanguage('french')

  handleClickVietnamese = () => this.handleClickLanguage('vietnamese')

  handleClickArabic = () => this.handleClickLanguage('arabic')

  handleClickHindi = () => this.handleClickLanguage('hindi')

  handleClickEnglish = () => this.handleClickLanguage('english')

  render() {
    return (
      <div className="language-page">
        <div className="introductory-text">
          <p>Hello there! You are about to start a 22 question placement activity. First, let’s set up your language preference.</p>
          <p>All the directions are in:</p>
          <div className="default-language"><img src="https://s3.amazonaws.com/empirical-core-prod/assets/flags/U.S._Outlying_Islands.png" /><span>English</span> (Default)</div>
          <p>and I want <span>additional</span> directions in:</p>
        </div>
        <div className="language-button-container">
          <button className="language-button" onClick={this.handleClickSpanish} type="button"><img className="language-button-img" src="https://s3.amazonaws.com/empirical-core-prod/assets/flags/Spain.png" />Español</button>
          <button className="language-button" onClick={this.handleClickChinese} type="button"><img className="language-button-img" src="https://s3.amazonaws.com/empirical-core-prod/assets/flags/China.png" />中文</button>
          <button className="language-button" onClick={this.handleClickFrench} type="button"><img className="language-button-img" src="https://s3.amazonaws.com/empirical-core-prod/assets/flags/France.png" />Français</button>
          <button className="language-button" onClick={this.handleClickVietnamese} type="button"><img className="language-button-img" src="https://s3.amazonaws.com/empirical-core-prod/assets/flags/Vietnam.png" />Tiếng Việt</button>
          <button className="language-button arabic" onClick={this.handleClickArabic} type="button"><img className="language-button-img" src="https://s3.amazonaws.com/empirical-core-prod/assets/flags/Egypt.png" />العربية </button>
          <button className="language-button" onClick={this.handleClickHindi} type="button"><img className="language-button-img" src="https://s3.amazonaws.com/empirical-core-prod/assets/flags/India.png" />हिंदी</button>
        </div>
        <div className="divider" />
        <button className="no-language-button fullsize" onClick={this.handleClickEnglish} type="button"><img className="language-button-img" src="https://s3.amazonaws.com/empirical-core-prod/assets/flags/U.S._Outlying_Islands.png" />Only show directions in English</button>
        <button className="no-language-button mobile" onClick={this.handleClickEnglish} type="button"><img className="language-button-img" src="https://s3.amazonaws.com/empirical-core-prod/assets/flags/U.S._Outlying_Islands.png" />Only English</button>
      </div>
    );
  }
}
