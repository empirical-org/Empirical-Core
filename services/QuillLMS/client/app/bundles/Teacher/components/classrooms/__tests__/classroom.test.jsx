import { shallow } from 'enzyme';
import React from 'react';

import Classroom from '../classroom.tsx';
import ClassroomStudentSection from '../classroom_student_section';
import ClassroomTeacherSection from '../classroom_teacher_section';

import { classroomProps, classroomWithStudents, userProps } from './test_data/test_data';

describe('Classroom component', () => {

  describe('not selected', () => {

    const wrapper = shallow(
      <Classroom
        archiveClass={() => {}}
        changeGrade={() => {}}
        classroom={classroomWithStudents}
        classrooms={classroomProps}
        clickClassroomHeader={() => {}}
        inviteStudents={() => {}}
        isOwnedByCurrentUser
        onSuccess={() => {}}
        renameClass={() => {}}
        selected={false}
        user={userProps}
      />
    );

    it('should render as a closed card', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('should render a classroom card header', () => {
      expect(wrapper.find('.classroom-card-header').exists()).toBe(true);
    })

    it('should not render a students section', () => {
      expect(wrapper.find(ClassroomStudentSection).exists()).toBe(false);
    })

    it('should not render a teacher section', () => {
      expect(wrapper.find(ClassroomTeacherSection).exists()).toBe(false);
    })
  })

  describe('selected', () => {

    const wrapper = shallow(
      <Classroom
        archiveClass={() => {}}
        changeGrade={() => {}}
        classroom={classroomWithStudents}
        classrooms={classroomProps}
        clickClassroomHeader={() => {}}
        inviteStudents={() => {}}
        onSuccess={() => {}}
        renameClass={() => {}}
        selected
        user={userProps}
      />
    );

    it('should render as an open card', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('should render a classroom card header', () => {
      expect(wrapper.find('.classroom-card-header').exists()).toBe(true);
    })

    it('should render a students section', () => {
      expect(wrapper.find(ClassroomStudentSection).exists()).toBe(true);
    })

    it('should render a teacher section', () => {
      expect(wrapper.find(ClassroomTeacherSection).exists()).toBe(true);
    })
  })

});
