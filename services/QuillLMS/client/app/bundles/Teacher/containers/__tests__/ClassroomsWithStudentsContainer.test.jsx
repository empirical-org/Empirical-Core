import {
    mount, shallow
} from 'enzyme';
import _ from 'lodash';
import React from 'react';

import ClassroomsWithStudentsContainer from '../ClassroomsWithStudentsContainer';
import { classroomsWithStudentsContainerData } from './test_data';

const { props, state, } = classroomsWithStudentsContainerData

describe('ClassroomsWithStudentsContainer container', () => {

  it('should render', () => {
    const wrapper = mount( <ClassroomsWithStudentsContainer {...props} />);
    expect(wrapper.find(ClassroomsWithStudentsContainer).exists()).toBe(true);
  });

  describe('classroomUpdated', () => {

    it('returns false if the selected students are the same as the originally assigned students', () => {
      const wrapper = shallow( <ClassroomsWithStudentsContainer {...props} />);
      wrapper.setState(_.cloneDeep(state))
      wrapper.instance().selectPreviouslyAssignedStudents();
      expect(wrapper.instance().classroomUpdated(wrapper.state().classrooms[0])).toBe(false)
    })

    it('returns true otherwise', () => {
      const wrapper = shallow( <ClassroomsWithStudentsContainer {...props} />);
      const newState = _.cloneDeep(state)
      newState.classrooms[0].students[0].isSelected = true
      wrapper.setState(newState)
      expect(wrapper.instance().classroomUpdated(wrapper.state().classrooms[0])).toBe(true)
    })

  })

  describe('studentsChanged', () => {
    it('returns true if a classroom has been updated', () => {
      const wrapper = shallow( <ClassroomsWithStudentsContainer {...props} />);
      const newState = _.cloneDeep(state)
      newState.classrooms[0].students[0].isSelected = true
      wrapper.setState(newState)
      expect(wrapper.instance().studentsChanged(newState.classrooms)).toBe(true)
    })

    it('returns false if no classrooms have been updated', () => {
      const wrapper = shallow( <ClassroomsWithStudentsContainer {...props} />);
      wrapper.setState(_.cloneDeep(state))
      wrapper.instance().selectPreviouslyAssignedStudents();
      expect(wrapper.instance().studentsChanged(wrapper.state('classrooms'))).toBe(undefined)
    })
  })

  describe('selectPreviouslyAssignedStudents', ()=> {
    it('selectPreviouslyAssignedStudents marks a student as selected if they are an assigned student', () => {
      const wrapper = shallow(<ClassroomsWithStudentsContainer {...props} />);
      wrapper.setState(_.cloneDeep(state))
      let assignedStudents = wrapper.state().classrooms[0].classroom_unit.assigned_student_ids
      let students = wrapper.state().classrooms[0].students
      wrapper.instance().selectPreviouslyAssignedStudents();
      let selectedStudents = []
      students.forEach((stud)=> {
        if (stud.isSelected) {
          selectedStudents.push(stud.id)
        }
      });
      expect(assignedStudents.sort((a,b)=> a - b)).toEqual(selectedStudents.sort((a,b)=> a - b))
    })
    it('correctly marks when a missing student was assigned the activity', () => {
      const newWrapper = shallow( <ClassroomsWithStudentsContainer {...props} />);
      newWrapper.setState(_.cloneDeep(state))
      let assignedStudents = newWrapper.state().classrooms[0].classroom_unit.assigned_student_ids
      newWrapper.instance().selectPreviouslyAssignedStudents();
      let students = newWrapper.state().classrooms[0].students
      let selectedStudents = []
      students.forEach((stud)=> {
        if (stud.isSelected) {
          selectedStudents.push(stud.id)
        }
      });
      expect(selectedStudents.length).toEqual(assignedStudents.length)
      expect(selectedStudents).not.toContain(0)
    })
  })







});
