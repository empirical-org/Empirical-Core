import * as React from 'react';

interface EvidenceScoringModalProps {
  launchLink: string;
}

const EvidenceScoringModal = ({ launchLink, }: EvidenceScoringModalProps) => (
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
        <a className="quill-button contained medium green focus-on-light" href={launchLink}>Got it</a>
      </div>
    </div>
  </div>
)

export default EvidenceScoringModal
