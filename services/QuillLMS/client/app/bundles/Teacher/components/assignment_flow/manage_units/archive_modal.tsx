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
          <h3 className="title">Delete this activity pack?</h3>
        </div>
        <div className="archive-activity-pack-modal-text">
          <p>If you delete the activity pack &#34;{unitName},&#34; you will no longer have access to it on the Student Reports page. Students who completed or were assigned activities will no longer be able to access them.</p>
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
