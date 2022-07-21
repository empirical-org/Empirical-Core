import * as React from 'react'

import { arrayFromNumbers, } from '../custom_activity_pack/shared'
import { requestPost, } from '../../../../../../modules/request'
import { DataTable, warningIcon, smallWhiteCheckIcon, } from '../../../../../Shared/index'

const activityTableHeaders = [
  {
    name: 'Activity name',
    attribute: 'name',
    width: '521px',
  },
  {
    name: 'Suggested grades',
    attribute: 'suggestedGrades',
    width: '117px'
  }
]

const classroomTableHeaders = [
  {
    name: 'Class name',
    attribute: 'name',
    width: '521px',
  },
  {
    name: 'Assigned grade',
    attribute: 'assignedGrade',
    width: '117px'
  }
]

const GradeLevelWarningModal = ({ handleClickAssign, handleCloseModal, selectedActivities, selectedClassrooms, }) => {
  const [dismissWarningCheckbox, setDismissWarningCheckbox] = React.useState(true)

  function toggleDismissWarningCheckbox() { setDismissWarningCheckbox(!dismissWarningCheckbox)}

  function completeDismissWarningCheckboxMilestone() {
    if (dismissWarningCheckbox) {
      requestPost('/milestones/complete_dismiss_grade_level_warning')
    }
  }

  function handleClickGoBackToEdit() {
    completeDismissWarningCheckboxMilestone()
    handleCloseModal()
  }

  function handleClickAssignToClasses() {
    completeDismissWarningCheckboxMilestone()
    handleClickAssign()
  }

  let checkbox = <button aria-checked={false} aria-label="Unchecked" className="quill-checkbox unselected focus-on-light" onClick={toggleDismissWarningCheckbox} role="checkbox" type="button" />
  if (dismissWarningCheckbox) {
    checkbox = <button aria-checked={true} className="quill-checkbox selected focus-on-light" onClick={toggleDismissWarningCheckbox} role="checkbox" type="button"><img alt={smallWhiteCheckIcon.alt} src={smallWhiteCheckIcon.src} /></button>
  }

  // we want to compare the classroom grades to the lower end of the range for each of the activities
  const lowestOfEachActivityReadabilityGradeLevel = selectedActivities.map(a => a.minimum_grade_level || 0)
  const highestGradeLevelBeingAssigned = Math.max(...lowestOfEachActivityReadabilityGradeLevel)

  const activityTableRows = selectedActivities.map(a => ({
    id: a.id,
    name: <a href={a.anonymous_path} rel="noopener noreferrer" target="_blank">{a.name}</a>,
    suggestedGrades: a.minimum_grade_level ? arrayFromNumbers(a.minimum_grade_level, a.maximum_grade_level).join(', ') : null
  }))

  const classroomTableRows = selectedClassrooms.map(c => {
    const { grade, id, name, } = c.classroom
    const gradeToNumber = Number(grade)
    let gradeElement = gradeToNumber ? `Grade ${gradeToNumber}` : grade

    if (gradeToNumber && gradeToNumber < highestGradeLevelBeingAssigned) {
      gradeElement = (<span className="warning"><img alt={warningIcon.alt} src={warningIcon.src} /><span>Grade {gradeToNumber}</span></span>)
    }

    return {
      id,
      name,
      assignedGrade: gradeElement
    }
  })

  return (
    <div className="modal-container grade-level-warning-modal-container">
      <div className="modal-background" />
      <div className="grade-level-warning-modal quill-modal">

        <div className="grade-level-warning-modal-header">
          <h3 className="title">Heads up! Activity grade level is above the classroom grade</h3>
        </div>

        <div className="grade-level-warning-modal-body modal-body">
          <p>Activities you are assigning are above the recommended grade level for your classes. Please confirm you want to assign these activities.</p>
          <DataTable
            headers={activityTableHeaders}
            rows={activityTableRows}
          />
          <DataTable
            headers={classroomTableHeaders}
            rows={classroomTableRows}
          />
          <p>We’re sharing this message to make sure that your students are ready for these activities. Students who have experience with Quill may be ready to practice more challenging activities. However, if you are not sure, you can preview the activity first to try it yourself and see if it’s the right level for your students.</p>
        </div>

        <div className="grade-level-warning-modal-footer">
          <div className="checkbox-wrapper">{checkbox} <span>Don&#39;t show this warning again</span></div>
          <div className="buttons">
            <button className="quill-button outlined secondary medium focus-on-light" onClick={handleClickGoBackToEdit} type="button">Go back to edit assignment</button>
            <button className="quill-button contained primary medium focus-on-light" onClick={handleClickAssignToClasses} type="button">Assign pack to class</button>
          </div>
        </div>

      </div>
    </div>
  )

}

export default GradeLevelWarningModal
