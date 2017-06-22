import React from 'react';
import { shallow, mount } from 'enzyme';

import ClassroomPage from '../ClassroomPage';
import Classroom from '../../../lesson_planner/create_unit/stage2/classroom'

import Modal from 'react-bootstrap/lib/Modal';

const classroom = {checked: false,
                  code: 'royal-act',
                  grade: null,
                  id: 726,
                  name: 'Sample Class',
                  students: [
                    {id: 1}, {id: 2}, {id: 3}
                  ],
                  selectedStudentIds: []
                }

describe('ClassroomPage component', () => {
  it('renders a classroom table with the same number of rows as classrooms', () => {
    const wrapper = mount(
        <ClassroomPage/>
    );
    wrapper.setState({classrooms: [classroom]}, () => wrapper.setState({loading: false}))
    expect(wrapper.find(Classroom)).toHaveLength(wrapper.state('classrooms').length)
  })

  describe('when no classes are selected', () => {
    const wrapper = mount(
        <ClassroomPage/>
    );
    wrapper.setState({classrooms: [classroom]}, () => wrapper.setState({loading: false}))

    it('does not show the Save and Assign button', () => {
      expect(wrapper.state('hiddenButton')).toBe(true)
    })

    it('does not have any selectedClassrooms in state', () => {
      expect(wrapper.state('selectedClassrooms')).toEqual([])
    })
  })

  describe('when a class is selected', () => {
    const wrapper = mount(
        <ClassroomPage/>
    );
    wrapper.setState({classrooms: [classroom]}, () => wrapper.setState({loading: false}))
    wrapper.find('.css-checkbox').first().simulate('change')

    it('sets the checked property of the classroom object in state to be true', () => {
      expect(wrapper.state('classrooms')[0].checked).toBe(true)
    })

    it('adds the classroom object to the selectedClassrooms array in state', () => {
      expect(wrapper.state('selectedClassrooms')[0].id).toEqual(wrapper.state('classrooms')[0].id)
    })

    it('sets the hiddenButton state to be false', () => {
      expect(wrapper.state('hiddenButton')).toBe(false)
    })
  })

  describe('when a classroom checkbox is unselected', () => {
    const wrapper = mount(
        <ClassroomPage/>
    );
    const checkedClassroom = {...classroom, checked: true}
    wrapper.setState({classrooms: [checkedClassroom], hiddenButton: false, selectedClassrooms: [checkedClassroom]}, () => wrapper.setState({loading: false}))
    wrapper.find('.css-checkbox').first().simulate('change')

    it('sets the checked property of the classroom object in state to be false', () => {
      expect(wrapper.state('classrooms')[0].checked).toBe(false)
    })

    it('removes the classroom object from the selectedClassrooms array in state', () => {
      expect(wrapper.state('selectedClassrooms')).toEqual([])
    })

  })

  describe('when a student checkbox is selected', () => {
    const wrapper = mount(
        <ClassroomPage/>
    );
    // const checkedStudentClassroom = _.cloneDeep(classroom)
    // checkedStudentClassroom.students[0].isSelected = true
    // wrapper.setState({classrooms: checkedStudentClassroom})
        wrapper.setState({classrooms: [classroom]}, () => wrapper.setState({loading: false}))
        wrapper.find('.css-checkbox').at(1).simulate('change')

        const student = wrapper.state('classrooms')[0]['students'][0]

        it('sets the isSelected property of the student in the classroom object in state to be true', () => {
          expect(student.isSelected).toBe(true)
        })

        it('adds the student id to the selectedStudentIds array of the classrom object in state', () => {
          expect(wrapper.state('classrooms')[0].selectedStudentIds).toEqual([student.id])
        })

        it('adds the classroom object to the selectedClassrooms array in state', () => {
          expect(wrapper.state('selectedClassrooms')[0].id).toEqual(wrapper.state('classrooms')[0].id)
        })

        it('sets the hiddenButton state to be false', () => {
          expect(wrapper.state('hiddenButton')).toBe(false)
        })

  })

  describe('the modal', () => {
    const wrapper = mount(
        <ClassroomPage/>
    );
    wrapper.setState({classrooms: [classroom]}, () => wrapper.setState({loading: false}))

    it('does not show when the page is rendered', () => {
      expect(wrapper.state('showModal')).toBe(false)
    })

    it('does show when the add a class button is clicked', () => {
      wrapper.find('#add-a-class-button').simulate('click')
      expect(wrapper.state('showModal')).toBe(true)
    })

  })

})
