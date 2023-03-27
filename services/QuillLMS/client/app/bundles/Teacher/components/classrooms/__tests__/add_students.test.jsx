import { shallow } from 'enzyme';
import React from 'react';

import AddStudents, { studentsCreate, teacherCreates } from '../add_students';
import ClassCodeLink from '../class_code_link';
import CreateStudentAccounts from '../create_student_accounts';
import StudentOptions from '../student_options';

const classroom = { id: 1, code: 'happy-day', name: 'Classroom'}

describe('AddStudents component', () => {

  describe('with no studentOption selected', () => {
    const wrapper = shallow(
      <AddStudents classroom={classroom} close={() => {}} showSnackbar={() => {}} />
    );

    it('should render StudentOptions', () => {
      expect(wrapper.find(StudentOptions).exists()).toBe(true);
    })
  })

  describe('studentsCreate', () => {

    const wrapper = shallow(
      <AddStudents classroom={classroom} close={() => {}} showSnackbar={() => {}} />
    );

    wrapper.setState({ studentOption: studentsCreate, })

    it('should render add students', () => {
      expect(wrapper.find(ClassCodeLink).exists()).toBe(true);
    })
  })

  describe('teacherCreates ', () => {

    const wrapper = shallow(
      <AddStudents classroom={classroom} close={() => {}} showSnackbar={() => {}} />
    );

    wrapper.setState({ studentOption: teacherCreates })

    it('should render add students', () => {
      expect(wrapper.find(CreateStudentAccounts).exists()).toBe(true);
    })

  })

});
