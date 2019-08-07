import * as React from 'react'
const emptyClassSrc = `${process.env.CDN_URL}/images/illustrations/empty-class.svg`

interface GoogleClassroomsEmptyModalProps {
  close: () => void;
}

export default class GoogleClassroomsEmptyModal extends React.Component<GoogleClassroomsEmptyModalProps, {}> {
  render() {
    return <div className="modal-container google-classrooms-empty-modal-container">
      <div className="modal-background" />
      <div className="google-classrooms-empty-modal modal modal-body">
        <div>
          <h3 className="title">Create classes in Google Classroom</h3>
        </div>
        <div className="no-active-classes">
          <img src={emptyClassSrc} />
          <p>No classes are available to import yet. Go to Google Classroom and create classes to import them into Quill.</p>
        </div>
        <div className="form-buttons">
          <button className="quill-button contained primary medium" onClick={this.props.close}>Close</button>
        </div>
      </div>
    </div>
  }
}
