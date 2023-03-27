import { shallow } from 'enzyme';
import React from 'react';

import RenameClassroomModal from '../rename_classroom_modal';

import { classroomWithStudents } from './test_data/test_data';

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
