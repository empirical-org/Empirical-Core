import React from 'react';
import { shallow } from 'enzyme';

import { classroomWithStudents } from './test_data/test_data'

import ArchiveClassroomModal from '../archive_classroom_modal'


describe('ArchiveClassroomModal component', () => {

  const wrapper = shallow(
    <ArchiveClassroomModal
      classroom={classroomWithStudents}
      close={() => {}}
      onSuccess={() => {}}
    />
  );

  it('should render ArchiveClassroomModal', () => {
    expect(wrapper).toMatchSnapshot()
  })

})
