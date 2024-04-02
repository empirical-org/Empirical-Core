import { shallow } from 'enzyme';
import React from 'react';

import MergeStudentAccountsModal from '../merge_student_accounts_modal';

import { classroomWithStudents } from './test_data/test_data';

describe('MergeStudentAccountsModal component', () => {
  const studentIds = [classroomWithStudents.students[0].id, classroomWithStudents.students[1].id]

  const wrapper = shallow(
    <MergeStudentAccountsModal
      classroom={classroomWithStudents}
      close={() => {}}
      onSuccess={() => {}}
      selectedStudentIds={studentIds}
    />
  );

  it('should render MergeStudentAccountsModal', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('calling the swap method should reverse the primary and secondary accounts', () => {
    wrapper.instance().swapAccounts()
    expect(wrapper.state('primaryAccountId')).toEqual(studentIds[1])
    expect(wrapper.state('secondaryAccountId')).toEqual(studentIds[0])
  })

})
