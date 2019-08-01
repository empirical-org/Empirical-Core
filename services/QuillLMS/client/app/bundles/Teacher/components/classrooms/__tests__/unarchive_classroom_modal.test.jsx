import React from 'react';
import { shallow } from 'enzyme';

import UnarchiveClassroomModal from '../unarchive_classroom_modal'

import { classroomWithStudents } from './test_data/test_data'

describe('UnarchiveClassroomModal component', () => {

  const wrapper = shallow(
    <UnarchiveClassroomModal
      close={() => {}}
      onSuccess={() => {}}
      classroom={classroomWithStudents}
    />
  );

  it('should render UnarchiveClassroomModal', () => {
    expect(wrapper).toMatchSnapshot()
  })

})
