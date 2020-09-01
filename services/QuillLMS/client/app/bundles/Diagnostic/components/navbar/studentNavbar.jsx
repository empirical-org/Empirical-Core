import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { closeLanguageMenu, updateLanguage, } from '../../actions/diagnostics'
import { languages, languagesV2, languageData, languageDataV2 } from '../../modules/translation/languagePageInfo';
import i18n from '../../i18n';

const quillLogoSrc = `${process.env.CDN_URL}/images/logos/quill-logo-white.svg`
const closeSrc = `${process.env.CDN_URL}/images/icons/close-white.svg`

const handleSaveAndExitClick = () => {
  window.location.assign(`${process.env.DEFAULT_URL}/profile`);
}

const languageOptions = ({ diagnosticID, dispatch, }) => {
  // once we remove the original ELL Diagnostic, we can move to have only have the second versions
  let langs = diagnosticID === 'ell' ? languages : languagesV2;
  let langData = diagnosticID === 'ell' ? languageData : languageDataV2;

  const handleClickLanguage = (e) => {
    const language = e.currentTarget.value;
    i18n.changeLanguage(language);
    dispatch(updateLanguage(language));
    dispatch(closeLanguageMenu())
  }

  return langs.map(language => {
    return(
      <button className="language-button" key={`${language}-button`} onClick={handleClickLanguage} type="button" value={language}>
        <img alt={`${language} flag`} src={langData[language].flag} />
        <span>{langData[language].label}</span>
      </button>
    );
  })
}

const renderLinks = ({ playDiagnostic, dispatch, }) => {
  const { languageMenuOpen, diagnosticID, } = playDiagnostic
  const handleClickClose = () => dispatch(closeLanguageMenu())

  if (!languageMenuOpen) {
    return (
      <div className="student-nav-section">
        <button activeClassName="is-active" className="student-nav-item focus-on-dark" key="a-tag-student-navabar" onClick={handleSaveAndExitClick} tabIndex="0" type="button">Save and exit</button>
      </div>
    )
  }

  return (<div className="student-nav-section">
    <button className="student-nav-item focus-on-dark close-language-menu" onClick={handleClickClose} type="button">
      <img alt="Close icon" src={closeSrc} />
      <span>Close</span>
    </button>
    <div className="mobile-student-language-menu">
      <h2>Choose a directions language</h2>
      {languageOptions({ dispatch, diagnosticID, })}
    </div>
  </div>)
};

export const StudentNavbar = ({ playDiagnostic, dispatch, }) => (
  <header className='nav student-nav'>
    <div className="container">
      <div className="student-nav-section">
        <a aria-label="Quill" className="student-nav-item focus-on-dark" href={`${process.env.DEFAULT_URL}`} tabIndex="0">
          <img
            alt="Quill.org logo"
            src={quillLogoSrc}
          />
        </a>
      </div>
      {renderLinks({playDiagnostic, dispatch, })}
    </div>
  </header>
);

function select(state) {
  return {
    playDiagnostic: state.playDiagnostic
  };
}

export default connect(select)(StudentNavbar);
