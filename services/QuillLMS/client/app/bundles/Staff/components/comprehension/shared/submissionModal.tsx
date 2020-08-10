import * as React from "react";
import { Modal } from 'quill-component-library/dist/componentLibrary';

const SubmissionModal = ({ close, message }) => {
  return(
    <Modal>
      <div className="close-button-container">
        <button className="quill-button fun primary contained" id="flag-close-button" onClick={close} type="submit">x</button>
      </div>
      <p className="submission-message">{message}</p>
    </Modal>
  );
}

export default SubmissionModal;
