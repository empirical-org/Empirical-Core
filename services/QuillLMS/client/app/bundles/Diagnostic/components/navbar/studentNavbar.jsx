import React from 'react';
import { connect } from 'react-redux';

import { closeLanguageMenu } from '../../actions/diagnostics';
import { LanguageOptions } from '../shared/languageOptions';

const quillLogoSrc = `${import.meta.env.VITE_PROCESS_ENV_CDN_URL}/images/logos/quill-logo-white-2022.svg`
const closeSrc = `${import.meta.env.VITE_PROCESS_ENV_CDN_URL}/images/icons/close-white.svg`

const handleSaveAndExitClick = () => {
  window.location.assign(`${import.meta.env.VITE_DEFAULT_URL}/profile`);
}

const Links = ({ playDiagnostic, dispatch, }) => {
  const { languageMenuOpen, diagnosticID, } = playDiagnostic
  const handleClickClose = () => dispatch(closeLanguageMenu())

  if (!languageMenuOpen) {
    return (
      <div className="student-nav-section">
        <button activeClassName="is-active" className="student-nav-item focus-on-dark" key="a-tag-student-navabar" onClick={handleSaveAndExitClick} tabIndex="0" type="button">Save and exit</button>
      </div>
    )
  }

  return (
    <div className="student-nav-section">
      <button className="student-nav-item focus-on-dark close-language-menu" onClick={handleClickClose} type="button">
        <img alt="Close icon" src={closeSrc} />
        <span>Close</span>
      </button>
      <div className="mobile-student-language-menu">
        <h2>Choose a directions language</h2>
        <LanguageOptions dispatch={dispatch} />
      </div>
    </div>
  );
};

export const StudentNavbar = ({ playDiagnostic, dispatch, }) => {
  return(
    <header className='nav student-nav'>
      <div className="container">
        <div className="student-nav-section">
          <a aria-label="Quill" className="student-nav-item focus-on-dark" href={`${import.meta.env.VITE_DEFAULT_URL}`} tabIndex="0">
            <img
              alt="Quill.org logo"
              src={quillLogoSrc}
            />
          </a>
        </div>
        <Links dispatch={dispatch} playDiagnostic={playDiagnostic} />
      </div>
    </header>
  );
};

function select(state) {
  return {
    playDiagnostic: state.playDiagnostic
  };
}

export default connect(select)(StudentNavbar);
