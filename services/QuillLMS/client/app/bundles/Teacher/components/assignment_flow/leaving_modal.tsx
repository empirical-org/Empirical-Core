import * as React from 'react';

import {
    ACTIVITY_IDS_ARRAY,
    CLASSROOMS, UNIT_NAME, UNIT_TEMPLATE_ID, UNIT_TEMPLATE_NAME
} from './assignmentFlowConstants';

interface LeavingModalProps {
  cancel: () => void;
}

interface LeavingModalState {
}

export default class LeavingModal extends React.Component<LeavingModalProps, LeavingModalState> {
  constructor(props) {
    super(props)
  }

  leave() {
    window.localStorage.removeItem(UNIT_TEMPLATE_ID)
    window.localStorage.removeItem(UNIT_TEMPLATE_NAME)
    window.localStorage.removeItem(UNIT_NAME)
    window.localStorage.removeItem(ACTIVITY_IDS_ARRAY)
    window.localStorage.removeItem(CLASSROOMS)
    window.location.href = '/'
  }

  render() {
    return (
      <div className="modal-container leave-class-modal-container">
        <div className="modal-background" />
        <div className="leave-class-modal quill-modal modal-body">
          <div>
            <h3 className="title">Leave without assigning?</h3>
          </div>
          <div className="leave-class-modal-text">
            <p>If you exit the assigning process now, you will not be able to resume your current progress. However, you can assign new content at any time.</p>
          </div>
          <div className="form-buttons">
            <button className="quill-button outlined secondary medium" onClick={this.props.cancel}>Cancel</button>
            <button className="quill-button contained primary medium" onClick={this.leave}>Go to dashboard</button>
          </div>
        </div>
      </div>
    )
  }
}
