import React from 'react';
import { shallow } from 'enzyme';

import SetupInstructions from '../setup_instructions'

const classroom = { id: 1, code: 'happy-day', name: 'Classroom'}

describe('SetupInstructions component', () => {

  const wrapper = shallow(
    <SetupInstructions close={() => {}} classroom={classroom} />
  );

  it('should render SetupInstructions', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should render a link to the student_logins', () => {
    expect(wrapper.find('a').prop('href')).toMatch(`/teachers/classrooms/${classroom.id}/student_logins`)
  })
})
