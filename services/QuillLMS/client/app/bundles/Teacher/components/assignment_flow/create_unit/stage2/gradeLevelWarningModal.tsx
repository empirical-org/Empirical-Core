import * as React from 'react'

import { requestPost, } from '../../../../../../modules/request'
import { DataTable, } from '../../../../../Shared/index'

const GradeLevelWarningModal = ({ handleClickAssign, handleCloseModal, selectedActivities, selectedClassrooms, }) => {
  const [dismissWarningCheckbox, setDismissWarningCheckbox] = React.useState(true)

  function toggleDismissWarningCheckbox() { setDismissWarningCheckbox(!dismissWarningCheckbox)}

  function completeDismissWarningCheckboxMilestone() {
    if (dismissWarningCheckbox) {
      requestPost('/milestones/complete_acknowledge_growth_diagnostic_promotion_card')
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
    checkbox = <button aria-checked={true} className="quill-checkbox selected focus-on-light" onClick={toggleDismissWarningCheckbox} role="checkbox" type="button"><img alt="check" src={smallWhiteCheckSrc} /></button>
  }


  return (
    <div className="modal-container grade-level-warning-modal-container">
      <div className="modal-background" />
      <div className="grade-level-warning-modal quill-modal">

        <div className="grade-level-warning-modal-header">
          <h3 className="title">Heads up! Activity grade level is above the classroom grade</h3>
        </div>

        <div className="grade-level-warning-modal-body modal-body">
          <p>Activities you are assigning are above the recommended grade level for your classes. Please confirm you want to assign these activities.</p>
          <p>We’re sharing this message to make sure that your students are ready for these activities. Students who have experience with Quill may be ready to practice more challenging activities. However, if you are not sure, you can preview the acticitiy first to try it yourself and see if it’s the right level for your students.</p>
        </div>

        <div className="grade-level-warning-modal-footer">
          <div className="checkbox-wrapper">{checkbox} <p>Don&#39;t show this warning again</p></div>
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
