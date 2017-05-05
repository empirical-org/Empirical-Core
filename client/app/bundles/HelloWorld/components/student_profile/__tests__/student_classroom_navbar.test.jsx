import React from 'react';
import { shallow } from 'enzyme';

import StudentClassroomNavbar from '../student_classroom_navbar';

import StudentsClassroomsHeader from '../students_classrooms/students_classrooms_header.jsx'

describe('StudentClassroomNavbar component', () => {


  it('should render <StudentsClassroomsHeader /> component with correct props', () => {
    const wrapper = shallow(
      <StudentClassroomNavbar
        data={{
          name: 'Name',
          classroom: { id: 1 },
        }}
        fetchData={'arbitrary'}
        loading={false}
      />
    );
    expect(wrapper.find(StudentsClassroomsHeader).exists()).toBe(true);
    expect(wrapper.find(StudentsClassroomsHeader).props().currentClassroomId).toBe(1);
    expect(wrapper.find(StudentsClassroomsHeader).props().fetchData).toBe('arbitrary');
    expect(wrapper.find(StudentsClassroomsHeader).props().loading).toBe(false);
  });

});
