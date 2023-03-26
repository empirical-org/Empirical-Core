import * as React from 'react';
const emptyClassSrc = `${process.env.CDN_URL}/images/illustrations/empty-class.svg`

interface CleverClassroomsEmptyModalProps {
  close: () => void;
}

export default class CleverClassroomsEmptyModal extends React.Component<CleverClassroomsEmptyModalProps, {}> {
  render() {
    const { close } = this.props

    return (
      <div className="modal-container clever-classrooms-empty-modal-container">
        <div className="modal-background" />
        <div className="clever-classrooms-empty-modal quill-modal modal-body">
          <div>
            <h3 className="title">Create classes in Clever</h3>
          </div>
          <div className="no-active-classes">
            <img alt="empty class" src={emptyClassSrc} />
            <p>No classes are available to import yet. Go to Clever and create classes to import them into Quill.</p>
          </div>
          <div className="form-buttons">
            <button className="quill-button contained primary medium" onClick={close} type="button">Close</button>
          </div>
        </div>
      </div>
    )
  }
}
