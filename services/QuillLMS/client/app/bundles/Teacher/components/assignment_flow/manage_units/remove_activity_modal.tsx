import * as React from 'react'

const RemoveActivityModal = ({ activityName, closeFunction, removeFunction, }) => {
  return (
    <div aria-live="polite" className="modal-container copy-dates-modal-container" tabIndex={-1}>
      <div className="modal-background" />
      <div className="copy-dates-modal quill-modal modal-body">
        <div className="top-section">
          <h1>Remove this activity?</h1>
          <p>Are you sure you want to remove {activityName} from this activity pack? </p>
        </div>
        <div className="button-section">
          <button className="quill-button medium secondary outlined focus-on-light" onClick={closeFunction} type="button">Cancel</button>
          <button className="quill-button medium primary contained focus-on-light" onClick={removeFunction} type="button">Yes, remove</button>
        </div>
      </div>
    </div>
  )
}

export default RemoveActivityModal
