import React from 'react';
import StudentsClassroom from './students_classroom';
import StudentsClassroomsDropdown from './students_classrooms_dropdown'

const StudentsClassroomsTabs = ({ classrooms, numberOfClassroomTabs, selectedClassroomId, handleClick, hideDropdownBoxes, toggleDropdown, showDropdown }) => {
  const classroomTabs = [];
  const classroomList = []

  if (classrooms) {

    classrooms.forEach((classroom, index) => {
      if (index < numberOfClassroomTabs) {
        classroomTabs.push(
          <StudentsClassroom
            classroom={classroom}
            index={index}
            handleClick={handleClick}
            selectedClassroomId={selectedClassroomId}
          />
        );
      } else {
        classroomList.push(
          <li>
            <StudentsClassroom
              classroom={classroom}
              index={index}
              handleClick={handleClick}
              selectedClassroomId={selectedClassroomId}
            />
          </li>
        );
      }
    });

    return(
      <div>
        {classroomTabs}
        <StudentsClassroomsDropdown
          classroomList={classroomList}
          hideDropdownBoxes={hideDropdownBoxes}
          toggleDropdown={toggleDropdown}
          showDropdown={showDropdown}
        />
      </div>
    );
  } else {
    return null;
  }
};

export default StudentsClassroomsTabs;
