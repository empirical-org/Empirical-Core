import * as React from 'react'

export const ShareActivityPackModal = ({ closeModal }) => {
  function handleCloseModal() {
    closeModal();
  }
  function renderActivityAndClassData() {

  }
  return(
    <div className="modal-container google-classroom--modal-container">
      <div className="modal-background" />
      <div className="google-classroom-share-activity-modal quill-modal modal-body">
        <div className="title-row">
          <h3 className="title">Share this activity pack with your students</h3>
          <button className='close-button' onClick={handleCloseModal} >
            <img alt="close-icon" src={`${process.env.CDN_URL}/images/icons/close.svg`} />
          </button>
        </div>
        <p>{`Only students who were assigned ${'name'} will be able to open the link.`}</p>
        {renderActivityAndClassData()}
        <div className="form-buttons">
          <button className="quill-button outlined secondary medium" onClick={() => console.log('clicked!')}>Copy link</button>
          <button className="quill-button outlined secondary medium" onClick={() => console.log('clicked!')}>Share to Google Classroom</button>
        </div>
      </div>
    </div>
  );
}

export default ShareActivityPackModal;
