import * as React from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard';

import { defaultSnackbarTimeout, Snackbar } from '../../../../../Shared/index'

export const ShareActivityPackModal = ({ activityPackData, classrooms, closeModal }) => {

  const [link, setLink] = React.useState<string>('quill.org/classrooms/931035?unit_id=1389916');
  const [showSnackbar, setShowSnackbar] = React.useState<boolean>(false);

  function handleCloseModal() {
    closeModal();
  }

  function handleCopyLink() {
    setShowSnackbar(true);
    setTimeout(() => setShowSnackbar(false), defaultSnackbarTimeout);
  }

  function renderActivityAndClassData() {
    if(classrooms.length === 1) {
      return(
        <div className="activity-pack-data-container">
          <p className="link-label">Activity pack link</p>
          <p className="activity-pack-link">{link}</p>
        </div>
      )
    }
  }

  function renderSnackbar() {
    return <Snackbar text="Link copied" visible={showSnackbar} />
  }

  return(
    <div className="modal-container google-classroom--modal-container">
      <div className="modal-background" />
      <div className="google-classroom-share-activity-modal quill-modal modal-body">
        <div className="title-row">
          <h3 className="title">Share this activity pack with your students</h3>
          <button className='close-button focus-on-light' onClick={handleCloseModal} type="button">
            <img alt="close-icon" src={`${process.env.CDN_URL}/images/icons/close.svg`} />
          </button>
        </div>
        <p>{`Only students who were assigned "${activityPackData && activityPackData.name}" will be able to open the link.`}</p>
        {classrooms && renderActivityAndClassData()}
        <div className="form-buttons">
          <CopyToClipboard onCopy={handleCopyLink} text={link}>
            <button className="quill-button outlined secondary medium focus-on-light" type="button">Copy link</button>
          </CopyToClipboard>
          <button className="quill-button outlined secondary medium focus-on-light" onClick={() => console.log('clicked!')} type="button">Share to Google Classroom</button>
        </div>
        {renderSnackbar()}
      </div>
    </div>
  );
}

export default ShareActivityPackModal;
