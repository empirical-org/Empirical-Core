import React from 'react';
import { connect } from 'react-redux';
import { LanguagePicker } from '../../../Shared';

const quillLogoSrc = `${process.env.CDN_URL}/images/logos/quill-logo-white-2022.svg`

interface StudentNavbarProps {
  language: string;
  updateLanguage: (language: string) => void;
}

export const StudentNavbar = ({ language, updateLanguage }: StudentNavbarProps) => {
  return(
    <header className='nav student-nav'>
      <div className="container">
        <div className="student-nav-section">
          <a aria-label="Quill" className="student-nav-item focus-on-dark" href={`${process.env.DEFAULT_URL}`} tabIndex={0}>
            <img
              alt="Quill.org logo"
              src={quillLogoSrc}
            />
          </a>
        </div>
        <div className="header-buttons-container">
          {language && <LanguagePicker
            language={language}
            updateLanguage={updateLanguage}
          />}
          <a className="quill-button medium contained white focus-on-dark" href={`${process.env.DEFAULT_URL}/profile`}>Save and exit</a>        </div>
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
