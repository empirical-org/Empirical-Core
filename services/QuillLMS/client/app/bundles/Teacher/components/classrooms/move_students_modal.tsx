import * as React from 'react'

import { DropdownInput } from 'quill-component-library/dist/componentLibrary'

import { requestPost } from '../../../../modules/request/index.js';

const smallWhiteCheckSrc = `${process.env.CDN_URL}/images/shared/check-small-white.svg`

type CheckboxNames = 'checkboxOne'|'checkboxTwo'|'checkboxThree'

interface MoveStudentsModalProps {
  close: () => void;
  onSuccess: (string) => void;
  selectedStudentIds: any;
  classroom: any;
  classrooms: Array<any>;
}

interface MoveStudentsModalState {
  newClassroomId?: string|number;
  checkboxOne?: boolean;
}

export default class MoveStudentsModal extends React.Component<MoveStudentsModalProps, MoveStudentsModalState> {
  constructor(props) {
    super(props)

    this.state = {
      checkboxOne: false
    }

    this.handleClassroomChange = this.handleClassroomChange.bind(this)
    this.toggleCheckbox = this.toggleCheckbox.bind(this)
    this.moveStudents = this.moveStudents.bind(this)
  }

  studentOrStudents() {
    const { selectedStudentIds, } = this.props
    return selectedStudentIds.length === 1 ? 'student' : 'students'
  }

  classroomOptions() {
    const { classrooms } = this.props
    return classrooms.map(classroom => {
      return {
        label: classroom.name,
        value: classroom.id
      }
    })
  }

  handleClassroomChange(option) {
    this.setState({ newClassroomId: option.value })
  }

  moveStudents() {
    const { onSuccess, close, classroom, selectedStudentIds, classrooms, } = this.props
    const { newClassroomId, } = this.state
    requestPost(`/teachers/classrooms/${classroom.id}/students/move_students`, { new_classroom_id: newClassroomId, student_ids: selectedStudentIds }, (body) => {
      const newClassroom = classrooms.find(classroom => classroom.id === newClassroomId)
      const successMessage = `${this.studentOrStudents()} moved to ${newClassroom.name}`
      onSuccess(successMessage)
      close()
    })
  }

  submitButtonClass() {
    const { newClassroomId, checkboxOne, } = this.state
    let buttonClass = 'quill-button contained primary medium';
    if (!(newClassroomId && checkboxOne)) {
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
        <span>I understand that any activities that have not been started will not be transferred.</span>
      </div>
    </div>)
  }

  render() {
    const { classroom, selectedStudentIds, close } = this.props
    const { newClassroomId } = this.state
    const numberOfSelectedStudents = selectedStudentIds.length
    const classroomOptions = this.classroomOptions()
    const classroomOptionsForDropdown = classroomOptions.filter(opt => opt.value !== classroom.id)
    return <div className="modal-container move-students-modal-container">
      <div className="modal-background" />
      <div className="move-students-modal modal modal-body">
        <div>
          <h3 className="title">Move {numberOfSelectedStudents} {this.studentOrStudents()} to a new class</h3>
        </div>
        <p>All of the data from the activities that your {numberOfSelectedStudents === 1 ? 'student has' :'students have'} started or completed will be moved.</p>
        <DropdownInput
          label="Class"
          value={classroomOptions.find(co => co.value === newClassroomId)}
          options={classroomOptionsForDropdown}
          handleChange={this.handleClassroomChange}
          className="class"
        />
        {this.renderCheckboxes()}
        <div className="form-buttons">
          <button className="quill-button outlined secondary medium" onClick={close}>Cancel</button>
          <button className={this.submitButtonClass()} onClick={this.moveStudents}>Move {this.studentOrStudents()}</button>
        </div>
      </div>
    </div>
  }
}
