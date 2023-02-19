import * as React from "react";

import { TeacherPreviewMenuButton } from '../../../Shared/index';
const quillLogoSrc = `${import.meta.env.VITE_PROCESS_ENV_CDN_URL}/images/logos/quill-logo-white-2022.svg`;

interface NavBarProps {
  isOnMobile?: boolean;
  isTeacher?: boolean;
  previewShowing?: boolean;
  onTogglePreview?: () => void;
}

export const NavBar: React.SFC<NavBarProps> = ({ isOnMobile, isTeacher, previewShowing, onTogglePreview }) => {
  const handleTogglePreview = () => {
    onTogglePreview();
  }
  return (
    <div className="header">
      <div className="activity-navbar-content">
        {isTeacher && !previewShowing && !isOnMobile && <TeacherPreviewMenuButton handleTogglePreview={handleTogglePreview} />}
        <a className="focus-on-dark" href={import.meta.env.DEFAULT_URL}><img alt="Quill logo" src={quillLogoSrc} /></a>
        <a className="focus-on-dark" href={import.meta.env.DEFAULT_URL}>Save and exit</a>
      </div>
    </div>
  );
};
