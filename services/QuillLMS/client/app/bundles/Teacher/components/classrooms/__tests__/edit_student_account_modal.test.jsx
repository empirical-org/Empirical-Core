import React from 'react';
import { shallow } from 'enzyme';

import { classroomWithStudents } from './test_data/test_data'

import EditStudentAccountModal from '../edit_student_account_modal'


describe('EditStudentAccountModal component', () => {

  const wrapper = shallow(
    <EditStudentAccountModal
      classroom={classroomWithStudents}
      close={() => {}}
      onSuccess={() => {}}
      student={classroomWithStudents.students[0]}
    />
  );

  it('should render EditStudentAccountModal', () => {
    expect(wrapper).toMatchSnapshot()
  })

})
