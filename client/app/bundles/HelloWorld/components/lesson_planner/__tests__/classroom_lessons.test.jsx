import React from 'react';
import { shallow } from 'enzyme';

import ClassroomLessons from '../classroom_lessons';

describe('ClassroomLessons component', () => {
  const wrapper = shallow(<ClassroomLessons />)

  it('renders', () => {
    expect(wrapper).toMatchSnapshot()
  })
})
