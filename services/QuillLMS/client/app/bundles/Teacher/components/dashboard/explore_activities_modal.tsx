import * as React from 'react'

const ExploreActivitiesModal = (props) => {
  return <div className="modal-container explore-activities-modal-container">
    <div className="modal-background" />
    <div className="explore-activities-modal quill-modal modal-body">
      <div>
        <h3 className="title">Find the perfect writing activities</h3>
      </div>
      <div className="explore-activities-modal-text">
        <p>To get started, explore our library of activities or assign a diagnostic. You will then be able to create a class and add students. All of Quill's content is completely free to use with an unlimited number of students.</p>
      </div>
      <div className="form-buttons">
        <button className="quill-button outlined secondary medium" onClick={props.cancel}>Not now</button>
        <a href="/assign" className="quill-button contained primary medium">Explore activities</a>
      </div>
    </div>
  </div>
}

export default ExploreActivitiesModal
