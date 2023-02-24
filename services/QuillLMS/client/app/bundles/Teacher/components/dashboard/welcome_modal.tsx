import * as React from 'react'
import Confetti from 'react-confetti'

import { handleHasAppSetting } from "../../../Shared/utils/appSettingAPIs";

const classroomActivitiesSrc = `${import.meta.env.VITE_PROCESS_ENV_CDN_URL}/images/pages/dashboard/illustrations-classroom-activities-2.svg`

const exploreDemoLink = `${import.meta.env.VITE_DEFAULT_URL}/teachers/view_demo`

const WelcomeModalWithoutDemo = ({close}) => (
  <div className="welcome-modal-without-demo quill-modal">
    <div className="modal-body">
      <h1>Welcome to Quill!</h1>
      <div className="welcome-modal-text">
        <p>Our mission as a non-profit is to help students become strong writers, so all our content is completely free to use with an unlimited number of students.</p>
      </div>
      <button className="quill-button contained focus-on-light primary medium" onClick={close} type="button">Let&apos;s go!</button>
    </div>
    <img alt="Teacher at projector in classroom" src={classroomActivitiesSrc} />
  </div>
)

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
            <div className="text">
              <h1>Welcome to Quill!</h1>
              <p>Our mission as a non-profit is to help students become strong writers, so all our content is completely free to use with an unlimited number of students.</p>
            </div>
            <img alt="Teacher at projector in classroom" src={classroomActivitiesSrc} />
          </div>

          <div className="welcome-modal-option-boxes">
            <div className="welcome-modal-option-box">
              <h2>Try a Demo</h2>
              <p>Play around with a fully loaded demo to see sample student data and reports.</p>
              <a className="quill-button contained primary medium focus-on-light" href={exploreDemoLink}>Start exploring</a>
            </div>

            <div className="welcome-modal-option-box">
              <h2>Start Setting Up</h2>
              <p>Ready to set up your own classes? Jump right into your account.</p>
              <button className="quill-button outlined secondary medium focus-on-light" onClick={close} type="button">Let&#39;s go!</button>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default WelcomeModal
