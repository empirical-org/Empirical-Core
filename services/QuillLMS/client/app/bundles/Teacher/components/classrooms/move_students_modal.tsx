import * as React from 'react';

import ButtonLoadingIndicator from '../shared/button_loading_indicator';

import { requestPost } from '../../../../modules/request/index';
import { DropdownInput } from '../../../Shared/index';

const smallWhiteCheckSrc = `${import.meta.env.VITE_PROCESS_ENV_CDN_URL}/images/shared/check-small-white.svg`

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
  waiting: boolean;
}

export default class MoveStudentsModal extends React.Component<MoveStudentsModalProps, MoveStudentsModalState> {
  constructor(props) {
    super(props)

    this.state = {
      checkboxOne: false,
      waiting: false
    }

    this.handleClassroomChange = this.handleClassroomChange.bind(this)
    this.toggleCheckbox = this.toggleCheckbox.bind(this)
    this.moveStudents = this.moveStudents.bind(this)
  }

  studentOrStudents() {
    const { selectedStudentIds, } = this.props
    return selectedStudentIds.length === 1 ? 'Student' : 'Students'
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
    this.setState({ waiting: true, })
    requestPost(`/teachers/classrooms/${classroom.id}/students/move_students`, { new_classroom_id: newClassroomId, student_ids: selectedStudentIds }, (body) => {
      const newClassroom = classrooms.find(classroom => classroom.id === newClassroomId)
      const successMessage = `${this.studentOrStudents()} moved to ${newClassroom.name}`
      this.setState({ waiting: false })
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

  toggleCheckbox() {
    this.setState({ checkboxOne: !this.state.checkboxOne})
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
    return (
      <div className="checkboxes">
        <div className="checkbox-row">
          {this.renderCheckbox()}
          <span>I understand that any activities that have not been started will not be transferred.</span>
        </div>
      </div>
    )
  }

  renderSubmitButton() {
    const { waiting, } = this.state
    if (waiting) {
      return <button className={this.submitButtonClass()}><ButtonLoadingIndicator /></button>
    } else {
      return <button className={this.submitButtonClass()} onClick={this.moveStudents}>Move {this.studentOrStudents().toLowerCase()}</button>
    }
  }

  render() {
    const { classroom, selectedStudentIds, close } = this.props
    const { newClassroomId } = this.state
    const numberOfSelectedStudents = selectedStudentIds.length
    const classroomOptions = this.classroomOptions()
    const classroomOptionsForDropdown = classroomOptions.filter(opt => opt.value !== classroom.id)
    return (
      <div className="modal-container move-students-modal-container">
        <div className="modal-background" />
        <div className="move-students-modal quill-modal modal-body">
          <div>
            <h3 className="title">Move {numberOfSelectedStudents} {this.studentOrStudents().toLowerCase()} to a new class</h3>
          </div>
          <p>All of the data from the activities that your {numberOfSelectedStudents === 1 ? 'student has' :'students have'} started or completed will be moved.</p>
          <DropdownInput
            className="class"
            handleChange={this.handleClassroomChange}
            label="Class"
            options={classroomOptionsForDropdown}
            value={classroomOptions.find(co => co.value === newClassroomId)}
          />
          {this.renderCheckboxes()}
          <div className="form-buttons">
            <button className="quill-button outlined secondary medium" onClick={close}>Cancel</button>
            {this.renderSubmitButton()}
          </div>
        </div>
      </div>
    )
  }
}
