import * as React from 'react'

const CopyModal = ({ attributeName, closeFunction, copyFunction, }) => {
  return (
    <div aria-live="polite" className="modal-container copy-dates-modal-container" tabIndex={-1}>
      <div className="modal-background" />
      <div className="copy-dates-modal quill-modal modal-body">
        <div className="top-section">
          <h1>Copy {attributeName} to all activities?</h1>
          <p>Copying will overwrite the settings you previously entered. Please confirm that you want to continue.</p>
        </div>
        <div className="button-section">
          <button className="quill-button medium secondary outlined focus-on-light" onClick={closeFunction} type="button">Cancel</button>
          <button className="quill-button medium primary contained focus-on-light" onClick={copyFunction} type="button">Yes, copy</button>
        </div>
      </div>
    </div>
  )
}

export default CopyModal
