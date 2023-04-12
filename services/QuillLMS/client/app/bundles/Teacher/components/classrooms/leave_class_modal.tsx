import * as React from 'react';

import { requestDelete } from '../../../../modules/request/index';

interface LeaveClassModalProps {
  close: () => void;
  onSuccess: (string) => void;
  classroom: any;
}

interface LeaveClassModalState {
}

export default class LeaveClassModal extends React.Component<LeaveClassModalProps, LeaveClassModalState> {
  constructor(props) {
    super(props)

    this.leaveClass = this.leaveClass.bind(this)
  }

  leaveClass() {
    const { onSuccess, classroom, close } = this.props
    requestDelete(`/classrooms_teachers/destroy/${classroom.id}`, null, () => {
      onSuccess('Left class')
      close()
    })
  }

  render() {
    return (
      <div className="modal-container leave-class-modal-container">
        <div className="modal-background" />
        <div className="leave-class-modal quill-modal modal-body">
          <div>
            <h3 className="title">Leave class?</h3>
          </div>
          <div className="leave-class-modal-text">
            <p>You won't be able to view or manage this class unless you're re-invited.</p>
          </div>
          <div className="form-buttons">
            <button className="quill-button outlined secondary medium" onClick={this.props.close}>Cancel</button>
            <button className="quill-button contained primary medium" onClick={this.leaveClass}>Leave class</button>
          </div>
        </div>
      </div>
    )
  }
}
