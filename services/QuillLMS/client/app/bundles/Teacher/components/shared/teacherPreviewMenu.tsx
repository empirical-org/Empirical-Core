import * as React from "react";

export interface TeacherPreviewMenuProps {
  onTogglePreview: () => void;
  showPreview: boolean;
}
 
const TeacherPreviewMenu: React.SFC<TeacherPreviewMenuProps> = ({ onTogglePreview, showPreview }) => {

  const handleToggleMenu = () => {
    onTogglePreview();
  }

  const hiddenStyle = !showPreview ? 'hidden' : '';

  return (
    <div className={`teacher-preview-menu-container ${hiddenStyle}`}>
      <div className="header-container">
        <h1>Menu</h1>
        <button onClick={handleToggleMenu} type="button">x</button>
      </div>
      <section>
        <h2>Preview Mode</h2>
        <p>This menu only displays for teachers previewing an activity. Students will not be able to skip questions.</p>
      </section>
      <section>
        <h2>Activity</h2>
        <p>Although, Since, When (Intermediate) Sem Venenatis Pharetra Justo Fermentum</p>
      </section>
      <section>
        <h2>Introduction</h2>
        <p>joing words</p>
      </section>
      <section>
        <h2>Questions</h2>
        <ul>
          <li>test question 1</li>
          <li>test question 2</li>
          <li>test question 3</li>
        </ul>
      </section>
    </div>
  );
}
 
export default TeacherPreviewMenu;
