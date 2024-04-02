import { shallow } from 'enzyme';
import React from 'react';

import ResetStudentPasswordModal from '../reset_student_password_modal';

import { classroomWithStudents } from './test_data/test_data';

describe('ResetStudentPasswordModal component', () => {

  const wrapper = shallow(
    <ResetStudentPasswordModal
      classroom={classroomWithStudents}
      close={() => {}}
      onSuccess={() => {}}
      student={classroomWithStudents.students[0]}
    />
  );

  it('should render ResetStudentPasswordModal', () => {
    expect(wrapper).toMatchSnapshot()
  })

})
