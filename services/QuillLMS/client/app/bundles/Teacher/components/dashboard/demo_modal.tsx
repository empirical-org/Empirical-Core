import * as React from 'react'

const exploreDemoLink = `${process.env.DEFAULT_URL}/teachers/view_demo`

function goToDemo() {
  window.location.href = exploreDemoLink
}

const DemoModal = ({ close, size }) => {
  const { width, height } = size;

  return (<div className="modal-container welcome-modal-container">
    <div className="modal-background" />
    <div className="quill-modal explore-demo-modal">
      <img alt="close-modal" className="pull-right modal-button-close close-demo-modal" onClick={close} src={`${process.env.CDN_URL}/images/shared/close_x.svg`} />
      <div className="modal-body">
        <h1>Explore Demo</h1>
        <div className="explore-demo-modal-text">
          <p>You are about to enter a Demo Account. All data is for demo purposes only - you can exit the Demo and re-enter your own account at any time.</p>
        </div>
        <button className="quill-button contained primary medium" onClick={goToDemo} type="button">Let&apos;s go!</button>
      </div>
    </div>
  </div>)
}

export default DemoModal
