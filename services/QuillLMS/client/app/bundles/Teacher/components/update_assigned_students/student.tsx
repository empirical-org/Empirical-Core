import React from 'react';

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

  let className = 'student '
  let description = ''

  const toBeAssigned = assignment.student_ids.includes(student.id)
  const previouslyAssigned = classroomUnit?.assigned_student_ids?.includes(student.id)

  if (previouslyAssigned && toBeAssigned) {
    className += 'already-assigned'
    description = <span>Pack <em>assigned</em></span>
  } else if (previouslyAssigned && !toBeAssigned) {
    className += 'will-be-removed'
    description = <span>Pack will be <em>removed</em></span>
  } else if (!previouslyAssigned && toBeAssigned) {
    className += 'will-be-assigned'
    description = <span>Pack will be <em>assigned</em></span>
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
