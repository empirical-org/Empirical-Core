import { shallow } from 'enzyme'
import React from 'react'

import { DropdownInput, Tooltip } from '../../../../../../Shared/index'
import ClassroomCard from '../classroom_card.tsx'
import { classroom, students } from './test_data/test_data'

describe('Classroom card component', () => {

  it('should render', () => {
    const wrapper = shallow(
      <ClassroomCard
        classroom={classroom}
        lockedClassroomIds={[]}
        students={students}
        toggleClassroomSelection={() => {}}
        toggleStudentSelection={() => {}}
      />
    )
    expect(wrapper).toMatchSnapshot()
  })

  describe('if any students are selected', () => {
    const selectedStudents = students.map(s => {
      const student = s
      student.isSelected = true
      return student
    })
    const wrapper = shallow(
      <ClassroomCard
        classroom={classroom}
        lockedClassroomIds={[]}
        students={selectedStudents}
        toggleClassroomSelection={() => {}}
        toggleStudentSelection={() => {}}
      />
    )

    it('should render a dropdown', () => {
      expect(wrapper.find(DropdownInput).exists()).toBe(true)
    })

    it('should render a checked checkbox', () => {
      expect(wrapper.find('.quill-checkbox.selected').exists()).toBe(true)
    })

  })

  describe('if there are no students but emptyClassroomSelected is true', () => {
    classroom.emptyClassroomSelected = true
    const wrapper = shallow(
      <ClassroomCard
        classroom={classroom}
        lockedClassroomIds={[]}
        students={[]}
        toggleClassroomSelection={() => {}}
        toggleStudentSelection={() => {}}
      />
    )

    it('should render a checked checkbox', () => {
      expect(wrapper.find('.quill-checkbox.selected').exists()).toBe(true)
    })

    it('should render a placeholder', () => {
      expect(wrapper.find('.empty-class-students').exists()).toBe(true)
    })
  })

  describe('if there are no selected students', () => {
    const selectedStudents = students.map(s => {
      const student = s
      delete student.isSelected
      return student
    })
    classroom.emptyClassroomSelected = false
    const wrapper = shallow(
      <ClassroomCard
        classroom={classroom}
        lockedClassroomIds={[]}
        students={selectedStudents}
        toggleClassroomSelection={() => {}}
        toggleStudentSelection={() => {}}
      />
    )

    it('should not render a dropdown', () => {
      expect(wrapper.find(DropdownInput).exists()).toBe(false)
    })

    it('should not render a checked checkbox', () => {
      expect(wrapper.find('.quill-checkbox.unselected').exists()).toBe(true)
    })

  })

  describe('if the classroom is locked', () => {
    const wrapper = shallow(
      <ClassroomCard
        classroom={classroom}
        lockedClassroomIds={[classroom.id]}
        students={students}
        toggleClassroomSelection={() => {}}
        toggleStudentSelection={() => {}}
      />
    )

    it('should not render a dropdown', () => {
      expect(wrapper.find(DropdownInput).exists()).toBe(false)
    })

    it('should render a Tooltip', () => {
      expect(wrapper.find(Tooltip).exists()).toBe(true)
    })

  })

})
