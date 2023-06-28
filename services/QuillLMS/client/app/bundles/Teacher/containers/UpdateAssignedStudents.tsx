import React from 'react';

import { requestGet, requestPut, } from '../../../modules/request';
import { unorderedArraysAreEqual, } from '../../../modules/unorderedArraysAreEqual'
import { Spinner, warningIcon, } from '../../Shared/index';
import Student from '../components/update_assigned_students/student'
import UnassignWarningModal from '../components/update_assigned_students/unassign_warning_modal'

const smallWhiteCheckSrc = `${process.env.CDN_URL}/images/shared/check-small-white.svg`

const UpdateAssignedStudents = ({ match, user, unassignWarningHidden, }) => {
  const [loading, setLoading] = React.useState(true)
  const [originalClassrooms, setOriginalClassrooms] = React.useState(null)
  const [assignmentData, setAssignmentData] = React.useState(null)
  const [unitName, setUnitName] = React.useState(null)
  const [showUnassignWarningModal, setShowUnassignWarningModal] = React.useState(false)
  const [hideWarningModalInFuture, setHideWarningModalInFuture] = React.useState(false)

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

  function removedStudentIds() {
    const ids = []

    assignmentData.forEach(assignment => {
      const classroom = originalClassrooms.find(c => c.id === assignment.id)
      if (!classroom.classroom_unit) { return }

      ids.push(classroom.classroom_unit.assigned_student_ids.filter(id => !assignment.student_ids.includes(id)))
    })

    return ids.flat()
  }

  function handleClickUpdate() {
    if (removedStudentIds().length && !unassignWarningHidden) {
      setShowUnassignWarningModal(true)
    } else {
      updateAssignedStudents()
    }
  }

  function updateAssignedStudents() {
    const filteredAssignmentData = assignmentData.filter(assignment => {
      const existingClassroom = originalClassrooms.find(c => c.id === assignment.id)
      return existingClassroom.classroom_unit || assignment.student_ids.length
    })
    requestPut(`/teachers/units/${match.params.unitId}/update_classroom_unit_assigned_students`, { classrooms: filteredAssignmentData }, (body) => {
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
    const newAssignmentData = [...assignmentData]
    const newAssignment = newAssignmentData.find(a => a.id === classroomId)
    newAssignment.student_ids = newAssignment.student_ids.includes(studentId) ? newAssignment.student_ids.filter(id => id !== studentId) : [...newAssignment.student_ids, studentId]
    setAssignmentData(newAssignmentData)
  }

  function closeWarningModal() {
    setShowUnassignWarningModal(false)
  }

  function sendRequestToHideWarningModalInFuture() {
    requestPost(
      `${process.env.DEFAULT_URL}/milestones/complete_dismiss_unassign_warning_modal`,
      {},
      (body) => {}
    )
  }

  function onClickWarningModalUpdate() {
    if (hideWarningModalInFuture) {
      sendRequestToHideWarningModalInFuture()
    }
    updateAssignedStudents()
    closeModal()
  }

  function toggleHideWarningModalInFuture() {
    setHideWarningModalInFuture(!hideWarningModalInFuture)
  }

  if (loading) {
    return <Spinner />
  }

  const classrooms = originalClassrooms.map(classroom => {
    const assignment = assignmentData.find(a => a.id === classroom.id)
    const numberOfStudentsToAssign = assignment.student_ids.length

    const unselectAll = () => {
      const newAssignmentData = [...assignmentData]
      const newAssignment = newAssignmentData.find(a => a.id === classroom.id)
      newAssignment.student_ids = []
      setAssignmentData(newAssignmentData)
    }

    const selectAll = () => {
      const newAssignmentData = [...assignmentData]
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
      <section className="classroom-section" key={classroom.id}>
        <div className="classroom-header">
          <div>
            <h3>{classroom.name}</h3>
            <span>{numberOfStudentsToAssign}/{classroom.students.length} student{numberOfStudentsToAssign === 1 ? '' : 's'} will be assigned</span>
          </div>
          <div className="buttons">
            <button className="quill-button secondary outlined fun focus-on-dark" onClick={unselectAll} type="button">Unselect all</button>
            <button className="quill-button contained primary fun focus-on-dark" onClick={selectAll} type="button">Select all</button>
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
      {showUnassignWarningModal && (
        <UnassignWarningModal
          closeModal={closeWarningModal}
          handleClickUpdate={onClickWarningModalUpdate}
          hideWarningModalInFuture={hideWarningModalInFuture}
          removedStudentCount={removedStudentIds().length}
          toggleCheckbox={toggleHideWarningModalInFuture}
        />
      )}
      <div className="container">
        <section className="header">
          <div>
            <h1>Update students assigned to activity pack</h1>
            <h2>{unitName}</h2>
          </div>
          <div className="buttons">
            <button className={`quill-button outlined secondary medium focus-on-light ${assignedStudentsHaveChanged() ? '' : 'disabled'}`} type="button">Cancel</button>
            <button className={`quill-button contained primary medium focus-on-light ${assignedStudentsHaveChanged() ? '' : 'disabled'}`} disabled={!assignedStudentsHaveChanged()} onClick={handleClickUpdate} type="button">{assignedStudentsHaveChanged() ? 'Update students assigned to pack' : 'Edit students before saving'}</button>
          </div>
        </section>
        {classrooms}
      </div>
    </section>
  )
}

export default UpdateAssignedStudents
