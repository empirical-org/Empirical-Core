import React from 'react';
import { shallow, mount } from 'enzyme';

import StudentsClassroom from '../students_classroom';

describe('StudentsClassroom', () => {
  it('displays the classroom information', () => {
    const classroom = { teacher: 'Mr. Magoo', name: 'Hard Knocks', };

    const wrapper = shallow(
      <StudentsClassroom
        classroom={classroom}
      />
    );

    expect(wrapper.text()).toContain('Mr. Magoo');
    expect(wrapper.text()).toContain('Hard Knocks');
  });

  it('flags the classroom as active if selected', () => {
    const classroom = { id: '5', }

    const wrapper = shallow(
      <StudentsClassroom
        classroom={classroom}
        selectedClassroomId={'5'}
      />
    );

    expect(wrapper.find('.classroom-box').prop('className')).toContain('active');
  });

  it('does not flag the classroom as active if not selected', () => {
    const classroom = { id: '5', }

    const wrapper = shallow(
      <StudentsClassroom
        classroom={classroom}
        selectedClassroomId={'10'}
      />
    );

    expect(wrapper.find('.classroom-box').prop('className')).not.toContain('active');
  });

});
