import * as React from 'react';

interface ReauthorizeCleverModalProps {
  cleverLink: string;
  close: () => void;
}

const ReauthorizeCleverModal = ({ cleverLink, close }: ReauthorizeCleverModalProps) => {
  function handleReauthorizeClick() {
    window.location.href = cleverLink
  }

  return (
    <div className="modal-container reauthorize-clever-modal-container">
      <div className="modal-background" />
      <div className="reauthorize-clever-modal quill-modal modal-body">
        <div>
          <h3 className="title">
            Reauthorize Clever
          </h3>
        </div>
        <p>
          To import a new Clever classroom, you need to reauthorize Clever access.
          <br />
          Clicking reauthorize will re-direct you to Clever.
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

export default ReauthorizeCleverModal
