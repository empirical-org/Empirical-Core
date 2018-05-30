import React from 'react';
import StudentsClassroom from './students_classroom';
import StudentsClassroomsDropdown from './students_classrooms_dropdown';

const StudentsClassroomsHeader = ({
  classrooms,
  numberOfClassroomTabs,
  selectedClassroomId,
  handleClick,
  hideDropdown,
  toggleDropdown,
  showDropdown,
}) => {
  const classroomTabs = [];
  const classroomList = [];

  if (classrooms && classrooms.length > 0) {
    classrooms.forEach((classroom, index) => {
      if (index < numberOfClassroomTabs) {
        classroomTabs.push(<StudentsClassroom
          key={classroom.id}
          classroom={classroom}
          handleClick={handleClick}
          selectedClassroomId={selectedClassroomId}
        />);
      } else {
        classroomList.push(<li>
          <StudentsClassroom
            key={classroom.id}
            classroom={classroom}
            handleClick={handleClick}
            selectedClassroomId={selectedClassroomId}
          />
        </li>);
      }
    });

    return(
      <div className="tab-subnavigation-wrapper student-subnavigation">
        <div className="container">
          <span className="pull-right student-course-info">
            <div>
              {classroomTabs}
              <StudentsClassroomsDropdown
                classroomList={classroomList}
                hideDropdown={hideDropdown}
                toggleDropdown={toggleDropdown}
                showDropdown={showDropdown}
              />
            </div>
          </span>
        </div>
      </div>
    );
  } else {
    return null;
  }
};

export default StudentsClassroomsHeader;
