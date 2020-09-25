import * as React from 'react'
import Pusher from 'pusher-js';

import ButtonLoadingIndicator from '../shared/button_loading_indicator'
import { requestPut } from '../../../../modules/request/index.js';

const smallWhiteCheckSrc = `${process.env.CDN_URL}/images/shared/check-small-white.svg`

type CheckboxNames = 'checkboxOne'|'checkboxTwo'|'checkboxThree'

interface ImportGoogleClassroomStudentsModalProps {
  close: () => void;
  onSuccess: (string) => void;
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

    this.toggleCheckbox = this.toggleCheckbox.bind(this)
    this.importStudents = this.importStudents.bind(this)
  }

  initializePusherForGoogleStudentImport(id) {
    if (process.env.RAILS_ENV === 'development') {
      Pusher.logToConsole = true;
    }
    const pusher = new Pusher(process.env.PUSHER_KEY, { encrypted: true, });
    const channelName = String(id)
    const channel = pusher.subscribe(channelName);
    const that = this;
    channel.bind('google-classroom-students-imported', () => {
      that.props.onSuccess('Class re-synced')
      pusher.unsubscribe(channelName)
    });
  }

  importStudents() {
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

  toggleCheckbox() {
    const newStateObj = { checkboxOne: !this.state.checkboxOne, }
    this.setState(newStateObj)
  }

  renderCheckbox() {
    const checkbox = this.state.checkboxOne
    if (checkbox) {
      return <div className="quill-checkbox selected" onClick={this.toggleCheckbox}><img alt="check" src={smallWhiteCheckSrc} /></div>
    } else {
      return <div className="quill-checkbox unselected" onClick={this.toggleCheckbox} />
    }
  }

  renderCheckboxes() {
    return (<div className="checkboxes">
      <div className="checkbox-row">
        {this.renderCheckbox()}
        <span>I understand that newly imported students have access to the activities that have already been assigned to the entire class.</span>
      </div>
    </div>)
  }

  renderImportButton() {
    const { waiting } = this.state
    if (waiting) {
      return <button className={this.submitButtonClass()}><ButtonLoadingIndicator /></button>
    } else {
      return <button className={this.submitButtonClass()} onClick={this.importStudents}>Import students</button>
    }
  }

  render() {
    const { classroom, close } = this.props
    return (<div className="modal-container import-google-classroom-students-modal-container">
      <div className="modal-background" />
      <div className="import-google-classroom-students-modal quill-modal modal-body">
        <div>
          <h3 className="title">Import students from Google Classroom</h3>
        </div>
        <p>You're about to import students from the class {classroom.name}.</p>
        {this.renderCheckboxes()}
        <div className="form-buttons">
          <button className="quill-button outlined secondary medium" onClick={close}>Cancel</button>
          {this.renderImportButton()}
        </div>
      </div>
    </div>)
  }
}
