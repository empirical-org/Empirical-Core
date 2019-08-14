import * as React from 'react'

import { Input } from 'quill-component-library/dist/componentLibrary'

import { requestPut } from '../../../../modules/request/index.js';

interface EditStudentAccountModalProps {
  close: () => void;
  onSuccess: (string) => void;
  student: any;
  classroom: any;
}

interface EditStudentAccountModalState {
  firstName: string;
  lastName: string;
  username: string;
  timesSubmitted: number;
  errors: { [key:string]: string };
}

export default class EditStudentAccountModal extends React.Component<EditStudentAccountModalProps, EditStudentAccountModalState> {
  constructor(props) {
    super(props)

    const splitName = props.student.name.split(' ')
    this.state = {
      firstName: splitName[0],
      lastName: splitName[1],
      username: props.student.username,
      errors: {},
      timesSubmitted: 0
    }

    this.handleFirstNameChange = this.handleFirstNameChange.bind(this)
    this.handleLastNameChange = this.handleLastNameChange.bind(this)
    this.handleUsernameChange = this.handleUsernameChange.bind(this)
    this.editStudentAccount = this.editStudentAccount.bind(this)
  }

  handleFirstNameChange(event) {
    this.setState({ firstName: event.target.value })
  }

  handleLastNameChange(event) {
    this.setState({ lastName: event.target.value })
  }

  handleUsernameChange(event) {
    this.setState({ username: event.target.value })
  }

  editStudentAccount() {
    const { onSuccess, close, student, classroom, } = this.props
    const { firstName, lastName, username, timesSubmitted, } = this.state
    const user = { name: `${firstName} ${lastName}`, username }
    requestPut(`/teachers/classrooms/${classroom.id}/students/${student.id}`, { user, }, (body) => {
      if (body && body.errors) {
        this.setState({ errors: body.errors, timesSubmitted: timesSubmitted + 1 });
      } else {
        onSuccess('Student account saved')
        close()
      }
    })
  }

  submitButtonClass() {
    const { student } = this.props
    const { firstName, lastName, username } = this.state
    let buttonClass = 'quill-button contained primary medium';
    const originalSplitName = student.name.split(' ')
    const nothingHasChanged = originalSplitName[0] === firstName && originalSplitName[1] === lastName && student.username === username
    if (!firstName.length || !lastName.length || !username.length || nothingHasChanged) {
      buttonClass += ' disabled';
    }
    return buttonClass;
  }

  render() {
    const { firstName, lastName, username, errors, timesSubmitted } = this.state
    return <div className="modal-container edit-student-account-modal-container">
      <div className="modal-background" />
      <div className="edit-student-account-modal quill-modal modal-body">
        <div>
          <h3 className="title">Edit your student account</h3>
        </div>
        <Input
          label="First name"
          value={firstName}
          handleChange={this.handleFirstNameChange}
          type="text"
          className="firstName"
          error={errors.firstName}
          timesSubmitted={timesSubmitted}
          characterLimit={50}
        />
        <Input
          label="Last name"
          value={lastName}
          handleChange={this.handleLastNameChange}
          type="text"
          className="lastName"
          error={errors.lastName}
          timesSubmitted={timesSubmitted}
          characterLimit={50}
        />
        <Input
          label="Username"
          value={username}
          handleChange={this.handleUsernameChange}
          type="text"
          className="username"
          error={errors.username}
          timesSubmitted={timesSubmitted}
        />
        <div className="form-buttons">
          <button className="quill-button outlined secondary medium" onClick={this.props.close}>Cancel</button>
          <button className={this.submitButtonClass()} onClick={this.editStudentAccount}>Save</button>
        </div>
      </div>
    </div>
  }
}
