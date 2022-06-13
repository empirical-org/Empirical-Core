import * as React from 'react'
import GradeOptions from './grade_options'
import { Input, DropdownInput, } from '../../../Shared/index'
import { requestGet, requestPost } from '../../../../modules/request/index.js';

interface CreateAClassFormProps {
  next: Function;
  setClassroom: Function;
}

interface CreateAClassFormState {
  name: string;
  code: string;
  grade?: { label: string, value: string };
  timesSubmitted: number;
  errors: { [key:string]: string }
}


export default class CreateAClassForm extends React.Component<CreateAClassFormProps, CreateAClassFormState> {
  constructor(props) {
    super(props)

    this.state = {
      name: '',
      code: ' ',
      grade: null,
      timesSubmitted: 0,
      errors: {}
    }

    this.getClassCode = this.getClassCode.bind(this)
    this.handleGradeChange = this.handleGradeChange.bind(this)
    this.handleNameChange = this.handleNameChange.bind(this)
    this.createClass = this.createClass.bind(this)
  }

  UNSAFE_componentWillMount() {
    this.getClassCode()
  }

  getClassCode() {
    requestGet('/teachers/classrooms/regenerate_code', (body) => this.setState({ code: body.code }));
  }

  footerButtonClass() {
    const { name, grade, code } = this.state
    let buttonClass = 'quill-button contained primary medium';
    if (!name.length || !code.length || !grade) {
      buttonClass += ' disabled';
    }
    return buttonClass;
  }

  handleGradeChange(grade) {
    this.setState({ grade, });
  }

  handleNameChange(event) {
    this.setState({ name: event.target.value })
  }

  createClass() {
    const { name, grade, code, timesSubmitted } = this.state
    const classroom = { name, code, grade: grade.value, }
    requestPost('/teachers/classrooms', { classroom, }, (body) => {
      if (body && body.errors) {
        this.setState({ errors: body.errors, timesSubmitted: timesSubmitted + 1 });
      } else {
        this.props.setClassroom(body.classroom)
        this.props.next()
      }
    })
  }

  renderBody() {
    const { name, grade, code, timesSubmitted, errors } = this.state
    return (
      <div className="create-a-class-modal-body modal-body">
        <h3 className="title">Create a class</h3>
        <form className="create-a-class-form">
          <Input
            characterLimit={50}
            className="name"
            error={errors.name}
            handleChange={this.handleNameChange}
            label="Class name"
            placeholder="e.g., Ms. Hall's 6th Period"
            timesSubmitted={timesSubmitted}
            type="text"
            value={name}
          />
          <DropdownInput
            className="grade"
            error={errors.grade}
            handleChange={this.handleGradeChange}
            helperText="This will not limit the activities you can access."
            label="Grade"
            options={GradeOptions}
            value={grade}
          />

          <div className="class-code-section">
            <Input
              className="code"
              disabled={true}
              helperText="Students use this to join your class."
              label="Class code"
              type="text"
              value={code}
            />
            <span className="reset" onClick={this.getClassCode}>Reset</span>
          </div>
        </form>
      </div>
    )
  }

  renderFooter() {
    return (
      <div className="create-a-class-modal-footer">
        <button className={this.footerButtonClass()} onClick={this.createClass}>Create class, next</button>
      </div>
    )
  }

  render() {
    return (
      <div className="create-a-class-modal-content">
        {this.renderBody()}
        {this.renderFooter()}
      </div>
    )
  }
}
