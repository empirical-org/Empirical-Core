import * as React from 'react'

interface ReviewModalProps {
  closeModal: any,
  numberOfErrors: number,
  numberOfCorrectChanges: number
}

export default class ReviewModal extends React.Component<ReviewModalProps> {
  componentDidMount() {
    this.modal.focus()
  }

  render() {
    const { closeModal, numberOfErrors, numberOfCorrectChanges, } = this.props
    const highScoreMessage = numberOfCorrectChanges > numberOfErrors / 2 ? "Good work! " : null
    return (
      <div aria-live="polite" className="review-modal-container" ref={(node) => this.modal = node} tabIndex={-1}>
        <div className="review-modal-background" />
        <div className="review-modal">
          <div className="top-section">
            <h1>{highScoreMessage} You found {numberOfCorrectChanges} of {numberOfErrors} errors. Let&#39;s review your edits.</h1>
            <button className="quill-button medium primary contained focus-on-light" onClick={closeModal} type="button">Review</button>
          </div>
        </div>
      </div>
    )
  }
}
