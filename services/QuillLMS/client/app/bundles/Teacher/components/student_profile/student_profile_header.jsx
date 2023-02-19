import React from 'react';

const arrowBackSrc = `${import.meta.env.VITE_PROCESS_ENV_CDN_URL}/images/icons/arrow-back.svg`

const StudentProfileHeader = ({ classroomName, teacherName, onClickAllClasses, }) => {
  return (
    <div className="student-profile-header">
      <div className="container">
        <button className="quill-button secondary outlined medium focus-on-light" onClick={onClickAllClasses} type="button">
          <img alt="Back arrow icon" src={arrowBackSrc} />
          All classes
        </button>
        <div>
          <p>Class</p>
          <h4>{classroomName}</h4>
        </div>
        <div className="teacher-section">
          <p>Teacher</p>
          <h4>{teacherName}</h4>
        </div>
      </div>
    </div>
  );
};

export default StudentProfileHeader;
