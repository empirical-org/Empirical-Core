import * as React from 'react'

const ProjectorModal: React.SFC<{closeModal: any}> = (props) => {
  return (
    <div className="projector-modal-container">
      <div className="projector-modal-background" />
      <div className="projector-modal">
        <div className="top-section">
          <button className="interactive-wrapper focus-on-light exit" onClick={props.closeModal} type="button"><img alt="" src="https://assets.quill.org/images/icons/CloseIcon.svg" /></button>
          <img alt="" className="illustration" src="https://assets.quill.org/images/illustrations/projector_modal.svg" />
          <h1><span>Next:</span> Project this window</h1>
          <p>Set your computer's display settings so that you can project the slides to students while keeping the lesson plan and student responses on your computer.</p>
          <p className="follow-instructions">Once you've adjusted your display settings, drag the window you want to project all the way to the left or right until it appears on the projector.</p>
          <button onClick={props.closeModal}>Got it!</button>
        </div>
        <div className="bottom-section">
          <p className="bottom-section-header">How to adjust your display settings?</p>

          <div className="list-container">
            <div className="list windows-list">
              <p className="list-header">For Windows:</p>
              <p className="list-item"><span>1.</span> Go to Control Panel or right-click on your desktop</p>
              <p className="list-item"><span>2.</span> Select Display settings</p>
              <p className="list-item"><span>3.</span> Click the Multiple displays dropdown</p>
              <p className="list-item"><span>4.</span> Select Extend these displays</p>
            </div>

            <div className="list mac-list">
              <p className="list-header">For Macs:</p>
              <p className="list-item"><span>1.</span> Go to System Preferences</p>
              <p className="list-item"><span>2.</span> Go to Displays</p>
              <p className="list-item"><span>3.</span> Select the Arrangement tab</p>
              <p className="list-item"><span>4.</span> Uncheck Mirror Displays</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default ProjectorModal
