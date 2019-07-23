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


  })

  describe('with students', () => {

    const wrapper = shallow(
      <ClassroomStudentSection classroom={classroomWithStudents} user={userProps} />
    );

    it('should render as an open card', () => {
      expect(wrapper).toMatchSnapshot();
    });

  })

});
