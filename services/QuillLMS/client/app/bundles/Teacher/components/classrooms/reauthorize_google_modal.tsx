import * as React from 'react';

interface ReauthorizeGoogleModalProps {
  googleLink: string;
  close: () => void;
}

const ReauthorizeGoogleModal = ({ googleLink, close }: ReauthorizeGoogleModalProps) => {
  function handleReauthorizeClick() {
    window.location.href = googleLink
  }

  return (
    <div className="modal-container reauthorize-google-modal-container">
      <div className="modal-background" />
      <div className="reauthorize-google-modal quill-modal modal-body">
        <div>
          <h3 className="title">
            Reauthorize Google
          </h3>
        </div>
        <p>
          To import a new Google classroom, you need to reauthorize Google access.
          <br />
          Clicking reauthorize will re-direct you to Google.
        </p>
        <div className="form-buttons">
          <button className="quill-button focus-on-light outlined secondary medium" onClick={close} type="button">
            Cancel
          </button>
          <button className='quill-button focus-on-light contained primary medium' onClick={handleReauthorizeClick} type="button">
            Reauthorize
          </button>
        </div>
      </div>
    </div>
  )
}

export default ReauthorizeGoogleModal
