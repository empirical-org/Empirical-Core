import { shallow } from 'enzyme';
import React from 'react';

import ArchiveClassroomModal from '../archive_classroom_modal';

import { classroomWithStudents } from './test_data/test_data';

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
