import * as React from 'react'
import Pusher from 'pusher-js';

import ButtonLoadingIndicator from '../shared/button_loading_indicator'
import { requestPut } from '../../../../modules/request/index';

const smallWhiteCheckSrc = `${import.meta.env.VITE_PROCESS_ENV_CDN_URL}/images/shared/check-small-white.svg`

interface ImportGoogleClassroomStudentsModalProps {
  close: () => void;
  onSuccess: (snackbarCopy: string) => void;
  classroom: any;
}

interface ImportGoogleClassroomStudentsModalState {
  checkboxOne?: boolean;
  waiting: boolean;
}

export default class ImportGoogleClassroomStudentsModal extends React.Component<ImportGoogleClassroomStudentsModalProps, ImportGoogleClassroomStudentsModalState> {
  constructor(props) {
    super(props)

    this.state = {
      checkboxOne: false,
      waiting: false
    }

    this.handleToggleCheckbox = this.handleToggleCheckbox.bind(this)
    this.handleImportStudents = this.handleImportStudents.bind(this)
  }

  initializePusherForGoogleStudentImport(id) {
    if (import.meta.env.RAILS_ENV === 'development') {
      Pusher.logToConsole = true;
    }
    const pusher = new Pusher(import.meta.env.PUSHER_KEY, { encrypted: true, });
    const channelName = String(id)
    const channel = pusher.subscribe(channelName);
    const { onSuccess } = this.props

    channel.bind('google-classroom-students-imported', () => {
      onSuccess('Class re-synced')
      pusher.unsubscribe(channelName)
    });

    channel.bind('google-account-reauthorization-required', () => {
      onSuccess('Reauthorization needed from Google account before student import can be completed.')
      pusher.unsubscribe(channelName)
    });
  }

  handleImportStudents() {
    const { classroom, } = this.props
    this.setState({ waiting: true })
    requestPut(`/teachers/classrooms/${classroom.id}/import_google_students`, {}, (body) => {
      this.initializePusherForGoogleStudentImport(body.id)
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

  handleToggleCheckbox() {
    const { checkboxOne } = this.state
    const newStateObj = { checkboxOne: !checkboxOne }
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

  renderImportButton() {
    const { waiting } = this.state
    if (waiting) {
      return (
        <button className={this.submitButtonClass()} type="button">
          <ButtonLoadingIndicator />
        </button>
      )
    } else {
      return (
        <button className={this.submitButtonClass()} onClick={this.handleImportStudents} type="button">
          Import students
        </button>
      )
    }
  }

  render() {
    const { classroom, close } = this.props
    return (
      <div className="modal-container import-google-classroom-students-modal-container">
        <div className="modal-background" />
        <div className="import-google-classroom-students-modal quill-modal modal-body">
          <div>
            <h3 className="title">Import students from Google Classroom</h3>
          </div>
          <p>You are about to import students from the class {classroom.name}.</p>
          {this.renderCheckboxes()}
          <div className="form-buttons">
            <button className="quill-button outlined secondary medium" onClick={close} type="button">
            Cancel
            </button>
            {this.renderImportButton()}
          </div>
        </div>
      </div>
    )
  }
}
