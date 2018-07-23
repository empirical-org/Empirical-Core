import React from 'react';
import { shallow } from 'enzyme';

import ClassMini from '../class_mini';

describe('ClassMini component', () => {
  const exampleClassObj = {
    id: 1,
    name: 'English 101',
    code: 'donald-pug',
    students: 20,
    student_count: 20,
    activities_completed: 3,
    activity_count: 3,
  };

  const exampleClassObjNoActivities = {
    id: 1,
    name: 'English 101',
    code: 'donald-pug',
    students: 20,
    student_count: 20,
    activities_completed: 0,
    activity_count: 0,
  };

  const exampleClassObjNoStudents = {
    id: 1,
    name: 'English 101',
    code: 'donald-pug',
    students: 0,
    student_count: 0,
    activities_completed: 0,
    activity_count: 0,
  };

  it('should render class name and code', () => {
    const wrapper = shallow(
      <ClassMini classObj={exampleClassObj} />
    );
    expect(wrapper.text()).toMatch('English 101');
    expect(wrapper.text()).toMatch('Class Code: donald-pug');
  });

  it('should render manage class link', () => {
    const wrapper = shallow(
      <ClassMini classObj={exampleClassObj} />
    );
    expect(wrapper.find('.class-mini-edit-students').prop('href')).toBe('/teachers/classrooms/1/students');
    expect(wrapper.find('.class-mini-edit-students').text()).toMatch('Edit Students');
  });

  describe('student count', () => {
    it('should render if there are students', () => {
      const wrapper = shallow(
        <ClassMini classObj={exampleClassObj} />
      );
      expect(wrapper.text()).toMatch('20 Students');
    });

    it('should not render if there are no students', () => {
      const wrapper = shallow(
        <ClassMini classObj={exampleClassObjNoStudents} />
      );
      expect(wrapper.text()).not.toMatch('0 Students');
    });
  });

  describe('activity count', () => {
    it('should render if there are activities', () => {
      const wrapper = shallow(
        <ClassMini classObj={exampleClassObj} />
      );
      expect(wrapper.text()).toMatch('3 Activities Completed');
    });

    it('should not render if there are no activities', () => {
      const wrapper = shallow(
        <ClassMini classObj={exampleClassObjNoActivities} />
      );
      expect(wrapper.text()).not.toMatch('0 Activities Completed');
    });
  });

  describe('classroom button', () => {
    it('should say "Invite Students" if there are no students', () => {
      const wrapper = shallow(
        <ClassMini classObj={exampleClassObjNoStudents} />
      );
      expect(wrapper.find('.button-green').text()).toBe('Invite Students');
      expect(wrapper.find('a').at(3).prop('href')).toBe('/teachers/classrooms/invite_students');
    });

    it('should say "Assign Activities" if there are students but no activities', () => {
      const wrapper = shallow(
        <ClassMini classObj={exampleClassObjNoActivities} />
      );
      expect(wrapper.find('.button-green').text()).toBe('Assign Activities');
      expect(wrapper.find('a').at(3).prop('href')).toBe('/teachers/classrooms/activity_planner?tab=exploreActivityPacks');
    });

    it('should say "view results" if there are students and activities', () => {
      const wrapper = shallow(
        <ClassMini classObj={exampleClassObj} />
      );
      expect(wrapper.find('.class-mini-btn').text()).toBe('View Results');
      expect(wrapper.find('a').at(3).prop('href')).toBe('/teachers/classrooms/scorebook?classroom_id=1');
    });
  });
});
