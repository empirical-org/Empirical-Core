import * as React from 'react'

import { DataTable, } from '../../../../../Shared/index'

const GradeLevelWarningModal = ({ handleClickAssign, handleCloseModal, selectedActivities, selectedClassrooms, }) => {
  const [dismissWarningCheckbox, setDismissWarningCheckbox] = React.useState(true)

  function handleClickGoBackToEdit() {
    handleCloseModal()
  }

  function handleClickAssignToClasses() {
    handleClickAssign()
  }

  return (
    <div className="modal-container override-warning-modal-container">
      <div className="modal-background" />
      <div className="override-warning-modal quill-modal">

        <div className="override-warning-modal-header">
          <h3 className="title">Are you sure you want to assign this diagnostic?</h3>
        </div>

        <div className="override-warning-modal-body modal-body">
          <p>{tooltip} {haveOrHas} already completed the {activityName}. If you assign the diagnostic to them, they can take it again, but it will override their scores.</p>
        </div>

        <div className="override-warning-modal-footer">
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
