import * as React from 'react';

import { requestPut } from '../../../../../modules/request/index';

const CloseUnitModal = ({ onSuccess, closeModal, unitId, unitName, }) => {
  function handleCloseUnitButtonClick() {
    requestPut(`/teachers/units/${unitId}/close`, {}, () => onSuccess('Activity pack closed'))
  }

  return (
    <div className="modal-container archive-activity-pack-modal-container">
      <div className="modal-background" />
      <div className="archive-activity-pack-modal quill-modal modal-body">
        <div>
          <h3 className="title">Close this activity pack?</h3>
        </div>
        <div className="archive-activity-pack-modal-text">
          <p>This activity pack will move to the &#34;My Closed Activity Packs&#34; tab. You will still have access to it in your student reports.</p>
          <p>Activities that students did not complete will be removed from their &#34;To-do activities&#34; list. Activities that students completed will remain on their &#34;Completed&#34; list.</p>
          <p>If you change your mind and wish to reopen this activity pack, you can do so from the &#34;My Closed Activity Packs&#34; tab.</p>
        </div>
        <div className="form-buttons">
          <button className="quill-button outlined secondary medium focus-on-light" onClick={closeModal} type="button">Cancel</button>
          <button className="quill-button contained primary medium focus-on-light" onClick={handleCloseUnitButtonClick} type="button">Close pack</button>
        </div>
      </div>
    </div>
  )
}

export default CloseUnitModal
