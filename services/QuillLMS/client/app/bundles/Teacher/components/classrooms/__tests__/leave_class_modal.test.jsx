import { shallow } from 'enzyme';
import React from 'react';

import LeaveClassModal from '../leave_class_modal';

import { classroomWithStudents } from './test_data/test_data';

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
