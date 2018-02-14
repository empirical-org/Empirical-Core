import React from 'react';

const StudentsClassroom = ({ classroom, selectedClassroomId, index, handleClick }) => {
  const isSelected = (classroom, selectedClassroomId, index) => {
    let selected = selectedClassroomId || classroom.id;

    if (selected && classroom.id == selected.toString()) {
      return 'active';
    }
  };

  return (
    <div
      className={`${isSelected(classroom, selectedClassroomId, index)} classroom-box`}
      key={classroom.id}
      onClick={() => handleClick(classroom.id)}
    >
      <div>{classroom.teacher}</div>
      <div className="classroom-box-classroom">{classroom.name}</div>
    </div>
  );
};

export default StudentsClassroom;
