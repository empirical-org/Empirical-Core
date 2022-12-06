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
  handleArchiveClassButtonClick = () => {
    const { onSuccess, classroom } = this.props
    requestPost(`/teachers/classrooms/${classroom.id}/hide`, null, () => {
      onSuccess('Class archived')
    })
  }

  render() {
    const { classroom, close, } = this.props
    const supportLink = <a href="https://support.quill.org/getting-started-for-teachers/manage-classes/how-can-i-manage-my-classes-and-student-profiles" target="_blank">Learn more</a>  //eslint-disable-line react/jsx-no-target-blank
    return (
      <div className="modal-container archive-class-modal-container">
        <div className="modal-background" />
        <div className="archive-class-modal quill-modal modal-body">
          <div>
            <h3 className="title">Archive this class?</h3>
          </div>
          <div className="archive-class-modal-text">
            <p>If you archive the class {classroom.name}, students in this class will no longer be able to access activities. You can view this class in &#34;Archived Classes&#34; under the &#34;Classes&#34; tab.</p>
            {supportLink}
          </div>
          <div className="form-buttons">
            <button className="quill-button outlined secondary medium" onClick={close} type="button">Cancel</button>
            <button className="quill-button contained primary medium" onClick={this.handleArchiveClassButtonClick} type="button">Archive</button>
          </div>
        </div>
      </div>
    )
  }
}
