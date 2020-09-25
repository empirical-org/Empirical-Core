import React from 'react';
import { shallow } from 'enzyme';

import { classroomWithStudents, classroomWithoutStudents } from './test_data/test_data'

import SetupInstructions from '../setup_instructions'


describe('SetupInstructions component', () => {

  describe('if there are students', () => {
    const wrapper = shallow(
      <SetupInstructions classroom={classroomWithStudents} close={() => {}} />
    );

    it('should render SetupInstructions', () => {
      expect(wrapper).toMatchSnapshot()
    })

    it('should render a link to the student_logins', () => {
      expect(wrapper.find('a').first().prop('href')).toMatch(`/teachers/classrooms/${classroomWithStudents.id}/student_logins`)
    })
  })

  describe('if there are no students', () => {
    const wrapper = shallow(
      <SetupInstructions classroom={classroomWithoutStudents} close={() => {}} />
    );

    it('should render SetupInstructions', () => {
      expect(wrapper).toMatchSnapshot()
    })

    it('should render a link to the student_logins', () => {
      expect(wrapper.find('a').first().prop('href')).toMatch(`${process.env.CDN_URL}/documents/setup_instructions_pdfs/class_code_links.pdf`)
    })
  })

})
