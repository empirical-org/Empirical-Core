import React from 'react';
import { shallow } from 'enzyme';

import { classroomWithStudents } from './test_data/test_data'

import UnarchiveClassroomModal from '../unarchive_classroom_modal'


describe('UnarchiveClassroomModal component', () => {

  const wrapper = shallow(
    <UnarchiveClassroomModal
      classroom={classroomWithStudents}
      close={() => {}}
      onSuccess={() => {}}
    />
  );

  it('should render UnarchiveClassroomModal', () => {
    expect(wrapper).toMatchSnapshot()
  })

})
