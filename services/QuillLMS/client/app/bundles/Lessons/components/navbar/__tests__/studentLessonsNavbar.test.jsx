import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';

import { Navbar } from '../studentLessonsNavbar';

const classroomLesson = {
  data: {
    questions: [{}, {}, {}]
  }
}

const classroomSessions = {
  data: {
    current_slide: '1'
  }
}

describe('Navbar component', () => {
  const wrapper = mount(<Navbar
    classroomLesson={classroomLesson}
    classroomSessions={classroomSessions}
  /> )

  it('renders', () => {
    expect(toJson(wrapper)).toMatchSnapshot()
  })

})
