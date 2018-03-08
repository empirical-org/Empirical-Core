import React from 'react';

const StudentsClassroom = ({
  classroom,
  selectedClassroomId,
  handleClick
}) => {
  const isSelected = (classroom, selectedClassroomId) => {
    let selected = selectedClassroomId || classroom.id;

    if (selected && classroom.id == selected.toString()) {
      return 'active';
    }
  };

  return (
    <div
      className={`${isSelected(classroom, selectedClassroomId)} classroom-box`}
      onClick={() => handleClick(classroom.id)}
    >
      <div>{classroom.teacher}</div>
      <div className="classroom-box-classroom">{classroom.name}</div>
    </div>
  );
};

export default StudentsClassroom;
