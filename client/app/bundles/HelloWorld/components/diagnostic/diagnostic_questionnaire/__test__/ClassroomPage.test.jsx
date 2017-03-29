import React from 'react';
import { shallow, mount } from 'enzyme';

import ClassroomPage from '../ClassroomPage';
import Modal from 'react-bootstrap/lib/Modal';

const classroom = {checked: false,
                  code: 'royal-act',
                  grade: null,
                  id: 726,
                  name: 'Sample Class'}

describe('ClassroomPage component', () => {
  it('renders a classroom table with the same number of rows as classrooms', () => {
    const wrapper = mount(
        <ClassroomPage/>
    );
    wrapper.setState({classrooms: [classroom]}, () => wrapper.setState({loading: false}))
    expect(wrapper.find('#classroom-table-wrapper')).toHaveLength(1)
    expect(wrapper.find('.classroom-row')).toHaveLength(wrapper.state('classrooms').length)
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
    wrapper.find('.css-checkbox').simulate('change')

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

  describe('when a checkbox is unselected', () => {
    const wrapper = mount(
        <ClassroomPage/>
    );
    const checkedClassroom = {...classroom, checked: true}
    wrapper.setState({classrooms: [checkedClassroom], hiddenButton: false, selectedClassrooms: [checkedClassroom]}, () => wrapper.setState({loading: false}))
    wrapper.find('.css-checkbox').simulate('change')

    it('sets the checked property of the classroom object in state to be false', () => {
      expect(wrapper.state('classrooms')[0].checked).toBe(false)
    })

    it('removes the classroom object from the selectedClassrooms array in state', () => {
      expect(wrapper.state('selectedClassrooms')).toEqual([])
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
