import React from 'react';
import { shallow } from 'enzyme';

import ClassroomStudentSection from '../classroom_student_section'

import { DataTable, DropdownInput } from 'quill-component-library/dist/componentLibrary'

import { classroomWithStudents, classroomWithoutStudents, userProps } from './test_data/test_data'

describe('ClassroomStudentSection component', () => {

  describe('classroom without students', () => {

    const wrapper = shallow(
      <ClassroomStudentSection classroom={classroomWithoutStudents} user={userProps} />
    );

    it('should render', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('should render a no-students section', () => {
      expect(wrapper.find('.no-students').exists()).toBe(true);
    })

  })

  describe('with students', () => {

    const wrapper = shallow(
      <ClassroomStudentSection classroom={classroomWithStudents} user={userProps} />
    );

    it('should render', () => {
      expect(wrapper).toMatchSnapshot();
    });
    it('should render a dropdown', () => {
      expect(wrapper.find(DropdownInput).exists()).toBe(true);
    })
    it('should render a DataTable', () => {
      expect(wrapper.find(DataTable).exists()).toBe(true)
    })
  })

});
