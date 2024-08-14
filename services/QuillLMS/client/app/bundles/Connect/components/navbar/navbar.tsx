import * as React from "react";

import { LanguagePicker, TeacherPreviewMenuButton, renderSaveAndExitButton, showTranslations } from '../../../Shared/index';
const quillLogoSrc = `${process.env.CDN_URL}/images/logos/quill-logo-white-2022.svg`;

interface NavBarProps {
  isOnMobile?: boolean;
  isTeacher?: boolean;
  previewShowing?: boolean;
  onTogglePreview?: () => void;
  language: string;
  languageOptions?: any;
  translate: (language: string) => string;
  updateLanguage: (language: string) => void;
}

export const NavBar: React.SFC<NavBarProps> = ({ isOnMobile, isTeacher, previewShowing, onTogglePreview, language, languageOptions, updateLanguage, translate }) => {
  const handleTogglePreview = () => {
    onTogglePreview();
  }

  return (
    <div className="header">
      <div className="activity-navbar-content">
        {isTeacher && !previewShowing && !isOnMobile && <TeacherPreviewMenuButton handleTogglePreview={handleTogglePreview} />}
        <a className="focus-on-dark" href={process.env.DEFAULT_URL}><img alt="Quill logo" src={quillLogoSrc} /></a>
        <div className='header-buttons-container'>
          {showTranslations(language, languageOptions) && <LanguagePicker language={language} languageOptions={languageOptions} updateLanguage={updateLanguage} />}
          {renderSaveAndExitButton({ language, languageOptions, translate })}
        </div>
      </div>
    </div>
  );
};
