import * as React from 'react'
import Confetti from 'react-confetti'

const classroomActivitiesSrc = `${process.env.CDN_URL}/images/pages/dashboard/illustrations-classroom-activities-2.svg`

const exploreDemoLink = `${process.env.DEFAULT_URL}/teachers/view_demo`

const WelcomeModal = ({ close, size }) => {
  const { width, height } = size;

  return (
    <div className="modal-container welcome-modal-container">
      <div className="modal-background" />
      <Confetti
        height={height}
        numberOfPieces={700}
        recycle={false}
        width={width}
      />
      <div className="welcome-modal quill-modal">
        <div className="modal-body">
          <div className="welcome-modal-image-box">
            <h1>Welcome to Quill!</h1>
            <img alt="Teacher at projector in classroom" src={classroomActivitiesSrc} />
          </div>
          <div>
            <div className="welcome-modal-text">
              <p className="welcome-modal-header">Want to see Quill&apos;s full potential?</p>
              <p>Play around with a demo account to see sample student data and reports.</p>
            </div>
            <br />
            <div className="welcome-modal-buttons">
              <a className="quill-button contained secondary medium outlined welcome-modal-demo" href={exploreDemoLink}>Explore demo</a>
              <button className="quill-button contained primary medium welcome-modal-skip" onClick={close} type="button">Maybe later, skip</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WelcomeModal
