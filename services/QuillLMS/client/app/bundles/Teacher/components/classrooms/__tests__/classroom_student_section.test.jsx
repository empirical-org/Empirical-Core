import { shallow } from 'enzyme';
import React from 'react';

import ClassroomStudentSection from '../classroom_student_section';
import EditStudentAccountModal from '../edit_student_account_modal';
import ResetStudentPasswordModal from '../reset_student_password_modal';

import { DataTable, DropdownInput } from '../../../../Shared/index';

import { classroomProps, classroomWithoutStudents, classroomWithStudents, userProps } from './test_data/test_data';

describe('ClassroomStudentSection component', () => {

  describe('classroom without students', () => {

    const wrapper = shallow(
      <ClassroomStudentSection
        classroom={classroomWithoutStudents}
        classrooms={classroomProps}
        inviteStudents={() => {}}
        isOwnedByCurrentUser
        onSuccess={() => {}}
        user={userProps}
      />
    );

    it('should render', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('should render a no-students section', () => {
      expect(wrapper.find('.no-students').exists()).toBe(true)
    })

  })

  describe('with students', () => {

    const wrapper = shallow(
      <ClassroomStudentSection
        classroom={classroomWithStudents}
        classrooms={classroomProps}
        inviteStudents={() => {}}
        onSuccess={() => {}}
        user={userProps}
      />
    );

    it('should render', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('should render a students actions dropdown', () => {
      expect(wrapper.find(DropdownInput).exists()).toBe(true)
    })

    it('should render a data table', () => {
      expect(wrapper.find(DataTable).exists()).toBe(true)
    })

    it('should render the EditStudentAccountModal if showEditStudentAccountModal is true', () => {
      wrapper.instance().editStudentAccount(classroomWithStudents.students[0].id)
      expect(wrapper.find(EditStudentAccountModal).exists()).toBe(true)
    })

    it('should render the ResetStudentPasswordModal if showResetStudentPasswordModal is true', () => {
      wrapper.instance().resetStudentPassword(classroomWithStudents.students[0].id)
      expect(wrapper.find(ResetStudentPasswordModal).exists()).toBe(true)
    })

  })

});
