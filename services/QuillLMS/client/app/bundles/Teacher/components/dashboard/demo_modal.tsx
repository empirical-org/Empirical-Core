import * as React from 'react'

const exploreDemoLink = `${process.env.DEFAULT_URL}/teachers/view_demo`

function goToDemo() {
  window.location.href = exploreDemoLink
}

const DemoModal = ({ close, size }) => {
  return (
    <div className="modal-container welcome-modal-container">
      <div className="modal-background" />
      <div className="quill-modal explore-demo-modal">
        <div className="modal-body">
          <h1>Explore Demo</h1>
          <div className="explore-demo-modal-text">
            <p>You are about to enter a Demo Account. All data is for demo purposes only - you can exit the Demo and re-enter your own account at any time.</p>
          </div>
          <button className="quill-button contained primary medium" onClick={goToDemo} type="button">Let&apos;s go!</button>
          <button className="quill-button contained secondary medium outlined cancel-button" onClick={close} type="button">Cancel</button>
        </div>
      </div>
    </div>
  )
}

export default DemoModal
