import React from 'react';
import { Spinner } from 'quill-component-library/dist/componentLibrary';
export default React.createClass({

  componentDidMount() {
    this.props.saveToLMS();
  },

  renderSavedIndicator() {
    if (this.props.saved) {
      return (
        <div>
          Saved Diagnostic
        </div>
      );
    } else {
      return (
        <div>
          Saving Diagnostic
        </div>
      );
    }
  },

  render() {
    if (this.props.error) {
      return (
        <div className="landing-page">
          <h1>We Couldn't Save Your Lesson.</h1>
          <p>
            Your results could not be saved. <br />Make sure you are connected to the internet.<br />
            You can attempt to save again using the button below.<br />
            If the issue persists, ask your teacher to contact Quill.<br />
            Please provide the following URL to help us solve the problem.
          </p>
          <p><code style={{ fontSize: 14, }}>
            {window.location.href}
          </code></p>
          <button className="button is-info is-large" onClick={this.props.saveToLMS}>Retry</button>
        </div>
      );
    } else {
      return (
        <div className="landing-page">
          <h1>You've completed the Quill Placement Activity </h1>
          <p>
            Your results are being saved now.
            You'll be redirected automatically once they are saved.
          </p>
          <Spinner />
        </div>
      );
    }
  },

});
