import * as React from 'react'

import { requestPut } from '../../../../../modules/request/index';

const CloseUnitModal = ({ onSuccess, closeModal, unitId, unitName, }) => {
  function handleReopenUnitButtonClick() {
    requestPut(`/teachers/units/${unitId}/reopen`, {}, () => onSuccess('Activity pack reopened'))
  }

  return (
    <div className="modal-container archive-activity-pack-modal-container">
      <div className="modal-background" />
      <div className="archive-activity-pack-modal quill-modal modal-body">
        <div>
          <h3 className="title">Reopen this activity pack?</h3>
        </div>
        <div className="archive-activity-pack-modal-text">
          <p>This activity pack will move to the “My Open Activity Packs” tab.</p>
          <p>Activities that students have not completed will be added to their “To-do activities” list.</p>
        </div>
        <div className="form-buttons">
          <button className="quill-button outlined secondary medium focus-on-light" onClick={closeModal} type="button">Cancel</button>
          <button className="quill-button contained primary medium focus-on-light" onClick={handleReopenUnitButtonClick} type="button">Reopen pack</button>
        </div>
      </div>
    </div>
  )
}

export default CloseUnitModal
