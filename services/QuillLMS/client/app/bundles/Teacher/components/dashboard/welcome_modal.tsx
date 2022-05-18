import * as React from 'react'
import Confetti from 'react-confetti'

import { handleHasAppSetting } from "../../../Shared/utils/appSettingAPIs";

const classroomActivitiesSrc = `${process.env.CDN_URL}/images/pages/dashboard/illustrations-classroom-activities-2.svg`

const exploreDemoLink = `${process.env.DEFAULT_URL}/teachers/view_demo`

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

const WelcomeModalWithDemo = ({close}) => (
  <div className="welcome-modal-with-demo quill-modal">
    <div className="modal-head">
      <button className="close-welcome-modal" onClick={close} type="button"><img alt="Close the modal" src={`${process.env.CDN_URL}/images/shared/close_x.svg`} /></button>
    </div>

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
          <a className="quill-button contained focus-on-light secondary medium outlined welcome-modal-demo" href={exploreDemoLink}>Explore demo</a>
          <button className="quill-button contained focus-on-light primary medium welcome-modal-skip" onClick={close} type="button">Maybe later, skip</button>
        </div>
      </div>
    </div>
  </div>
)

const WelcomeModal = ({ close, size }) => {
  const { width, height } = size;
  const [errors, setErrors] = React.useState<string[]>([])
  const [hasAppSetting, setHasAppSetting] = React.useState<boolean>(false);
  React.useEffect(() => {
    handleHasAppSetting({appSettingSetter: setHasAppSetting, errorSetter: setErrors, key: 'demo-welcome-modal', })
  }, []);

  return (
    <div className="modal-container welcome-modal-container">
      <div className="modal-background" />
      <Confetti
        height={height}
        numberOfPieces={700}
        recycle={false}
        width={width}
      />
      {hasAppSetting ? <WelcomeModalWithDemo close={close} /> : <WelcomeModalWithoutDemo close={close} />}
    </div>
  )
}

export default WelcomeModal
