import * as React from 'react'

interface FollowupModalProps {
  goToLMS: any,
  goToFollowupPractice: any
}

export default class FollowupModal extends React.Component<FollowupModalProps> {
  componentDidMount() {
    this.modal.focus()
  }

  render() {
    const { goToLMS, goToFollowupPractice, } = this.props
    return (
      <div aria-live="polite" className="followup-modal-container" ref={(node) => this.modal = node} tabIndex={-1}>
        <div className="followup-modal-background" />
        <div className="followup-modal">
          <div className="top-section">
            <h1>That&#39;s the end of this passage! Now let&#39;s do some follow-up practice.</h1>
          </div>
          <div className="button-section">
            <button className="quill-button medium secondary outlined focus-on-light" onClick={goToLMS} type="button">Save and exit</button>
            <button className="quill-button medium primary contained focus-on-light" onClick={goToFollowupPractice} type="button">Begin</button>
          </div>
        </div>
      </div>
    )
  }
}
