import * as React from 'react';

interface ReauthorizeGoogleModalProps {
  googleLink: string;
  close: () => void;
}

export default class ReauthorizeGoogleModal extends React.Component<ReauthorizeGoogleModalProps, {}> {
  handleReauthorizeClick = () => {
    const { googleLink } = this.props
    window.location.href = googleLink
  }

  render() {
    const { close } = this.props

    return (
      <div className="modal-container reauthorize-google-modal-container">
        <div className="modal-background" />
        <div className="reauthorize-google-modal quill-modal modal-body">
          <div>
            <h3 className="title">
              Reauthorize Google
            </h3>
          </div>
          <p>
            To import a new Google classroom, you need to reauthorize Google access.
            <br />
            Clicking reauthorize will re-direct you to Google.
          </p>
          <div className="form-buttons">
            <button className="quill-button outlined secondary medium" onClick={close} type="button">
              Cancel
            </button>
            <button className='quill-button contained primary medium' onClick={this.handleReauthorizeClick} type="button">
              <span>Reauthorize</span>
            </button>
          </div>
        </div>
      </div>
    )
  }
}
