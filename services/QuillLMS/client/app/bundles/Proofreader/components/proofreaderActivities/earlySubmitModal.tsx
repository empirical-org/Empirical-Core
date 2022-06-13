import * as React from 'react'

interface EarlySubmitModalProps {
  closeModal: any,
  requiredEditCount: number
}

export default class EarlySubmitModal extends React.Component<EarlySubmitModalProps> {
  componentDidMount() {
    this.modal.focus()
  }

  render() {
    const { requiredEditCount, closeModal, } = this.props
    return (
      <div aria-live="polite" className="early-submit-modal-container" ref={(node) => this.modal = node} tabIndex={-1}>
        <div className="early-submit-modal-background" />
        <div className="early-submit-modal">
          <div className="top-section">
            <h1>Keep looking! You must make at least {requiredEditCount} edits.</h1>
            <button className="quill-button medium primary contained focus-on-light" onClick={closeModal} type="button">Close</button>
          </div>
        </div>
      </div>
    )
  }
}
