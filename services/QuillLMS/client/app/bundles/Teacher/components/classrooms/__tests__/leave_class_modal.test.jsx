import React from 'react';
import { shallow } from 'enzyme';

import { classroomWithStudents } from './test_data/test_data'

import LeaveClassModal from '../leave_class_modal'


describe('LeaveClassModal component', () => {

  const wrapper = shallow(
    <LeaveClassModal
      classroom={classroomWithStudents}
      close={() => {}}
      onSuccess={() => {}}
    />
  );

  it('should render LeaveClassModal', () => {
    expect(wrapper).toMatchSnapshot()
  })

})
