import {
  mount,
} from 'enzyme';
import _ from 'lodash';
import React from 'react';

import Student from '../student';

const alreadyAssignedStudent = { id: 1032, name: "Ken Liu" }
const removedStudent = { id: 1035, name: "Tahereh Mafi" }
const defaultStudent = { id: 1033, name: "Jason Reynolds" }
const willBeRemovedStudent = { id: 1034, name: "Nic Stone" }
const willBeAssignedStudent = { id: 1036, name: "Angie Thomas" }

const sharedProps = {
  toggleStudentSelection: jest.fn(),
  revertUnassignment: jest.fn(),
  assignment: {
    id: 173,
    student_ids: [alreadyAssignedStudent.id, willBeAssignedStudent.id],
    assign_on_join: false
  },
  classroomUnit: {
    id: 1067,
    assigned_student_ids: [alreadyAssignedStudent.id, willBeRemovedStudent.id],
    assign_on_join: false
  },
  originalClassroomUnit: {
    id: 1067,
    assigned_student_ids: [alreadyAssignedStudent.id, willBeRemovedStudent.id, removedStudent.id],
    assign_on_join: false
  }
}


describe('Student', () => {
  it('should render when the student has already been assigned', () => {
    const component = mount(<Student {...sharedProps} student={alreadyAssignedStudent} />)

    expect(component).toMatchSnapshot()
  })

  it('should render when the student has been removed', () => {
    const component = mount(<Student {...sharedProps} student={removedStudent} />)

    expect(component).toMatchSnapshot()
  })

  it('should render when the student has not been assigned and has no status change', () => {
    const component = mount(<Student {...sharedProps} student={defaultStudent} />)

    expect(component).toMatchSnapshot()
  })

  it('should render when the student will be removed', () => {
    const component = mount(<Student {...sharedProps} student={willBeRemovedStudent} />)

    expect(component).toMatchSnapshot()
  })

  it('should render when the student will be assigned', () => {
    const component = mount(<Student {...sharedProps} student={willBeAssignedStudent} />)

    expect(component).toMatchSnapshot()
  })

})
