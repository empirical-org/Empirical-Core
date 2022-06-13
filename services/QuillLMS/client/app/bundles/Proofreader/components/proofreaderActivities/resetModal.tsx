import * as React from 'react'

interface ResetModalProps {
  closeModal: any,
  reset: any
}

export default class ResetModal extends React.Component<ResetModalProps> {
  componentDidMount() {
    this.modal.focus()
  }

  render() {
    const { reset, closeModal, } = this.props
    return (
      <div aria-live="polite" className="reset-modal-container" ref={(node) => this.modal = node} tabIndex={-1}>
        <div className="reset-modal-background" />
        <div className="reset-modal">
          <div className="top-section">
            <h1>Reset the passage?</h1>
            <p>This will undo all the edits you made and reset the passage to its original state.</p>
          </div>
          <div className="button-section">
            <button className="quill-button medium secondary outlined focus-on-light" onClick={closeModal} type="button">Cancel</button>
            <button className="quill-button medium primary contained focus-on-light" onClick={reset} type="button">Reset passage</button>
          </div>
        </div>
      </div>
    )
  }
}
