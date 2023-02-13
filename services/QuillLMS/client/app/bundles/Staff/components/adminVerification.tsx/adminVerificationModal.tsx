import * as React from 'react'

const AdminVerificationModal = ({ confirmFunction, headerText, bodyText, closeModal, }) => (
  <div className="modal-container admin-verification-modal-container">
    <div className="modal-background" />
    <div className="admin-verification-modal quill-modal modal-body">
      <div className="top-section">
        <h3>{headerText}</h3>
        <p>{bodyText}</p>
      </div>
      <div className="button-section">
        <button className="quill-button medium secondary outlined focus-on-light" onClick={closeModal} type="button">Cancel</button>
        <button className="quill-button medium primary contained focus-on-light" onClick={confirmFunction} type="button">Confirm</button>
      </div>
    </div>
  </div>
)

export default AdminVerificationModal
