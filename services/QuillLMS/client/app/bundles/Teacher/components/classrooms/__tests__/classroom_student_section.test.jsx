import React from 'react';
import { shallow } from 'enzyme';

import ClassroomStudentSection from '../classroom_student_section'
import EditStudentAccountModal from '../edit_student_account_modal'
import ResetStudentPasswordModal from '../reset_student_password_modal'

import { DropdownInput, DataTable } from 'quill-component-library/dist/componentLibrary'

import { classroomWithStudents, classroomWithoutStudents, userProps, classroomProps } from './test_data/test_data'

describe('ClassroomStudentSection component', () => {

  describe('classroom without students', () => {

    const wrapper = shallow(
      <ClassroomStudentSection
        classrooms={classroomProps}
        classroom={classroomWithoutStudents}
        user={userProps}
        onSuccess={() => {}}
        inviteStudents={() => {}}
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
        classrooms={classroomProps}
        classroom={classroomWithStudents}
        user={userProps}
        onSuccess={() => {}}
        inviteStudents={() => {}}
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
      wrapper.instance().setState({ showEditStudentAccountModal: true, studentIdsForModal: [classroomWithStudents.students[0].id] })
      expect(wrapper.find(EditStudentAccountModal).exists()).toBe(true)
    })

    it('should render the ResetStudentPasswordModal if showResetStudentPasswordModal is true', () => {
      wrapper.instance().setState({ showResetStudentPasswordModal: true, studentIdsForModal: [classroomWithStudents.students[0].id] })
      expect(wrapper.find(ResetStudentPasswordModal).exists()).toBe(true)
    })

  })

});
