import Pusher from 'pusher-js';
import * as React from 'react';

import { requestPut } from '../../../../modules/request/index';
import ButtonLoadingIndicator from '../shared/button_loading_indicator';

const smallWhiteCheckSrc = `${process.env.CDN_URL}/images/shared/check-small-white.svg`

interface importCleverClassroomStudentsModalProps {
  close: () => void;
  onSuccess: (snackbarCopy: string) => void;
  classroom: any;
}

interface importCleverClassroomStudentsModalState {
  checkboxOne?: boolean;
  waiting: boolean;
}

export default class importCleverClassroomStudentsModal
  extends React.Component<importCleverClassroomStudentsModalProps, importCleverClassroomStudentsModalState> {

  constructor(props) {
    super(props)

    this.state = {
      checkboxOne: false,
      waiting: false
    }
  }

  initializePusherForCleverStudentimport(userId) {
    if (process.env.RAILS_ENV === 'development') {
      Pusher.logToConsole = true;
    }
    const pusher = new Pusher(process.env.PUSHER_KEY, { encrypted: true, });
    const channelName = String(userId)
    const channel = pusher.subscribe(channelName);
    const { onSuccess } = this.props

    channel.bind('clever-classroom-students-imported', () => {
      onSuccess('Class re-synced')
      pusher.unsubscribe(channelName)
    });
  }

  handleimportStudents = () => {
    const { classroom, } = this.props
    this.setState({ waiting: true })

    requestPut(`/clever_integration/teachers/import_students`, { selected_classroom_ids: [classroom.id] }, body => {
      this.initializePusherForCleverStudentimport(body.user_id)
    })
  }

  submitButtonClass() {
    const { checkboxOne, } = this.state
    let buttonClass = 'quill-button contained primary medium';
    if (!checkboxOne) {
      buttonClass += ' disabled';
    }
    return buttonClass;
  }

  handleToggleCheckbox = () => {
    const { checkboxOne } = this.state
    const newStateObj = { checkboxOne: !checkboxOne, }
    this.setState(newStateObj)
  }

  renderCheckbox() {
    const { checkboxOne } = this.state

    if (checkboxOne) {
      return (
        <div className="quill-checkbox selected" onClick={this.handleToggleCheckbox}>
          <img alt="check" src={smallWhiteCheckSrc} />
        </div>
      )
    } else {
      return <div className="quill-checkbox unselected" onClick={this.handleToggleCheckbox} />
    }
  }

  renderCheckboxes() {
    return (
      <div className="checkboxes">
        <div className="checkbox-row">
          {this.renderCheckbox()}
          <span>
            I understand that newly imported students have access to the activities that have already been assigned to
            the entire class.
          </span>
        </div>
      </div>
    )
  }

  renderimportButton() {
    const { waiting } = this.state
    if (waiting) {
      return (
        <button className={this.submitButtonClass()} type="button">
          <ButtonLoadingIndicator />
        </button>
      )
    } else {
      return (
        <button className={this.submitButtonClass()} onClick={this.handleimportStudents} type="button">
          import students
        </button>
      )
    }
  }

  render() {
    const { classroom, close } = this.props
    return (
      <div className="modal-container import-clever-classroom-students-modal-container">
        <div className="modal-background" />
        <div className="import-clever-classroom-students-modal quill-modal modal-body">
          <div>
            <h3 className="title">
              import students from Clever
            </h3>
          </div>
          <p>You are about to import students from the class {classroom.name}.</p>
          {this.renderCheckboxes()}
          <div className="form-buttons">
            <button className="quill-button outlined secondary medium" onClick={close} type="button">
              Cancel
            </button>
            {this.renderimportButton()}
          </div>
        </div>
      </div>
    )
  }
}
