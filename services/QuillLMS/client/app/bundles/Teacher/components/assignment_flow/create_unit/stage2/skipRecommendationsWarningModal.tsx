import * as React from 'react'

import { postTestWarningModalPreNameCorrespondence } from '../../assignmentFlowConstants'
import { Tooltip, } from '../../../../../Shared/index'

const SkipRecommendationsWarningModal = ({ handleClickAssign, handleCloseModal, studentNames, restrictedActivityId, }) => {
  const tooltip = (<Tooltip
    tooltipText={studentNames.join('<br />')}
    tooltipTriggerText={`${studentNames.length} student${studentNames.length === 1 ? '' : 's'}`}
  />)
  const haveOrHas = studentNames.length === 1 ? 'has' : 'have'
  return (
    <div className="modal-container skip-recommendations-warning-modal-container">
      <div className="modal-background" />
      <div className="skip-recommendations-warning-modal quill-modal">

        <div className="skip-recommendations-warning-modal-header">
          <h3 className="title">Are you sure you want to assign this diagnostic?</h3>
        </div>

        <div className="skip-recommendations-warning-modal-body modal-body">
          <p>{tooltip} {haveOrHas} not yet completed the {postTestWarningModalPreNameCorrespondence[restrictedActivityId]}. Usually, students complete a Pre diagnostic and its practice activities first. Then, they move on to the Post diagnostic. If you assign the Post diagnostic now, students who haven&#39;t finished their practice activities yet will be able to take it, so we recommend waiting.</p>
        </div>

        <div className="skip-recommendations-warning-modal-footer">
          <div className="buttons">
            <button className="quill-button outlined secondary medium focus-on-light" onClick={handleCloseModal} type="button">Cancel</button>
            <button className="quill-button contained primary medium focus-on-light" onClick={handleClickAssign} type="button">Assign now</button>
          </div>
        </div>

      </div>
    </div>
  )

}

export default SkipRecommendationsWarningModal
