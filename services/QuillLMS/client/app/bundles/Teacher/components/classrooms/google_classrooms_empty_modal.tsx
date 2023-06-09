import * as React from 'react';
const emptyClassSrc = `${process.env.CDN_URL}/images/illustrations/empty-class.svg`

interface GoogleClassroomsEmptyModalProps {
  close: () => void;
}

export default class GoogleClassroomsEmptyModal extends React.Component<GoogleClassroomsEmptyModalProps, {}> {
  render() {
    const { close } = this.props

    return (
      <div className="modal-container google-classrooms-empty-modal-container">
        <div className="modal-background" />
        <div className="google-classrooms-empty-modal quill-modal modal-body">
          <div>
            <h3 className="title">Create classes in Google Classroom</h3>
          </div>
          <div className="no-active-classes">
            <img alt="empty class" src={emptyClassSrc} />
            <p>No classes are available to import yet. Go to Google Classroom and create classes to import them into Quill.</p>
          </div>
          <div className="form-buttons">
            <button className="quill-button contained primary medium" onClick={close} type="button">Close</button>
          </div>
        </div>
      </div>
    )
  }
}
