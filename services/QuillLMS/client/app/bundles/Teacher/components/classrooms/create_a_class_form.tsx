import * as React from 'react'
import { Input, DropdownInput } from 'quill-component-library/dist/componentLibrary'

import GradeOptions from './grade_options'
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

  componentWillMount() {
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
    return <div className="create-a-class-modal-body modal-body">
      <h3 className="title">Create a class</h3>
      <form className="create-a-class-form">
        <Input
          label="Class name"
          value={name}
          handleChange={this.handleNameChange}
          type="text"
          className="name"
          error={errors.name}
          timesSubmitted={timesSubmitted}
          characterLimit={50}
          placeholder="e.g., Ms. Hall's 6th Period"
        />
        <DropdownInput
          label="Grade"
          className="grade"
          value={grade}
          options={GradeOptions}
          handleChange={this.handleGradeChange}
          error={errors.grade}
          helperText="This will not limit the activities you can access."
        />

        <div className="class-code-section">
          <Input
            label="Class code"
            value={code}
            type="text"
            className="code"
            disabled={true}
            helperText="Students use this to join your class."
          />
          <span className="reset" onClick={this.getClassCode}>Reset</span>
        </div>
      </form>
    </div>
  }

  renderFooter() {
    return <div className="create-a-class-modal-footer">
      <button className={this.footerButtonClass()} onClick={this.createClass}>Create class, next</button>
    </div>
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
