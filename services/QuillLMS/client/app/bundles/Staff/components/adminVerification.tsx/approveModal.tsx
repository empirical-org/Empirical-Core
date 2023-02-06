import * as React from 'react'

const ApproveModal = ({ approve, closeModal, }) => (
  <div className="modal-container admin-verification-modal-container">
    <div className="modal-background" />
    <div className="admin-verification-modal quill-modal modal-body">
      <div className="top-section">
        <h3>Approve this request?</h3>
        <p>The user will be sent an email informing them of the decision. This request will be moved to the “Completed requests” tab.</p>
      </div>
      <div className="button-section">
        <button className="quill-button medium secondary outlined focus-on-light" onClick={closeModal} type="button">Cancel</button>
        <button className="quill-button medium primary contained focus-on-light" onClick={approve} type="button">Confirm</button>
      </div>
    </div>
  </div>
)

export default ApproveModal
