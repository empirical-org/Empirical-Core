import React from 'react';
import { shallow } from 'enzyme';

import EditStudentAccountModal from '../edit_student_account_modal'

import { classroomWithStudents } from './test_data/test_data'

describe('EditStudentAccountModal component', () => {

  const wrapper = shallow(
    <EditStudentAccountModal
      close={() => {}}
      onSuccess={() => {}}
      classroom={classroomWithStudents}
      student={classroomWithStudents.students[0]}
    />
  );

  it('should render EditStudentAccountModal', () => {
    expect(wrapper).toMatchSnapshot()
  })

})
