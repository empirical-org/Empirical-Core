import * as React from 'react'

import { requestPost } from '../../../../modules/request/index';

const smallWhiteCheckSrc = `${process.env.CDN_URL}/images/shared/check-small-white.svg`

type CheckboxNames = 'checkboxOne'|'checkboxTwo'|'checkboxThree'

interface RemoveStudentsModalProps {
  close: () => void;
  onSuccess: (string) => void;
  selectedStudentIds: any;
  classroom: any;
}

interface RemoveStudentsModalState {
  checkboxOne?: boolean;
}

export default class RemoveStudentsModal extends React.Component<RemoveStudentsModalProps, RemoveStudentsModalState> {
  constructor(props) {
    super(props)

    this.state = {
      checkboxOne: false
    }

    this.toggleCheckbox = this.toggleCheckbox.bind(this)
    this.removeStudents = this.removeStudents.bind(this)
  }

  studentOrStudents() {
    const { selectedStudentIds, } = this.props
    return selectedStudentIds.length === 1 ? 'student' : 'students'
  }

  removeStudents() {
    const { onSuccess, close, classroom, selectedStudentIds, } = this.props
    requestPost(`/teachers/classrooms/${classroom.id}/remove_students`, { student_ids: selectedStudentIds }, (body) => {
      const studentOrStudents = selectedStudentIds.length === 1 ? 'Student' : 'Students'
      const successMessage = `${studentOrStudents} removed`
      onSuccess(successMessage)
      close()
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
      return <div className="quill-checkbox selected" onClick={() => this.toggleCheckbox(checkboxNumber)}><img alt="check" src={smallWhiteCheckSrc} /></div>
    } else {
      return <div className="quill-checkbox unselected" onClick={() => this.toggleCheckbox(checkboxNumber)} />
    }
  }

  renderCheckboxes() {
    return (
      <div className="checkboxes">
        <div className="checkbox-row">
          {this.renderCheckbox('checkboxOne')}
          <span>I understand that I will no longer have access to the students’ work or data.</span>
        </div>
      </div>
    )
  }

  render() {
    const { selectedStudentIds, close } = this.props
    const numberOfSelectedStudents = selectedStudentIds.length
    return (
      <div className="modal-container remove-students-modal-container">
        <div className="modal-background" />
        <div className="remove-students-modal quill-modal modal-body">
          <div>
            <h3 className="title">Remove {numberOfSelectedStudents} {this.studentOrStudents()} from your class?</h3>
          </div>
          <p>Students' Quill accounts will remain active. If you bring students back into the class, the data from their completed activities will be restored.</p>
          {this.renderCheckboxes()}
          <div className="form-buttons">
            <button className="quill-button outlined secondary medium" onClick={close}>Cancel</button>
            <button className={this.submitButtonClass()} onClick={this.removeStudents}>Remove from class</button>
          </div>
        </div>
      </div>
    )
  }
}
