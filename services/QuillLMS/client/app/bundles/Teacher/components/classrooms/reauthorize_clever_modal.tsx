import * as React from 'react';

interface ReauthorizeCleverModalProps {
  cleverLink: string;
  close: () => void;
}

export default class ReauthorizeCleverModal extends React.Component<ReauthorizeCleverModalProps, {}> {
  handleReauthorizeClick = () => {
    const { cleverLink } = this.props
    window.location.href = cleverLink
  }

  renderReauthorizeButton() {
    return (
      <button className='quill-button contained primary medium' onClick={this.handleReauthorizeClick} type="button">
        <span>Reauthorize</span>
      </button>
    )
  }

  render() {
    const { close } = this.props

    return (
      <div className="modal-container reauthorize-clever-modal-container">
        <div className="modal-background" />
        <div className="reauthorize-clever-modal quill-modal modal-body">
          <div>
            <h3 className="title">
              Reauthorize Clever
            </h3>
          </div>
          <p>
            To import a new Clever classroom, you need to reauthorize Clever access.
            <br />
            Clicking reauthorize will re-direct you to Clever.
          </p>
          <div className="form-buttons">
            <button className="quill-button outlined secondary medium" onClick={close} type="button">
              Cancel
            </button>
            {this.renderReauthorizeButton()}
          </div>
        </div>
      </div>
    )
  }
}
