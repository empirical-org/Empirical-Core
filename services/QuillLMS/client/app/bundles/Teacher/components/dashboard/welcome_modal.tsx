import * as React from 'react'
import Confetti from 'react-confetti'

const classroomActivitiesSrc = `${process.env.CDN_URL}/images/pages/dashboard/illustrations-classroom-activities.svg`

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
        <button className="quill-button contained primary medium" onClick={close} type="button">Let&apos;s go!</button>
      </div>
      <img alt="Teacher at projector in classroom" src={classroomActivitiesSrc} />
    </div>
  </div>)
}

export default WelcomeModal
