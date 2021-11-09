import * as React from 'react'

const classroomActivitiesSrc = `${process.env.CDN_URL}/images/pages/dashboard/illustrations-classroom-activities.svg`
const exploreDemoLink = `${process.env.DEFAULT_URL}/teachers/view_demo`

function goToDemo() {
  window.location.href = exploreDemoLink
}

const DemoModal = ({ close, size }) => {
  const { width, height } = size;

  return (<div className="modal-container welcome-modal-container">
    <div className="modal-background" />
    <div className="quill-modal">
      <div className="modal-body">
        <h1>Explore Demo!</h1>
        <div className="modal-text">
          <p>Our mission as a non-profit is to help students become strong writers, so all our content is completely free to use with an unlimited number of students.</p>
        </div>
        <button className="quill-button contained primary medium" onClick={goToDemo} type="button">Let&apos;s go!</button>
      </div>
      <img alt="Teacher at projector in classroom" src={classroomActivitiesSrc} />
    </div>
  </div>)
}

export default DemoModal
