import * as React from "react";
import { connect } from 'react-redux';

import { TeacherPreviewMenuButton } from '../../../Shared/index';
import { LanguageOptions } from '../shared/languageOptions';
import { closeLanguageMenu } from '../../actions/diagnostics'

const quillLogoSrc = `${import.meta.env.VITE_PROCESS_ENV_CDN_URL}/images/logos/quill-logo-white-2022.svg`;
const closeSrc = `${import.meta.env.VITE_PROCESS_ENV_CDN_URL}/images/icons/close-white.svg`
const LogoComponent = <a className="focus-on-dark" href={import.meta.env.VITE_DEFAULT_URL}><img alt="Quill logo" src={quillLogoSrc} /></a>;

interface HeaderProps {
  dispatch: (action: any) => void;
  diagnosticID: string;
  isOnMobile: boolean;
  languageMenuOpen: boolean;
  previewShowing?: boolean;
  onTogglePreview?: () => void;
}

export const TeacherNavbar = ({ dispatch, diagnosticID, isOnMobile, languageMenuOpen, previewShowing, onTogglePreview }: HeaderProps) => {

  function handleTogglePreview() { onTogglePreview() }
  function handleClickClose() { dispatch(closeLanguageMenu()) }

  if(!languageMenuOpen) {
    return (
      <div className="header">
        <div className="activity-navbar-content">
          {!previewShowing && !isOnMobile && <TeacherPreviewMenuButton handleTogglePreview={handleTogglePreview} />}
          {LogoComponent}
          <a className="focus-on-dark" href={import.meta.env.VITE_DEFAULT_URL}>Save and exit</a>
        </div>
      </div>
    );
  }
  return (
    <div className="header">
      <div className="activity-navbar-content">
        {LogoComponent}
        <button className="focus-on-dark" onClick={handleClickClose} type="button">
          <img alt="Close icon" src={closeSrc} />
          <span>Close</span>
        </button>
      </div>
      <div className="activity-navbar-content">
        <div className="mobile-student-language-menu">
          <h2>Choose a directions language</h2>
          <LanguageOptions dispatch={dispatch} />
        </div>
      </div>
    </div>
  );
};

function select(state) {
  return {
    diagnosticID: state.playDiagnostic.diagnosticID,
    languageMenuOpen: state.playDiagnostic.languageMenuOpen
  };
}

export default connect(select)(TeacherNavbar);
