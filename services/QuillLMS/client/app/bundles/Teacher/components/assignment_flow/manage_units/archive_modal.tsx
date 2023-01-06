import * as React from 'react'

import { requestPut } from '../../../../../modules/request/index';

const ArchiveModal = ({ onSuccess, closeModal, unitId, unitName, }) => {
  function handleArchiveUnitButtonClick() {
    requestPut(`/teachers/units/${unitId}/hide`, {}, () => onSuccess('Activity pack deleted'))
  }

  return (
    <div className="modal-container archive-activity-pack-modal-container">
      <div className="modal-background" />
      <div className="archive-activity-pack-modal quill-modal modal-body">
        <div>
          <h3 className="title">Permanently delete this activity pack?</h3>
        </div>
        <div className="archive-activity-pack-modal-text">
          <p>Deleting an activity pack is permanent and cannot be undone. You will no longer have access to it in your student reports.</p>
          <p>If you no longer want students to see an activity pack and wish to retain access to it in your student reports, we suggest using the “Close activity pack” option instead.</p>
        </div>
        <div className="form-buttons">
          <button className="quill-button outlined secondary medium" onClick={closeModal} type="button">Cancel</button>
          <button className="quill-button contained primary medium" onClick={handleArchiveUnitButtonClick} type="button">Delete</button>
        </div>
      </div>
    </div>
  )
}

export default ArchiveModal
