import * as React from 'react'

import GradeOptions from '../../../classrooms/grade_options'
import { Input, DropdownInput, } from '../../../../../Shared/index'
import { requestGet, requestPost } from '../../../../../../modules/request/index.js';

const informationSrc = `${process.env.CDN_URL}/images/icons/information.svg`

interface CreateAClassInlineFormProps {
  onSuccess: (event: any) => void;
  cancel: (event: any) => void;
}

interface CreateAClassInlineFormState {
  name: string;
  code: string;
  grade?: { label: string, value: string };
  timesSubmitted: number;
  errors: { [key:string]: string }
}


export default class CreateAClassInlineForm extends React.Component<CreateAClassInlineFormProps, CreateAClassInlineFormState> {
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

  submitButtonClass() {
    const { name, grade, code, } = this.state
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
    this.setState({ name: event.target.value, })
  }

  createClass() {
    const { name, grade, code, timesSubmitted, } = this.state
    const classroom = { name, code, grade: grade.value, }
    requestPost('/teachers/classrooms', { classroom, }, (body) => {
      if (body && body.errors) {
        this.setState({ errors: body.errors, timesSubmitted: timesSubmitted + 1 });
      } else {
        this.props.onSuccess('Class created')
      }
    })
  }

  renderBody() {
    const { name, grade, code, timesSubmitted, errors, } = this.state
    return (
      <div className="create-a-class-inline-body inline-body">
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
      <div className="create-a-class-inline-footer">
        <div className="info">
          <img alt="the letter I in a circle" src={informationSrc} />
          <span>You’ll invite students after you assign.</span>
        </div>
        <div className="buttons">
          <button className="quill-button medium secondary outlined" onClick={this.props.cancel}>Cancel</button>
          <button className={this.submitButtonClass()} onClick={this.createClass}>Create</button>
        </div>
      </div>
    )
  }

  render() {
    return (
      <div className="create-a-class-inline-content">
        {this.renderBody()}
        {this.renderFooter()}
      </div>
    )
  }
}
