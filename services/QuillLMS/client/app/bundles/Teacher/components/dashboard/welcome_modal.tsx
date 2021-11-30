import * as React from 'react'
import Confetti from 'react-confetti'

const classroomActivitiesSrc = `${process.env.CDN_URL}/images/pages/dashboard/illustrations-classroom-activities.svg`

const exploreDemoLink = `${process.env.DEFAULT_URL}/teachers/view_demo`

function goToDemo() {
  window.location.href = exploreDemoLink
}

const WelcomeModal = ({ close, size }) => {
  const { width, height } = size;

  return (<div className="modal-container welcome-modal-container">
    <div className="modal-background" />
    <Confetti
      height={height}
      numberOfPieces={700}
      recycle={false}
      width={width}
    />
    <div className="welcome-modal quill-modal">
      <div className="modal-body">
        <h1>Welcome to Quill!</h1>
        <div className="welcome-modal-text">
          <p>Our mission as a non-profit is to help students become strong writers, so all our content is completely free to use with an unlimited number of students.</p>
        </div>
        <div>
        <div className="welcome-modal-demo welcome-modal-card">
          <img alt="Teacher at projector in classroom" src="https://assets.quill.org/images/pages/dashboard/illustrations-classroom-activities.svg" />
          <h4>Try a Demo</h4>
          <p>Play around with a fully loaded demo to see sample student data and reports.</p>
          <button className="quill-button contained primary medium" onClick={goToDemo}>Start exploring</button>
        </div>
        <div className="welcome-modal-card welcome-modal-go">
          <img alt="Teacher at projector in classroom" src="https://assets.quill.org/images/pages/dashboard/illustrations-classroom-activities.svg" />
          <h4>Start setting up</h4>
          <p>Ready to set up your own classes? Jump right into your account.</p>
          <button className="quill-button contained primary medium" onClick={close} type="button">Let&apos;s go!</button>
        </div>
        </div>
      </div>
    </div>
  </div>)
}

export default WelcomeModal
