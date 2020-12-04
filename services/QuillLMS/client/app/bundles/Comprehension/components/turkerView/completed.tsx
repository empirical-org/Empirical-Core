import * as React from "react";

import { Snackbar } from '../../../Shared/index';

export const TurkCompleted = ({ code }) => {
  const [snackBarVisible, setSnackBarVisible] = React.useState(false);

  function copyToClipboard(e: React.SyntheticEvent) {
    navigator.clipboard.writeText(code);
    setSnackBarVisible(true);
    setTimeout(() => setSnackBarVisible(false), 3000);
  };

  return(
    <div className="turk-completed-container">
      <h1>Activity Completed!</h1>
      <p>Thank you for completing this activity.</p>
      <p>Your responses will be used to develop our system so that millions of students around the world can improve their reading and writing skills.</p>
      <h1>Payment Directions</h1>
      <p>Use the following HIT code for payment:</p>
      <div className="code">{code}</div>
      {/* Logical shortcut for only displaying the button if the copy command exists */}
      {document.queryCommandSupported('copy') &&
        <div className="button-container">
          <button className="quill-button fun primary outlined focus-on-light copy-button" onClick={copyToClipboard} type="button">Copy</button>
          <Snackbar text="Copied!" visible={snackBarVisible} />
        </div>}
    </div>
  );
}

export default TurkCompleted;
