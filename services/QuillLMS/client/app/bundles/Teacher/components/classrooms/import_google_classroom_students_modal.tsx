import * as React from 'react'

import { requestGet } from '../../../../modules/request/index.js';

const smallWhiteCheckSrc = `${process.env.CDN_URL}/images/shared/check-small-white.svg`

type CheckboxNames = 'checkboxOne'|'checkboxTwo'|'checkboxThree'

interface ImportGoogleClassroomStudentsModalProps {
  close: () => void;
  onSuccess: (string) => void;
  classroom: any;
}

interface ImportGoogleClassroomStudentsModalState {
  checkboxOne?: boolean;
}

export default class ImportGoogleClassroomStudentsModal extends React.Component<ImportGoogleClassroomStudentsModalProps, ImportGoogleClassroomStudentsModalState> {
  constructor(props) {
    super(props)

    this.state = {
      checkboxOne: false
    }

    this.toggleCheckbox = this.toggleCheckbox.bind(this)
    this.importStudents = this.importStudents.bind(this)
  }

  importStudents() {
    const { onSuccess, close, classroom, } = this.props
    requestGet(`/teachers/classrooms/${classroom.id}/import_google_students`, (body) => {
      onSuccess('Class re-synced')
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

  toggleCheckbox(checkboxNumber: 'checkboxOne'|'checkboxTwo'|'checkboxThree') {
    const newStateObj:{[K in CheckboxNames]?: boolean} = { [checkboxNumber]: !this.state[checkboxNumber], }
    this.setState(newStateObj)
  }

  renderCheckbox(checkboxNumber) {
    const checkbox = this.state[checkboxNumber]
    if (checkbox) {
      return <div className="quill-checkbox selected" onClick={() => this.toggleCheckbox(checkboxNumber)}><img src={smallWhiteCheckSrc} alt="check" /></div>
    } else {
      return <div className="quill-checkbox unselected" onClick={() => this.toggleCheckbox(checkboxNumber)} />
    }
  }

  renderCheckboxes() {
    return (<div className="checkboxes">
      <div className="checkbox-row">
        {this.renderCheckbox('checkboxOne')}
        <span>I understand that newly imported students have access to the activities that have already been assigned to the entire class.</span>
      </div>
    </div>)
  }

  render() {
    const { classroom, close } = this.props
    return <div className="modal-container import-google-classroom-students-modal-container">
      <div className="modal-background" />
      <div className="import-google-classroom-students-modal modal modal-body">
        <div>
          <h3 className="title">Import students from Google Classroom</h3>
        </div>
        <p>You're about to import students from the class {classroom.name}.</p>
        {this.renderCheckboxes()}
        <div className="form-buttons">
          <button className="quill-button outlined secondary medium" onClick={close}>Cancel</button>
          <button className={this.submitButtonClass()} onClick={this.importStudents}>Import students</button>
        </div>
      </div>
    </div>
  }
}
