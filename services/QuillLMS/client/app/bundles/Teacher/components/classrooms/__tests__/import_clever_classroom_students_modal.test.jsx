import React from 'react';
import { shallow } from 'enzyme';

import { classroomWithStudents } from './test_data/test_data'

import ImportCleverClassroomStudentsModal from '../import_clever_classroom_students_modal'


describe('ImportCleverClassroomStudentsModal component', () => {
  const close = () => {}
  const onSuccess = () => {}

  const wrapper = shallow(
    <ImportCleverClassroomStudentsModal
      classroom={classroomWithStudents}
      close={close}
      onSuccess={onSuccess}
    />
  );

  it('should render ImportCleverClassroomStudentsModal', () => {
    expect(wrapper).toMatchSnapshot()
  })

})
