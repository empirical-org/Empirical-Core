import * as React from 'react'

import { Tooltip } from '../../../../../Shared/index'

const OverrideWarningModal = ({ handleClickAssign, handleCloseModal, studentNames, activityName, }) => {
  const tooltip = (<Tooltip
    tooltipText={studentNames.join('<br />')}
    tooltipTriggerText={`${studentNames.length} student${studentNames.length === 1 ? '' : 's'}`}
  />)
  const haveOrHas = studentNames.length === 1 ? 'has' : 'have'
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
            <button className="quill-button outlined secondary medium focus-on-light" onClick={handleCloseModal} type="button">Cancel</button>
            <button className="quill-button contained primary medium focus-on-light" onClick={handleClickAssign} type="button">Yes, assign</button>
          </div>
        </div>

      </div>
    </div>
  )

}

export default OverrideWarningModal
