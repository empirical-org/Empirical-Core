import * as React from 'react'

const UndoModal = ({ undo, closeModal, }) => (
  <div className="modal-container admin-verification-modal-container">
    <div className="modal-background" />
    <div className="admin-verification-modal quill-modal modal-body">
      <div className="top-section">
        <h3>Undo this decision?</h3>
        <p>This request will be moved to the “Pending requests” tab. No email will be sent to the user informing them of this change. Please contact the user directly as needed.</p>
      </div>
      <div className="button-section">
        <button className="quill-button medium secondary outlined focus-on-light" onClick={closeModal} type="button">Cancel</button>
        <button className="quill-button medium primary contained focus-on-light" onClick={undo} type="button">Confirm</button>
      </div>
    </div>
  </div>
)

export default UndoModal
