import React, { Component } from 'react';
import { connect } from 'react-redux';
import { updateLanguage } from '../../actions/diagnostics.js';

const languageFlagMap = {
  english: 'https://s3.amazonaws.com/empirical-core-prod/assets/flags/U.S._Outlying_Islands.png',
  spanish: 'https://s3.amazonaws.com/empirical-core-prod/assets/flags/Spain.png',
  chinese: 'https://s3.amazonaws.com/empirical-core-prod/assets/flags/China.png',
  french: 'https://s3.amazonaws.com/empirical-core-prod/assets/flags/France.png',
  vietnamese: 'https://s3.amazonaws.com/empirical-core-prod/assets/flags/Vietnam.png',
  arabic: 'https://s3.amazonaws.com/empirical-core-prod/assets/flags/Egypt.png',
  hindi: 'https://s3.amazonaws.com/empirical-core-prod/assets/flags/India.png',
};

const languageDisplayNameMap = {
  english: 'English',
  spanish: 'Español',
  chinese: '中文',
  french: 'Français',
  vietnamese: 'Tiếng Việt',
  arabic: 'العربية',
  hindi: 'हिंद',
};

class LanguageSelector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdownOpen: false,
    };
    this.toggleDropdown = this.toggleDropdown.bind(this);
    this.hideDropdown = this.hideDropdown.bind(this);
  }

  updateLanguage(language) {
    this.setState({ dropdownOpen: false, }, () => this.props.dispatch(updateLanguage(language)));
  }

  arrowClass() {
    return this.state.dropdownOpen ? 'arrow-up' : 'arrow-down';
  }

  renderDropdown() {
    if (this.state.dropdownOpen) {
      return (
        <ul className="nav-language-selector-dropdown">
          <li onClick={() => this.updateLanguage('english')}><img className="language-button-img" src={languageFlagMap.english} />English</li>
          <li onClick={() => this.updateLanguage('spanish')}><img className="language-button-img" src={languageFlagMap.spanish} />Español</li>
          <li onClick={() => this.updateLanguage('chinese')}><img className="language-button-img" src={languageFlagMap.chinese} />中文</li>
          <li onClick={() => this.updateLanguage('french')}><img className="language-button-img" src={languageFlagMap.french} />Français</li>
          <li onClick={() => this.updateLanguage('vietnamese')}><img className="language-button-img" src={languageFlagMap.vietnamese} />Tiếng Việt</li>
          <li onClick={() => this.updateLanguage('arabic')}><img className="language-button-img" src={languageFlagMap.arabic} />العربية</li>
          <li onClick={() => this.updateLanguage('hindi')}><img className="language-button-img" src={languageFlagMap.hindi} />हिंद</li>
        </ul>
      );
    }
  }

  toggleDropdown() {
    this.setState({ dropdownOpen: !this.state.dropdownOpen, }, console.log(this.state.dropdownOpen));
  }

  hideDropdown() {
    this.setState({ dropdownOpen: false })
  }

  render() {
    if (this.props.playDiagnostic.language) {
      return (
        <div className="nav-language-selector-container">
          <div className="nav-language-selector-directions">Directions in:</div>
          <div className="nav-language-selector" tabIndex="0" onBlur={this.hideDropdown}>
            <div className="nav-language-selector-trigger" name="language" value={this.props.playDiagnostic.language} onClick={this.toggleDropdown}>
              <img className="language-button-img" src={languageFlagMap[this.props.playDiagnostic.language]} />
              <div className="language-button-text">{languageDisplayNameMap[this.props.playDiagnostic.language] || 'Languages'} </div>
              <div className={this.arrowClass()} />
            </div>
            {this.renderDropdown()}
          </div>
        </div>

      );
    } else {
      return (
        <div />
      );
    }
  }
}

function select(props) {
  return {
    playDiagnostic: props.playDiagnostic,
  };
}

export default connect(select)(LanguageSelector);
