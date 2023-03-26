import * as React from "react";

import { copyToClipboard, Snackbar } from '../../../Shared/index';

export const TurkCompleted = ({ code }) => {
  const [snackBarVisible, setSnackBarVisible] = React.useState(false);

  function handleCopyToClipboard(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    copyToClipboard(e, setSnackBarVisible);
  };

  return(
    <div className="turk-completed-container">
      <h1>Activity Completed!</h1>
      <p>Thank you for completing this activity.</p>
      <p>Your responses will be used to develop our system so that millions of students around the world can improve their reading and writing skills.</p>
      <p>Survey code:</p>
      <div className="code">{code}</div>
      {/* Logical shortcut for only displaying the button if the copy command exists */}
      {document.queryCommandSupported('copy') &&
        <div className="button-container">
          <button className="quill-button fun primary outlined focus-on-light copy-button" onClick={handleCopyToClipboard} type="button" value={code}>Copy</button>
          <Snackbar text="Copied!" visible={snackBarVisible} />
        </div>}
    </div>
  );
}

export default TurkCompleted;
