import React from 'react';
import { shallow, mount } from 'enzyme';

import StudentsClassroomsHeader from '../students_classrooms_header';
import StudentsClassroom from '../students_classroom';
import StudentsClassroomsDropdown from '../students_classrooms_dropdown';


const fiveClassrooms = [
  {id: 1, teacher: 'Mr. Novas', name: 'Class'},
  {id: 2, teacher: 'Mr. McKendrick', name: 'Other Class'},
  {id: 3, teacher: 'Mr. Gault', name: 'Other Other Class'},
  {id: 4, teacher: 'Mr. Thameen', name: 'Other Other Other Class'},
  {id: 5, teacher: 'Ms. Monk', name: 'Other Other Other Other Class'},
]

describe('StudentsClassroomsHeader', () => {

  it('renders the number of specified classroom tabs', () => {
    const wrapper = shallow(
      <StudentsClassroomsHeader
        classrooms={fiveClassrooms}
        numberOfClassroomTabs={3}
      />
    );

    expect(wrapper.find(StudentsClassroom).length).toBe(3);
  });

  it('passes correct props to the rendered classroom tabs', () => {
    const handleClick = () => {};
    const wrapper = shallow(
      <StudentsClassroomsHeader
        classrooms={fiveClassrooms}
        numberOfClassroomTabs={3}
        handleClick={handleClick}
        selectedClassroomId={5}
      />
    );

    expect(wrapper.find(StudentsClassroom).first().props()).toEqual({
      classroom: fiveClassrooms[0],
      handleClick: handleClick,
      selectedClassroomId: 5,
    });
  });

  it('passes the excess classrooms to the dropdown', () => {
    const wrapper = shallow(
      <StudentsClassroomsHeader
        classrooms={fiveClassrooms}
        numberOfClassroomTabs={3}
      />
    );

    const dropdown = wrapper.find(StudentsClassroomsDropdown)
    expect(dropdown.props().classroomList.length).toBe(2);
  });

  it('passes correct props to the classrooms in the dropdown', () => {
    const handleClick = () => {};
    const wrapper = shallow(
      <StudentsClassroomsHeader
        classrooms={fiveClassrooms}
        numberOfClassroomTabs={3}
        handleClick={handleClick}
        selectedClassroomId={5}
      />
    );

    const dropdown = wrapper.find(StudentsClassroomsDropdown);
    expect(dropdown.props().classroomList[0].props.children.props).toEqual({
      classroom: fiveClassrooms[3],
      handleClick: handleClick,
      selectedClassroomId: 5,
    });
  });
});
