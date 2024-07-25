import * as React from "react";

import { LanguagePicker, TeacherPreviewMenuButton } from '../../../Shared/index';
const quillLogoSrc = `${process.env.CDN_URL}/images/logos/quill-logo-white-2022.svg`;

interface NavBarProps {
  isOnMobile?: boolean;
  isTeacher?: boolean;
  previewShowing?: boolean;
  onTogglePreview?: () => void;
  language: string;
  languageOptions?: any;
  updateLanguage: (language: string) => void;
}


export const NavBar: React.SFC<NavBarProps> = ({ isOnMobile, isTeacher, previewShowing, onTogglePreview, language, languageOptions, updateLanguage }) => {
  const handleTogglePreview = () => {
    onTogglePreview();
  }

  // Temporary feature flag until we are ready to ship this.
  const urlParams = new URLSearchParams(window.location.search)
  const showTranslations = urlParams.get('showTranslations') === 'true'
  return (
    <div className="header">
      <div className="activity-navbar-content">
        {isTeacher && !previewShowing && !isOnMobile && <TeacherPreviewMenuButton handleTogglePreview={handleTogglePreview} />}
        <a className="focus-on-dark" href={process.env.DEFAULT_URL}><img alt="Quill logo" src={quillLogoSrc} /></a>
        <div className='header-buttons-container'>
          {showTranslations && <LanguagePicker language={language} languageOptions={languageOptions} updateLanguage={updateLanguage}/>}
          <a className="quill-button medium contained white focus-on-dark" href={process.env.DEFAULT_URL}>Save and exit</a>
        </div>
      </div>
    </div>
  );
};
