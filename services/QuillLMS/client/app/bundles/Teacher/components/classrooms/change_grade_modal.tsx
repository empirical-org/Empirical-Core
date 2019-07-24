import * as React from 'react'

import { DropdownInput } from 'quill-component-library/dist/componentLibrary'

import GradeOptions from './grade_options'
import { requestPut } from '../../../../modules/request/index.js';

interface ChangeGradeModalProps {
  close: () => void;
  showSnackbar: (string) => void;
  classroom: any;
}

interface ChangeGradeModalState {
  grade: { label: string, value: string|number };
  timesSubmitted: number;
  errors: { [key:string]: string };
}

export default class ChangeGradeModal extends React.Component<ChangeGradeModalProps, ChangeGradeModalState> {
  constructor(props) {
    super(props)

    this.state = {
      grade: GradeOptions.find(grade => grade.value === props.classroom.grade),
      errors: {},
      timesSubmitted: 0
    }

    this.handleGradeChange = this.handleGradeChange.bind(this)
    this.changeGrade = this.changeGrade.bind(this)
  }

  handleGradeChange(grade) {
    this.setState({ grade })
  }

  changeGrade() {
    const existingClassroom = this.props.classroom
    const { showSnackbar, close, } = this.props
    const { grade, timesSubmitted, } = this.state
    const classroom = { grade: grade.value }
    requestPut(`/teachers/classrooms/${existingClassroom.id}`, { classroom, }, (body) => {
      if (body && body.errors) {
        this.setState({ errors: body.errors, timesSubmitted: timesSubmitted + 1 });
      } else {
        showSnackbar('Class regraded')
        close()
      }
    })
  }

  submitButtonClass() {
    const { classroom } = this.props
    const { grade } = this.state
    let buttonClass = 'quill-button contained primary medium';
    if (classroom.grade === grade.value) {
      buttonClass += ' disabled';
    }
    return buttonClass;
  }

  render() {
    const { classroom } = this.props
    const { grade, errors, timesSubmitted } = this.state
    return <div className="modal-container change-grade-modal-container">
      <div className="modal-background" />
      <div className="change-grade-modal modal modal-body">
        <div>
          <h3 className="title">Change your grade level</h3>
        </div>
        <p>Update the grade level for {classroom.name}</p>
        <DropdownInput
          label="Grade"
          className="grade"
          value={grade}
          options={GradeOptions}
          handleChange={this.handleGradeChange}
          error={errors.grade}
          helperText="This will not limit the activities you can access."
        />
        <div className="form-buttons">
          <button className="quill-button outlined secondary medium" onClick={this.props.close}>Cancel</button>
          <button className={this.submitButtonClass()} onClick={this.changeGrade}>Save</button>
        </div>
      </div>
    </div>
  }
}
