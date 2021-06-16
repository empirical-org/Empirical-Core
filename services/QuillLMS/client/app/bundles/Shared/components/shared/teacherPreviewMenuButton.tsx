import * as React from "react";

interface TeacherPreviewMenuButtonProps {
  containerClass?: string,
  handleTogglePreview: () => void
}

export const TeacherPreviewMenuButton = ({ containerClass, handleTogglePreview }: TeacherPreviewMenuButtonProps) => {
  return(
    <div className={containerClass}>
      <button className="quill-button medium secondary outlined focus-on-dark" id="teacher-preview-menu-button" onClick={handleTogglePreview} type="button">Show menu</button>
    </div>
  );
}

export default TeacherPreviewMenuButton;
