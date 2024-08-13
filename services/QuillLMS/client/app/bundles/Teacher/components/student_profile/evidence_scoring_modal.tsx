import * as React from 'react';

interface EvidenceScoringModalProps {
  onCloseEvidenceScoringModalClick: () => void;
}

const EvidenceScoringModal = ({ onCloseEvidenceScoringModalClick, }: EvidenceScoringModalProps) => (
  <div className="modal-container student-profile-modal-container">
    <div className="modal-background" />
    <div className="student-profile-modal quill-modal modal-body">
      <div>
        <h3 className="title">Heads up! We’ve updated this activity to include a score</h3>
      </div>
      <div className="student-profile-modal-text">
        <p>It looks like you completed a Reading for Evidence activity last year.<br /><br />We have turned on scoring for Reading for Evidence activities this year so you and your teacher can better understand your results.</p>
      </div>
      <div className="form-buttons">
        <button className="quill-button contained medium green focus-on-light" onClick={onCloseEvidenceScoringModalClick} type="button">Got it</button>
      </div>
    </div>
  </div>
)

export default EvidenceScoringModal
