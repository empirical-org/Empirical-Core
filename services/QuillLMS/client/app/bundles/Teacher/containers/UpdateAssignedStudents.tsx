import * as React from 'react';

import { requestGet, requestPut, requestPost, } from '../../../modules/request';
import { Spinner, } from '../../Shared/index';
import Student from '../components/update_assigned_students/student'
import UnassignWarningModal from '../components/update_assigned_students/unassign_warning_modal'
import { unorderedArraysAreEqual, } from '../../../modules/unorderedArraysAreEqual'

const UpdateAssignedStudents = ({ match, unassignWarningHidden, skipLoading, passedOriginalClassrooms, passedClassroomsForComparison, passedAssignmentData, passedUnitName, }) => {
  const [loading, setLoading] = React.useState(skipLoading ? false : true)
  const [originalClassrooms, setOriginalClassrooms] = React.useState(null || passedOriginalClassrooms)
  const [classroomsForComparison, setClassroomsForComparison] = React.useState(null || passedClassroomsForComparison)
  const [assignmentData, setAssignmentData] = React.useState(null || passedAssignmentData)
  const [unitName, setUnitName] = React.useState(null || passedUnitName)
  const [showUnassignWarningModal, setShowUnassignWarningModal] = React.useState(false)
  const [hideWarningModalInFuture, setHideWarningModalInFuture] = React.useState(false)

  React.useEffect(() => {
    getClassroomsAndStudentsData(true)
  }, [])

  function getClassroomsAndStudentsData(firstTime=false) {
    requestGet(`/teachers/units/${match.params.unitId}/classrooms_with_students_and_classroom_units`, (body) => {
      const newAssignmentData = body.classrooms.map(c => ({
        id: c.id,
        student_ids: c.classroom_unit?.assigned_student_ids || [],
        assign_on_join: c.classroom_unit?.assign_on_join || false
      }))

      if (firstTime) {
        setOriginalClassrooms(body.classrooms)
      }

      setAssignmentData(newAssignmentData)
      setClassroomsForComparison(body.classrooms)
      setUnitName(body.unit_name)
      setLoading(false)
    })
  };

  function removedStudentIds() {
    const ids = []

    assignmentData.forEach(assignment => {
      const classroom = classroomsForComparison.find(c => c.id === assignment.id)
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
      const existingClassroom = classroomsForComparison.find(c => c.id === assignment.id)
      return existingClassroom.classroom_unit || assignment.student_ids.length
    })
    setLoading(true)
    requestPut(`/teachers/units/${match.params.unitId}/update_classroom_unit_assigned_students`, { unit: { classrooms: filteredAssignmentData }}, (body) => {
      getClassroomsAndStudentsData()
    })
  }

  function assignedStudentsHaveChanged() {
    return assignmentData.some(assignment => {
      const classroom = classroomsForComparison.find(c => c.id === assignment.id)
      return !unorderedArraysAreEqual(assignment.student_ids, (classroom.classroom_unit?.assigned_student_ids || []))
    })
  }

  function toggleStudentSelection(studentId, classroomId) {
    const newAssignmentData = [...assignmentData]
    const newAssignment = newAssignmentData.find(a => a.id === classroomId)
    const classroom = classroomsForComparison.find(c => c.id === classroomId)
    newAssignment.student_ids = newAssignment.student_ids.includes(studentId) ? newAssignment.student_ids.filter(id => id !== studentId) : [...newAssignment.student_ids, studentId]
    newAssignment.assign_on_join = newAssignment.student_ids.length === classroom.students.length

    setAssignmentData(newAssignmentData)
  }

  function revertUnassignment(studentId, classroomUnitId) {
    requestPut(`/teachers/units/${match.params.unitId}/restore_classroom_unit_assignment_for_one_student`, { classroom_unit_id: classroomUnitId, student_id: studentId }, (body) => {
      getClassroomsAndStudentsData()
    })
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
    closeWarningModal()
  }

  function toggleHideWarningModalInFuture() {
    setHideWarningModalInFuture(!hideWarningModalInFuture)
  }

  if (loading) {
    return <Spinner />
  }

  const classrooms = classroomsForComparison.map(classroom => {
    const originalClassroom = originalClassrooms.find(c => c.id === classroom.id)
    const assignment = assignmentData.find(a => a.id === classroom.id)
    const numberOfStudentsToAssign = assignment.student_ids.length

    const unselectAll = () => {
      const newAssignmentData = [...assignmentData]
      const newAssignment = newAssignmentData.find(a => a.id === classroom.id)
      newAssignment.student_ids = []
      newAssignment.assign_on_join = false
      setAssignmentData(newAssignmentData)
    }

    const selectAll = () => {
      const newAssignmentData = [...assignmentData]
      const newAssignment = newAssignmentData.find(a => a.id === classroom.id)
      newAssignment.student_ids = classroom.students.map(s => s.id)
      newAssignment.assign_on_join = true
      setAssignmentData(newAssignmentData)
    }

    const students = classroom.students.map(s => (
      <Student
        assignment={assignment}
        classroomUnit={classroom.classroom_unit}
        key={s.id}
        originalClassroomUnit={originalClassroom.classroom_unit}
        revertUnassignment={revertUnassignment}
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
      <div className="container">
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
              <a className={`quill-button outlined secondary medium focus-on-light ${assignedStudentsHaveChanged() ? '' : 'disabled'}`} href="/teachers/classrooms/activity_planner">Cancel</a>
              <button className={`quill-button contained primary medium focus-on-light ${assignedStudentsHaveChanged() ? '' : 'disabled'}`} disabled={!assignedStudentsHaveChanged()} onClick={handleClickUpdate} type="button">{assignedStudentsHaveChanged() ? 'Update students assigned to pack' : 'Edit students before saving'}</button>
            </div>
          </section>
          {classrooms}
        </div>
      </div>
    </section>
  )
}

export default UpdateAssignedStudents
