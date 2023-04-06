import * as React from 'react';

import { requestPut } from '../../../../modules/request/index';
import { DropdownInput } from '../../../Shared/index';
import GradeOptions from './grade_options';

interface ChangeGradeModalProps {
  close: () => void;
  onSuccess: (string) => void;
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
      grade: GradeOptions.find(grade => [Number(props.classroom.grade), props.classroom.grade].includes(grade.value)),
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
    const { onSuccess, close, } = this.props
    const { grade, timesSubmitted, } = this.state
    const classroom = { grade: grade.value }
    requestPut(`/teachers/classrooms/${existingClassroom.id}`, { classroom, }, (body) => {
      if (body && body.errors) {
        this.setState({ errors: body.errors, timesSubmitted: timesSubmitted + 1 });
      } else {
        onSuccess('Grade changed')
        close()
      }
    })
  }

  submitButtonClass() {
    const { classroom } = this.props
    const { grade } = this.state
    let buttonClass = 'quill-button contained primary medium';
    if (grade && classroom.grade === grade.value) {
      buttonClass += ' disabled';
    }
    return buttonClass;
  }

  render() {
    const { classroom } = this.props
    const { grade, errors, timesSubmitted } = this.state
    return (
      <div className="modal-container change-grade-modal-container">
        <div className="modal-background" />
        <div className="change-grade-modal quill-modal modal-body">
          <div>
            <h3 className="title">Change your grade level</h3>
          </div>
          <p>Update the grade level for {classroom.name}.</p>
          <DropdownInput
            className="grade"
            error={errors.grade}
            handleChange={this.handleGradeChange}
            helperText="This will not limit the activities you can access."
            label="Grade"
            options={GradeOptions}
            value={grade}
          />
          <div className="form-buttons">
            <button className="quill-button outlined secondary medium" onClick={this.props.close}>Cancel</button>
            <button className={this.submitButtonClass()} onClick={this.changeGrade}>Save</button>
          </div>
        </div>
      </div>
    )
  }
}
