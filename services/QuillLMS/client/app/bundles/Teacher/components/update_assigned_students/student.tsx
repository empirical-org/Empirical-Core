import * as React from 'react';

import { Tooltip, } from '../../../Shared/index'

const smallWhiteCheckSrc = `${process.env.CDN_URL}/images/shared/check-small-white.svg`
const revertUnassignmentIconSrc = `${process.env.CDN_URL}/images/pages/my_activities/revert_unassignment_icon.svg`

const Student = ({ assignment, classroomUnit, student, toggleStudentSelection, originalClassroomUnit, revertUnassignment, }) => {
  function handleClickCheckbox() {
    toggleStudentSelection(student.id, assignment.id)
  }

  function handleClickRestoreAssignment() {
    revertUnassignment(student.id, classroomUnit?.id)
  }

  let checkbox = <button aria-label="Unchecked checkbox" className="quill-checkbox unselected" onClick={handleClickCheckbox} type="button" />
  if (assignment.student_ids.includes(student.id)) {
    checkbox = (<button aria-label="Checked checkbox" className="quill-checkbox selected" onClick={handleClickCheckbox} type="button">
      <img alt="Checked checkbox" src={smallWhiteCheckSrc} />
    </button>)
  }

  let className = 'student '
  let description = ''

  const toBeAssigned = assignment.student_ids.includes(student.id)
  const previouslyAssigned = classroomUnit?.assigned_student_ids?.includes(student.id)
  const originallyAssigned = originalClassroomUnit?.assigned_student_ids?.includes(student.id)

  if (previouslyAssigned && toBeAssigned) {
    className += 'already-assigned'
    description = <span>Pack <em>assigned</em></span>
  } else if (previouslyAssigned && !toBeAssigned) {
    className += 'will-be-removed'
    description = <span>Pack will be <em>removed</em></span>
  } else if (!previouslyAssigned && toBeAssigned) {
    className += 'will-be-assigned'
    description = <span>Pack will be <em>assigned</em></span>
  } else if (!previouslyAssigned && originallyAssigned) {
    description = (
      <div className="pack-removed-wrapper">
        <span>Pack <em>removed</em></span>
        <Tooltip
          tooltipText="<p><b>Restore Assigned Pack</b><br/> Student will see assigned and previously completed activities for this pack.</p>"
          tooltipTriggerText={<button aria-label="Restore assigned pack" className="interactive-wrapper focus-on-light" onClick={handleClickRestoreAssignment} type="button"><img alt="" src={revertUnassignmentIconSrc} /></button>}
        />
      </div>
    )
  }

  return (
    <div className={className}>
      <div>
        {checkbox}
        <span>{student.name}</span>
      </div>
      {description}
    </div>
  )
}

export default Student
