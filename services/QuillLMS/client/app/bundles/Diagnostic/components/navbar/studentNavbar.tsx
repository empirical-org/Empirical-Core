import React from 'react';
import { connect } from 'react-redux';
import { LanguagePicker, renderSaveAndExitButton } from '../../../Shared';
import { DropdownObjectInterface } from '../../../Staff/interfaces/evidenceInterfaces';

const quillLogoSrc = `${process.env.CDN_URL}/images/logos/quill-logo-white-2022.svg`

interface StudentNavbarProps {
  isELLDiagnostic: boolean;
  language?: string;
  updateLanguage?: (language: string) => void;
  translate?: (language: string) => string;
  languageOptions?: DropdownObjectInterface[];
}

export const StudentNavbar = ({ language, updateLanguage, translate, isELLDiagnostic }: StudentNavbarProps) => {
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
          {renderSaveAndExitButton({ language, translate, isELLDiagnostic })}
        </div>
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
