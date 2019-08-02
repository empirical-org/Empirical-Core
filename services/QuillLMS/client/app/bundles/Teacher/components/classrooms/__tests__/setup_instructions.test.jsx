import React from 'react';
import { shallow } from 'enzyme';

import SetupInstructions from '../setup_instructions'

import { classroomWithStudents, classroomWithoutStudents } from './test_data/test_data'

describe('SetupInstructions component', () => {

  describe('if there are students', () => {
    const wrapper = shallow(
      <SetupInstructions close={() => {}} classroom={classroomWithStudents} />
    );

    it('should render SetupInstructions', () => {
      expect(wrapper).toMatchSnapshot()
    })

    it('should render a link to the student_logins', () => {
      expect(wrapper.find('a').prop('href')).toMatch(`/teachers/classrooms/${classroom.id}/student_logins`)
    })
  })

  describe('if there are no students', () => {
    const wrapper = shallow(
      <SetupInstructions close={() => {}} classroom={classroomWithoutStudents} />
    );

    it('should render SetupInstructions', () => {
      expect(wrapper).toMatchSnapshot()
    })

    it('should render a link to the student_logins', () => {
      expect(wrapper.find('a').prop('href')).toMatch(`${process.env.CDN_URL}/documents/setup_instructions_pdfs/class_code_links.pdf`)
    })
  })
  })

})
