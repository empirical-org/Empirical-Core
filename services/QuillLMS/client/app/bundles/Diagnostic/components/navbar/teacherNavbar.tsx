import * as React from "react";
import { connect } from 'react-redux';

import { TeacherPreviewMenuButton, LanguagePicker } from '../../../Shared/index';

const quillLogoSrc = `${process.env.CDN_URL}/images/logos/quill-logo-white-2022.svg`;
const LogoComponent = <a className="focus-on-dark" href={process.env.DEFAULT_URL}><img alt="Quill logo" src={quillLogoSrc} /></a>;

interface TeacherNavbarProps {
  dispatch: (action: any) => void;
  diagnosticID: string;
  isOnMobile: boolean;
  languageMenuOpen: boolean;
  previewShowing?: boolean;
  onTogglePreview?: () => void;
  language: string;
  updateLanguage: (language: string) => void;
}

export const TeacherNavbar = ({
  isOnMobile,
  previewShowing,
  onTogglePreview,
  language,
  updateLanguage
}: TeacherNavbarProps) => {

  function handleTogglePreview() { onTogglePreview() }

  return (
    <div className="header">
      <div className="activity-navbar-content">
        {!previewShowing && !isOnMobile && <TeacherPreviewMenuButton handleTogglePreview={handleTogglePreview} />}
        {LogoComponent}
        <div className="header-buttons-container">
          {language && <LanguagePicker
            language={language}
            updateLanguage={updateLanguage}
          />}
          <a className="quill-button medium contained white focus-on-dark" href={process.env.DEFAULT_URL}>Save and exit</a>
        </div>
      </div>
    </div>
  );
}

function select(state) {
  return {
    diagnosticID: state.playDiagnostic.diagnosticID,
    languageMenuOpen: state.playDiagnostic.languageMenuOpen
  };
}

export default connect(select)(TeacherNavbar);
