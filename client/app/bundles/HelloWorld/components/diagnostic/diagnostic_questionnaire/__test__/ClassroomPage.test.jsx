import React from 'react';
import { mount } from 'enzyme';

import ClassroomPage from '../ClassroomPage';

const classroom = {checked: false,
                  code: 'royal-act',
                  grade: null,
                  id: 726,
                  name: 'Sample Class'}

describe('ClassroomPage component', () => {
  it('renders a classroom table', () => {
    const wrapper = mount(
        <ClassroomPage/>
    );
    wrapper.setState({classrooms: [classroom]}, this.setState({loading: false}))
    expect(wrapper.find('#classroom-table-wrapper')).toHaveLength(1)
  })
})
