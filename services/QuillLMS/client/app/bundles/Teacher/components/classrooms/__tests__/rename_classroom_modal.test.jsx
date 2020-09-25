import React from 'react';
import { shallow } from 'enzyme';

import { classroomWithStudents } from './test_data/test_data'

import RenameClassroomModal from '../rename_classroom_modal'


describe('RenameClassroomModal component', () => {

  const wrapper = shallow(
    <RenameClassroomModal
      classroom={classroomWithStudents}
      close={() => {}}
      onSuccess={() => {}}
    />
  );

  it('should render RenameClassroomModal', () => {
    expect(wrapper).toMatchSnapshot()
  })

})
