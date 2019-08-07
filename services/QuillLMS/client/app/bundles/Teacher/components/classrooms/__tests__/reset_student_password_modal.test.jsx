import React from 'react';
import { shallow } from 'enzyme';

import ResetStudentPasswordModal from '../reset_student_password_modal'

import { classroomWithStudents } from './test_data/test_data'

describe('ResetStudentPasswordModal component', () => {

  const wrapper = shallow(
    <ResetStudentPasswordModal
      close={() => {}}
      onSuccess={() => {}}
      classroom={classroomWithStudents}
      student={classroomWithStudents.students[0]}
    />
  );

  it('should render ResetStudentPasswordModal', () => {
    expect(wrapper).toMatchSnapshot()
  })

})
