import React from 'react';
import { shallow } from 'enzyme';

import RenameClassroomModal from '../rename_classroom_modal'

import { classroomWithStudents } from './test_data/test_data'

describe('RenameClassroomModal component', () => {

  const wrapper = shallow(
    <RenameClassroomModal
      close={() => {}}
      onSuccess={() => {}}
      classroom={classroomWithStudents}
    />
  );

  it('should render RenameClassroomModal', () => {
    expect(wrapper).toMatchSnapshot()
  })

})
