import React from 'react';
import { shallow } from 'enzyme';

import ClassroomStudentSection from '../classroom_student_section'

import { classroomWithStudents, classroomWithoutStudents, userProps } from './test_data/test_data'

describe('ClassroomStudentSection component', () => {

  describe('classroom without students', () => {

    const wrapper = shallow(
      <ClassroomStudentSection classroom={classroomWithoutStudents} user={userProps} />
    );

    it('should render as a closed card', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('should render a classroom card header', () => {
      expect(wrapper.find('.classroom-card-header').exists()).toBe(true);
    })

  })

  describe('with students', () => {

    const wrapper = shallow(
      <ClassroomStudentSection classroom={classroomWithStudents} user={userProps} />
    );

    it('should render as an open card', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('should render a classroom card header', () => {
      expect(wrapper.find('.classroom-card-header').exists()).toBe(true);
    })

    it('should render a students section', () => {
      expect(wrapper.find(ClassroomStudentSectionStudentSection).exists()).toBe(true);
    })

    it('should render a teacher section', () => {
      expect(wrapper.find(ClassroomStudentSectionTeacherSection).exists()).toBe(true);
    })
  })

});
