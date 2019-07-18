import React from 'react';
import { shallow } from 'enzyme';

import AddStudents from '../add_students'

const classroom = { id: 1, code: 'happy-day', name: 'Classroom'}

describe('AddStudents component', () => {

  describe('step 1', () => {
    const wrapper = shallow(
      <AddStudents showSnackbar={() => {}} close={() => {}} classroom={classroom} />
    );

    it('should render StudentOptions', () => {
      expect(wrapper.find(StudentOptions).exists()).toBe(true);
    })

    it('should have step 1 active in the navigation', () => {
      expect(wrapper.find('.active').text()).toMatch('1. Create a class')
    })
  })

  describe('step 2', () => {

    const wrapper = shallow(
      <AddStudents showSnackbar={() => {}} close={() => {}} />
    );

    wrapper.setState({ step: 2})

    it('should render add students', () => {
      expect(wrapper.find(AddStudents).exists()).toBe(true);
    })

    it('should have step 2 active in the navigation', () => {
      expect(wrapper.find('.active').text()).toMatch('2. Add students')
    })
  })

  describe('step 3', () => {

    const wrapper = shallow(
      <AddStudents showSnackbar={() => {}} close={() => {}} />
    );

    wrapper.setState({ step: 3})

    it('should render add students', () => {
      expect(wrapper.find(SetupInstructions).exists()).toBe(true);
    })

    it('should have step 3 active in the navigation', () => {
      expect(wrapper.find('.active').text()).toMatch('3. Setup instructions')
    })
  })

});
