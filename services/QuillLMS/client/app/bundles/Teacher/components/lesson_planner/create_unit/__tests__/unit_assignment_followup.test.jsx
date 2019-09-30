import React from 'react'
import { shallow } from 'enzyme'

import UnitAssignmentFollowup from '../unit_assignment_followup'

import { classroomProps, activities } from '../stage2/__tests__/test_data/test_data'

describe('Unit assignment followup component', () => {

  describe('When there are students assigned', () => {

    describe('on initial load', () => {
      const wrapper = shallow(
        <UnitAssignmentFollowup
          selectedActivities={activities}
          classrooms={classroomProps}
          unitName="A Unit"
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

    describe('on stage 2', () => {
      const wrapper = shallow(
        <UnitAssignmentFollowup
          selectedActivities={activities}
          classrooms={classroomProps}
          unitName="A Unit"
          referralCode="code"
        />
      )
      
      wrapper.setState({ stage: 2, })

      it('should render', () => {
        expect(wrapper).toMatchSnapshot()
      })

      it('should render the next options when it is on stage 2', () => {
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
        selectedActivities={activities}
        classrooms={classroomsWithNoStudents}
        unitName="A Unit"
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
