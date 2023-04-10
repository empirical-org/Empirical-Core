import { shallow } from 'enzyme';
import React from 'react';

import AddStudents from '../add_students';
import InviteStudentsModal from '../invite_students_modal.tsx';
import SetupInstructions from '../setup_instructions';

import { classroomWithStudents } from './test_data/test_data';

describe('InviteStudentsModal component', () => {

  describe('step 1', () => {

    const wrapper = shallow(
      <InviteStudentsModal
        classroom={classroomWithStudents}
        close={() => {}}
        showSnackbar={() => {}}
      />
    );

    wrapper.setState({ step: 1 })

    it('should render add students', () => {
      expect(wrapper.find(AddStudents).exists()).toBe(true);
    })

    it('should have step 1 active in the navigation', () => {
      expect(wrapper.find('.active').text()).toMatch('1. Add students')
    })
  })

  describe('step 2', () => {

    const wrapper = shallow(
      <InviteStudentsModal
        classroom={classroomWithStudents}
        close={() => {}}
        showSnackbar={() => {}}
      />
    );

    wrapper.setState({ step: 2, })

    it('should render add students', () => {
      expect(wrapper.find(SetupInstructions).exists()).toBe(true);
    })

    it('should have step 2 active in the navigation', () => {
      expect(wrapper.find('.active').text()).toMatch('2. Setup instructions')
    })
  })

});
