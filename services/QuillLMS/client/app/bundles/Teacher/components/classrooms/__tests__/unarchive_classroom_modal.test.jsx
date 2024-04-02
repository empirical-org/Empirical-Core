import { shallow } from 'enzyme';
import React from 'react';

import UnarchiveClassroomModal from '../unarchive_classroom_modal';

import { classroomWithStudents } from './test_data/test_data';

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
