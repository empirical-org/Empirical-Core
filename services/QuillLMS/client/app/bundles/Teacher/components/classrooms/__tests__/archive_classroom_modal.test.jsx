import React from 'react';
import { shallow } from 'enzyme';

import ArchiveClassroomModal from '../archive_classroom_modal'

import { classroomWithStudents } from './test_data/test_data'

describe('ArchiveClassroomModal component', () => {

  const wrapper = shallow(
    <ArchiveClassroomModal
      close={() => {}}
      onSuccess={() => {}}
      classroom={classroomWithStudents}
    />
  );

  it('should render ArchiveClassroomModal', () => {
    expect(wrapper).toMatchSnapshot()
  })

})
