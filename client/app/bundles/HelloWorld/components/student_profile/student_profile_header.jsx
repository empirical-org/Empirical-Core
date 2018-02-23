import React from 'react'
import createReactClass from 'create-react-class';

const StudentProfileHeader = ({ classroomName, teacherName, studentName, }) => {
  return (
    <div className="container student-profile-header">
      <div className="header">
        <span>
          {classroomName} | {teacherName}
        </span>
        <span>
          {studentName}
        </span>
      </div>
      <div className="dividing-line" />
    </div>
  );
};

export default StudentProfileHeader;
