import * as React from "react";

import { LanguagePicker, TeacherPreviewMenuButton, showTranslations } from '../../Shared/index';
import { DropdownObjectInterface } from "../../Staff/interfaces/evidenceInterfaces";
const quillLogoSrc = `${process.env.CDN_URL}/images/logos/quill-logo-white-2022.svg`;

interface HeaderProps {
  isOnMobile?: boolean;
  isTeacher?: boolean;
  previewShowing?: boolean;
  onTogglePreview?: () => void;
  language?: string;
  languageOptions?: DropdownObjectInterface[]
  updateLanguage?: (language: string) => void;
}

export const Header: React.SFC<HeaderProps> = ({
  isOnMobile,
  isTeacher,
  previewShowing,
  onTogglePreview,
  language,
  languageOptions,
  updateLanguage
}) => {

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
          <a className="quill-button medium contained white focus-on-dark" href={process.env.DEFAULT_URL}>Save and exit</a>
        </div>
      </div>
    </div>
  );
};
