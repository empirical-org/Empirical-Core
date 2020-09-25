import React from 'react'
import { shallow } from 'enzyme'

import UnitAssignmentFollowup from '../unit_assignment_followup'
import { classroomProps, activities } from '../stage2/__tests__/test_data/test_data'


describe('Unit assignment followup component', () => {

  describe('When there are students assigned', () => {

    describe('on initial load', () => {
      const wrapper = shallow(
        <UnitAssignmentFollowup
          classrooms={classroomProps}
          location={{}}
          referralCode="code"
        />
      )

      it('should render', () => {
        expect(wrapper).toMatchSnapshot()
      })

      it('should render the referral form when it loads', () => {
        expect(wrapper.find('.referral').exists()).toBe(true)
      })

    })

    describe('on showNextOptions', () => {
      const wrapper = shallow(
        <UnitAssignmentFollowup
          classrooms={classroomProps}
          location={{}}
          referralCode="code"
        />
      )

      wrapper.setState({ showNextOptions: true, })

      it('should render', () => {
        expect(wrapper).toMatchSnapshot()
      })

      it('should render the next options when showNextOptions is true', () => {
        expect(wrapper.find('.next-options').exists()).toBe(true)
      })

    })
  })

  describe('When there are only empty classes assigned', () => {
    const classroomsWithNoStudents = classroomProps.map(c => {
      const newClassroom = c
      newClassroom.students = []
      newClassroom.emptyClassroomSelected = true
      return newClassroom
    })
    const wrapper = shallow(
      <UnitAssignmentFollowup
        classrooms={classroomsWithNoStudents}
        location={{}}
        referralCode="code"
      />
    )

    it('should render', () => {
      expect(wrapper).toMatchSnapshot()
    })

    it('should render the invite students card', () => {
      expect(wrapper.find('.invite-students').exists()).toBe(true)
    })
  })

})
