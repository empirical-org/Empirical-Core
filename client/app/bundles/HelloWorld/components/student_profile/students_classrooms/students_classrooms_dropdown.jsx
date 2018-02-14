import React from 'react';
import StudentsClassroom from './students_classroom';
import Pluralize from 'pluralize';

const dropdownContents = (classroomList, showDropdown) => {
  if (showDropdown) {
    return classroomList;
  }

  return null;
};

const StudentsClassroomsDropdown = ({ hideDropdownBoxes, toggleDropdown, showDropdown, classroomList }) => {
  const carrotDirection = showDropdown ? 'down' : 'up';
  const carrotClass = `fa fa-angle-${carrotDirection}`
  const dropdownButtonText = `${classroomList.length} More ${Pluralize('Class', classroomList.length)}`;

  if (classroomList.length > 0) {
    return (
      <div className="classroom-box dropdown-tab" onClick={toggleDropdown} tabIndex="0" onBlur={hideDropdownBoxes}>
        <p>
          {dropdownButtonText}
          <i className={carrotClass} />
        </p>
        <ul className="dropdown-classrooms">
          {dropdownContents(classroomList, showDropdown)}
        </ul>
      </div>
    );
  } else {
    return null;
  }
};

export default StudentsClassroomsDropdown;
