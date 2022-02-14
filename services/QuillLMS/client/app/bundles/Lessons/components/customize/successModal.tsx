import * as React from 'react'
import { Link } from 'react-router-dom'

const PublishSuccessModal: React.SFC<any> = (props) => {
  return (
    <div className="publish-success-modal-container">
      <div className="publish-success-modal-background" />
      <div className="publish-success-modal">
        <img alt="" src="https://assets.quill.org/images/illustrations/edition-published.svg" />
        <h1>Lesson Edition Published!</h1>
        <p className="explanation">You have successfully created and published your own edition of the lesson.</p>
        <div className="fields">
          <div className="activity-name-section">
            <p>Activity Name</p>
            <h2>{props.activityName}</h2>
          </div>
          <div className="dividing-line" />
          <div className="edition-name-section">
            <p>Edition Name</p>
            <h2>{props.editionName}</h2>
          </div>
        </div>
        <Link className="button-link" to={props.editionLink}>View My Edition</Link>
        <Link to={props.backLink}>Back to Customizing Edition</Link>
      </div>
    </div>
  )
}

export default PublishSuccessModal
