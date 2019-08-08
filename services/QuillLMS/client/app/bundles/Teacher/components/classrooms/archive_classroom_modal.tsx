import * as React from 'react'

import { requestPost } from '../../../../modules/request/index.js';

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

    this.archiveClass = this.archiveClass.bind(this)
  }

  archiveClass() {
    const { onSuccess, classroom } = this.props
    requestPost(`/teachers/classrooms/${classroom.id}/hide`, null, () => {
      onSuccess('Class archived')
    })
  }

  render() {
    const { classroom } = this.props
    return <div className="modal-container archive-class-modal-container">
      <div className="modal-background" />
      <div className="archive-class-modal modal modal-body">
        <div>
          <h3 className="title">Archive this class?</h3>
        </div>
        <div className="archive-class-modal-text">
          <p>If you archive the class {classroom.name}, students in this class will no longer be able to access activities. You can view this class in "Archived Classes" under the "Classes" tab.</p>
          <a href="https://support.quill.org/getting-started-for-teachers/manage-classes/how-can-i-manage-my-classes-and-student-profiles" target="_blank">Learn more</a>
        </div>
        <div className="form-buttons">
          <button className="quill-button outlined secondary medium" onClick={this.props.close}>Cancel</button>
          <button className="quill-button contained primary medium" onClick={this.archiveClass}>Archive</button>
        </div>
      </div>
    </div>
  }
}
