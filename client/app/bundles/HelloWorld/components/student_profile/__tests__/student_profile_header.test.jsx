import React from 'react';
import { shallow } from 'enzyme';

import StudentProfileHeader from '../student_profile_header';

import StudentsClassroomsHeader from '../students_classrooms/students_classrooms_header.jsx'

describe('StudentProfileHeader component', () => {

  it('should render name', () => {
    const wrapper = shallow(
      <StudentProfileHeader
        data={{
          name: 'Name',
          classroom: { id: 1 },
        }}
        fetchData={() => null}
        loading={false}
      />
    );
    expect(wrapper.find('.section-header').text()).toBe('Name');
  });

  it('should render <StudentsClassroomsHeader /> component with correct props', () => {
    const wrapper = shallow(
      <StudentProfileHeader
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
