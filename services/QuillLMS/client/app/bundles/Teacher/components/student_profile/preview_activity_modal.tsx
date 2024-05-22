import * as React from 'react';

interface PreviewActivityModalProps {
  onClosePreviewActivityModalClick: () => void;
  previewActivityId: string
}

const PreviewActivityModal = ({ onClosePreviewActivityModalClick, previewActivityId, }: PreviewActivityModalProps) => (<div className="modal-container student-profile-modal-container">
  <div className="modal-background" />
  <div className="student-profile-modal quill-modal modal-body">
    <div>
      <h3 className="title">Only a student can complete an activity, but you can still preview it.</h3>
    </div>
    <div className="student-profile-modal-text">
      <p>None of your responses will be saved, and the activity will not be marked as complete.</p>
    </div>
    <div className="form-buttons">
      <button className="quill-button outlined secondary medium focus-on-light" onClick={onClosePreviewActivityModalClick} type="button">Cancel</button>
      <a className="quill-button contained primary medium focus-on-light" href={`/activity_sessions/anonymous?activity_id=${previewActivityId}`} onClick={onClosePreviewActivityModalClick} rel="noopener noreferrer" target="_blank">Preview activity</a>
    </div>
  </div>
</div>)

export default PreviewActivityModal
