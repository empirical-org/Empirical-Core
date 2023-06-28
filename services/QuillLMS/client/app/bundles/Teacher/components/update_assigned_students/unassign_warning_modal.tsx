import React from 'react';

import { warningIcon, } from '../../../Shared/index';

const smallWhiteCheckSrc = `${process.env.CDN_URL}/images/shared/check-small-white.svg`

const UnassignWarningModal = ({ removedStudentCount, toggleCheckbox, closeModal, handleClickUpdate, hideWarningModalInFuture, }) => {
  let checkbox = <button aria-label="Unchecked checkbox" className="quill-checkbox unselected" onClick={toggleCheckbox} type="button" />

  if (hideWarningModalInFuture) {
    checkbox = (<button aria-label="Checked checkbox" className="quill-checkbox selected" onClick={toggleCheckbox} type="button">
      <img alt="Checked checkbox" src={smallWhiteCheckSrc} />
    </button>)
  }

  return (
    <div className="modal-container unassign-warning-modal-container">
      <div className="modal-background" />
      <div className="quill-modal unassign-warning-modal">
        <div className="modal-body">
          <h2><img alt="" src={warningIcon.src} /> <span>{removedStudentCount} Student{removedStudentCount === 1 ? '' : 's'} Will Have This Activity Pack Removed</span></h2>
          <div className="unassign-warning-modal-text">
            <p>The students will no longer see this activity pack -- <b>they will no longer see their previously completed assignments and their not yet completed assignments.</b><br /><br />You can restore the pack at any point in the future if you would like these students to be able to see their assignments again.<br />If you do not want these students to lose access to this activity pack, click the <b>Cancel</b> button and re-check these students’ names.<br /><br />If you would like to remove the activity pack for these students, click the <b>Update Students</b> button.</p>
          </div>
          <div className="unassign-warning-modal-footer">
            <div className="checkbox-wrapper">
              {checkbox}
              <span>Don&#39;t show this message again</span>
            </div>
            <div className="buttons">
              <button className="quill-button secondary outlined fun focus-on-light" onClick={closeModal} type="button">Cancel</button>
              <button className="quill-button contained primary fun focus-on-light" onClick={handleClickUpdate} type="button">Update students</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UnassignWarningModal
