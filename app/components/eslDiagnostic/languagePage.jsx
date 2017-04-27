import React from 'react';

export default class LanguagePage extends React.Component {
  constructor() {
    super();
  }

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
          <div className="language-button" onClick={() => this.props.setLanguage('spanish')}><img className="language-button-img" src="https://s3.amazonaws.com/empirical-core-prod/assets/flags/Spain.png" />Español</div>
          {/* <div className="language-button" onClick={() => this.props.setLanguage('chinese')}><img className="language-button-img" src="https://s3.amazonaws.com/empirical-core-prod/assets/flags/China.png" />中文</div> */}
          <div className="language-button" onClick={() => this.props.setLanguage('french')}><img className="language-button-img" src="https://s3.amazonaws.com/empirical-core-prod/assets/flags/France.png" />Français</div>
          <div className="language-button" onClick={() => this.props.setLanguage('vietnamese')}><img className="language-button-img" src="https://s3.amazonaws.com/empirical-core-prod/assets/flags/Vietnam.png" />Tiếng Việt</div>
          <div className="language-button arabic" onClick={() => this.props.setLanguage('arabic')}><img className="language-button-img" src="https://s3.amazonaws.com/empirical-core-prod/assets/flags/Egypt.png" />العربية </div>
          <div className="language-button" onClick={() => this.props.setLanguage('hindi')}><img className="language-button-img" src="https://s3.amazonaws.com/empirical-core-prod/assets/flags/India.png" />हिंदी</div>
        </div>
        <div className="divider" />
        <div className="no-language-button" onClick={() => this.props.setLanguage('english')}><img className="language-button-img" src="https://s3.amazonaws.com/empirical-core-prod/assets/flags/U.S._Outlying_Islands.png" />Only show directions in English</div>
      </div>
    );
  }
}
