import * as React from 'react'

import { requestPost } from '../../../../modules/request/index';

interface ArchiveClassModalProps {
  close: () => void;
  onSuccess: (string) => void;
  classroom: any;
}

interface ArchiveClassModalState {
}

export default class ArchiveClassModal extends React.Component<ArchiveClassModalProps, ArchiveClassModalState> {
  constructor(props) {
    super(props)

    this.unarchive = this.unarchive.bind(this)
  }

  unarchive() {
    const { onSuccess, classroom } = this.props
    requestPost(`/teachers/classrooms/${classroom.id}/unhide`, null, () => {
      onSuccess('Class un-archived')
    })
  }

  render() {
    return (
      <div className="modal-container unarchive-class-modal-container">
        <div className="modal-background" />
        <div className="unarchive-class-modal quill-modal modal-body">
          <div>
            <h3 className="title">Un-archive this class?</h3>
          </div>
          <div className="unarchive-class-modal-text">
            <p>You and your students will have access to this class again. This class will move to the "Active Classes" tab.</p>
          </div>
          <div className="form-buttons">
            <button className="quill-button outlined secondary medium" onClick={this.props.close}>Cancel</button>
            <button className="quill-button contained primary medium" onClick={this.unarchive}>Un-archive</button>
          </div>
        </div>
      </div>
    )
  }
}
