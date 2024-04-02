import { mount, shallow } from 'enzyme';
import * as React from 'react';

import ClassroomStudentSection from '../classroom_student_section';
import EditStudentAccountModal from '../edit_student_account_modal';
import ResetStudentPasswordModal from '../reset_student_password_modal';

import { DataTable, DropdownInput } from '../../../../Shared/index';

import { classroomProps, classroomWithStudents, classroomWithoutStudents, userProps } from './test_data/test_data';

jest.mock('string-strip-html', () => ({
  stripHtml: jest.fn(val => ({ result: val }))
}));

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

    const wrapper = mount(
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

    it('should render the EditStudentAccountModal if actions button is selected followed by Edit account', () => {
      wrapper.find('button.actions-button').at(0).simulate('click')
      wrapper.find('button.action').filterWhere(n => n.text() === 'Edit account').simulate('click');
      expect(wrapper.find(EditStudentAccountModal).exists()).toBe(true)
    })

    it('should render the ResetStudentPasswordModal if actions button is selected followed by Reset password', () => {
      wrapper.find('button.actions-button').at(0).simulate('click')
      wrapper.find('button.action').filterWhere(n => n.text() === 'Reset password').simulate('click');
      expect(wrapper.find(ResetStudentPasswordModal).exists()).toBe(true)
    })

  })

});
