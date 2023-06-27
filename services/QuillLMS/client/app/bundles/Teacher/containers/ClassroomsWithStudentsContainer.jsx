import React from 'react';

import { requestGet, requestPut, } from '../../../modules/request';
import { unorderedArraysAreEqual, } from '../../../modules/unorderedArraysAreEqual'
import { Spinner, } from '../../Shared/index';
import LoadingIndicator from '../components/shared/loading_indicator.jsx';

const smallWhiteCheckSrc = `${process.env.CDN_URL}/images/shared/check-small-white.svg`

const Student = ({ assignment, classroomUnit, student, toggleStudentSelection }) => {
  function handleClickCheckbox() {
    toggleStudentSelection(student.id, assignment.id)
  }

  let checkbox = <button aria-label="Unchecked checkbox" className="quill-checkbox unselected" onClick={handleClickCheckbox} type="button" />
  if (assignment.student_ids.includes(student.id)) {
    checkbox = (<button aria-label="Checked checkbox" className="quill-checkbox selected" onClick={handleClickCheckbox} type="button">
      <img alt="Checked checkbox" src={smallWhiteCheckSrc} />
    </button>)
  }

  let className = ''
  let description = ''

  const previouslyAssigned = assignment.student_ids.includes(student.id)
  const currentlyAssigned = classroomUnit?.assigned_student_ids?.includes(student.id)

  if (previouslyAssigned && currentlyAssigned) {
    className = 'already-assigned'
    description = <span>Pack <em>assigned</em></span>
  } else if (previouslyAssigned && !currentlyAssigned) {
    className = 'will-be-removed'
    description = <span>Pack will be <em>removed</em></span>
  } else if (!previouslyAssigned && currentlyAssigned) {
    className = 'will-be-assigned'
    description = <span>Pack will be <em>assigned</em></span>
  }

  return (
    <div className="student">
      <div>
        {checkbox}
        <span>{student.name}</span>
      </div>
      {description}
    </div>
  )

}

const ClassroomsWithStudentsContainer = ({ match, user, }) => {
  const [loading, setLoading] = React.useState(true)
  const [originalClassrooms, setOriginalClassrooms] = React.useState(null)
  const [assignmentData, setAssignmentData] = React.useState(null)
  const [unitName, setUnitName] = React.useState(null)

  React.useEffect(() => {
    getClassroomsAndStudentsData()
  }, [])

  function getClassroomsAndStudentsData() {
    requestGet(`/teachers/units/${match.params.unitId}/classrooms_with_students_and_classroom_units`, (body) => {
      const newAssignmentData = body.classrooms.map(c => ({
        id: c.id,
        student_ids: c.classroom_unit?.assigned_student_ids || [],
        assign_on_join: c.classroom_unit?.assign_on_join || false
      }))

      setAssignmentData(newAssignmentData)
      setOriginalClassrooms(body.classrooms)
      setUnitName(body.unit_name)
      setLoading(false)
    })
  };

  function handleUpdate() {
    requestPut(`/teachers/units/${match.params.unitId}/update_classroom_unit_assigned_students`, assignmentData, (body) => {
      window.location = '/teachers/classrooms/lesson_planner';
    })
  }

  function assignedStudentsHaveChanged() {
    return assignmentData.some(assignment => {
      const classroom = originalClassrooms.find(c => c.id === assignment.id)
      return !unorderedArraysAreEqual(classroom.classroom_unit?.assigned_student_ids || [], assignment.student_ids)
    })
  }

  function toggleStudentSelection(studentId, classroomId) {
    const newAssignmentData = { ...assignmentData }
    const newAssignment = newAssignmentData.find(a => a.id === classroomId)
    newAssignment.student_ids = newAssignment.student_ids.includes(studentId) ? newAssignment.student_ids.filter(id => id !== studentId) : [...newAssignment.student_ids, studentId]
    setAssignmentData(newAssignmentData)
  }

  if (loading) {
    return <Spinner />
  }

  const classrooms = originalClassrooms.map(classroom => {
    const assignment = assignmentData.find(a => a.id === classroom.id)
    const numberOfStudentsToAssign = assignment.student_ids.length

    const unselectAll = () => {
      const newAssignmentData = { ...assignmentData }
      const newAssignment = newAssignmentData.find(a => a.id === classroom.id)
      newAssignment.student_ids = []
      setAssignmentData(newAssignmentData)
    }

    const selectAll = () => {
      const newAssignmentData = { ...assignmentData }
      const newAssignment = newAssignmentData.find(a => a.id === classroom.id)
      newAssignment.student_ids = classroom.students.map(s => s.id)
      setAssignmentData(newAssignmentData)
    }

    const students = classroom.students.map(s => (
      <Student
        assignment={assignment}
        classroomUnit={classroom.classroom_unit}
        key={s.id}
        student={s}
        toggleStudentSelection={toggleStudentSelection}
      />
    ))

    return (
      <section className="classroom" key={classroom.id}>
        <div className="classroom-header">
          <div>
            <h3>{classroom.name}</h3>
            <span>{numberOfStudentsToAssign}/{classroom.students.length} student{numberOfStudentsToAssign === 1 ? '' : 's'} will be assigned</span>
          </div>
          <div className="buttons">
            <button className="quill-button secondary outlined fun focus-on-dark" onClick={unselectAll} type="button">Unselect all</button>
            <button className="quill-button secondary outlined fun focus-on-dark" onClick={selectAll} type="button">Select all</button>
          </div>
        </div>
        <div className="students">
          {students}
        </div>
      </section>
    )
  })

  return (
    <section className="update-assigned-students-container white-background-accommodate-footer">
      <div className="container">
        <section className="header">
          <div>
            <h1>Update students assigned to activity pack</h1>
            <h2>{unitName}</h2>
          </div>
          <div className="buttons">
            <button className={`quill-button outlined secondary medium focus-on-light ${assignedStudentsHaveChanged() ? '' : 'disabled'}`} type="button">Cancel</button>
            <button className={`quill-button contained primary medium focus-on-light ${assignedStudentsHaveChanged() ? '' : 'disabled'}`} disabled={!assignedStudentsHaveChanged()} onClick={handleUpdate} type="button">{assignedStudentsHaveChanged() ? 'Update students assigned to pack' : 'Edit students before saving'}</button>
          </div>
        </section>
        {classrooms}
      </div>
    </section>
  )
}

export default ClassroomsWithStudentsContainer
