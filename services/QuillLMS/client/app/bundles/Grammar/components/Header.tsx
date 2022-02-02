import * as React from "react";

import { TeacherPreviewMenuButton } from '../../Shared/index';
const quillLogoSrc = `${process.env.CDN_URL}/images/logos/quill-logo-white.svg`;

interface HeaderProps {
  isOnMobile?: boolean;
  isTeacher?: boolean;
  previewShowing?: boolean;
  onTogglePreview?: () => void;
}

export const Header: React.SFC<HeaderProps> = ({ isOnMobile, isTeacher, previewShowing, onTogglePreview }) => {
  const handleTogglePreview = () => {
    onTogglePreview();
  }
  return (
    <div className="header">
      <div className="activity-navbar-content">
        {isTeacher && !previewShowing && !isOnMobile && <TeacherPreviewMenuButton handleTogglePreview={handleTogglePreview} />}
        <a className="focus-on-dark" href={process.env.DEFAULT_URL}><img alt="Quill logo" src={quillLogoSrc} /></a>
        <a className="focus-on-dark" href={process.env.DEFAULT_URL}>Save and exit</a>
      </div>
    </div>
  );
};
