import React from 'react';
import { shallow, mount } from 'enzyme';

import StudentsClassroomsDropdown from '../students_classrooms_dropdown';

describe('StudentsClassroomsDropdown', () => {
  it('can show the classroom list', () => {
    const wrapper = shallow(
      <StudentsClassroomsDropdown
        classroomList={[<li key={1}>Classroom</li>]}
        showDropdown={true}
      />
    );

    expect(wrapper.find('li').length).toBe(1);
  });

  it('can hide the classroom list', () => {
    const wrapper = shallow(
      <StudentsClassroomsDropdown
        classroomList={[<li key={1}>Classroom</li>]}
        showDropdown={false}
      />
    );

    expect(wrapper.find('li').length).toBe(0);
  });

  it('displays the closed carrot icon', () => {
    const wrapper = shallow(
      <StudentsClassroomsDropdown
        classroomList={[<li key={1}>Classroom</li>]}
        showDropdown={true}
      />
    );

    expect(wrapper.find('i').prop('className')).toBe('fa fa-angle-down');
  });

  it('displays the closed carrot icon', () => {
    const wrapper = shallow(
      <StudentsClassroomsDropdown
        classroomList={[<li key={1}>Classroom</li>]}
        showDropdown={false}
      />
    );

    expect(wrapper.find('i').prop('className')).toBe('fa fa-angle-up');
  });

  it('displays the number of classes in the dropdown button', () => {
    const classroomList = [<li key={1}>Classroom</li>, <li key={2}>Classroom</li>]
    const wrapper = shallow(
      <StudentsClassroomsDropdown
        classroomList={classroomList}
        showDropdown={false}
      />
    );

    expect(wrapper.find('p').text()).toBe('2 More Classes');
  })
});
