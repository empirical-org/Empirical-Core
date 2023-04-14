import { shallow } from 'enzyme';
import React from 'react';

import EditStudentAccountModal from '../edit_student_account_modal';

import { classroomWithStudents } from './test_data/test_data';

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
