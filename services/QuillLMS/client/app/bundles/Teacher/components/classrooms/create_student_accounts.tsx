import * as React from 'react'

import ButtonLoadingIndicator from '../shared/button_loading_indicator'
import { Input, DataTable, } from '../../../Shared/index'

import { requestPost } from '../../../../modules/request/index';

interface CreateStudentAccountsProps {
  next: () => void;
  back: (event) => void;
  classroom: any;
  setStudents: (event) => void;
}

interface CreateStudentAccountsState {
  firstName: string,
  lastName: string,
  students: Array<{ name: string, username: string, password: string, id?: string|number }>,
  waiting: boolean
}

const tableHeaders = [{
  name: 'Name',
  attribute: 'name',
  width: '161px'
},
{
  name: 'Username',
  attribute: 'username',
  width: '267px'
},
{
  name: 'Password',
  attribute: 'password',
  width: '148px'
}
]

export default class CreateStudentAccounts extends React.Component<CreateStudentAccountsProps, CreateStudentAccountsState> {

  constructor(props) {
    super(props)

    this.state = {
      firstName: '',
      lastName: '',
      students: [],
      waiting: false
    }

    this.allStudents = this.allStudents.bind(this)
    this.handleFirstNameChange = this.handleFirstNameChange.bind(this)
    this.handleLastNameChange = this.handleLastNameChange.bind(this)
    this.removeStudent = this.removeStudent.bind(this)
    this.addStudent = this.addStudent.bind(this)
    this.createStudents = this.createStudents.bind(this)

    this.firstNameInput = React.createRef()
    this.lastNameInput = React.createRef()
  }

  firstNameInput: React.RefObject<Input>;
  lastNameInput: React.RefObject<Input>;

  allStudents() {
    const { students } = this.state
    const { classroom } = this.props
    return students.concat(classroom.students ? classroom.students : [])
  }

  correctedNameString(string) {
    return string.replace(/\W|\s/g, '-');
  }

  handleFirstNameChange(e) {
    this.setState({ firstName: e.target.value })
  }

  handleLastNameChange(e) {
    this.setState({ lastName: e.target.value })
  }

  removeStudent(username) {
    const { students } = this.state
    const newStudents = students.filter(s => s.username !== username)
    this.setState({ students: newStudents })
  }

  footerButtonClass() {
    let buttonClass = 'quill-button contained primary medium';
    if (!this.allStudents().length) {
      buttonClass += ' disabled';
    }
    return buttonClass;
  }

  submitClass() {
    let buttonClass = 'quill-button outlined secondary medium submit-button';
    if (!this.state.firstName.length || !this.state.lastName.length) {
      buttonClass += ' disabled';
    }
    return buttonClass;
  }

  createStudents() {
    const { classroom, next, setStudents, } = this.props
    this.setState({ waiting: true })
    requestPost(`/teachers/classrooms/${classroom.id}/create_students`, { students: this.state.students }, (body) => {
      setStudents(body.students)
      next()
    })
  }

  addStudent(e) {
    e.preventDefault()
    const { firstName, lastName, students } = this.state
    if (firstName.length && lastName.length) {
      const passwordifiedLastName = this.correctedNameString(lastName)
      const password = passwordifiedLastName.charAt(0).toUpperCase() + passwordifiedLastName.substring(1)
      const newStudent = {
        name: `${firstName} ${lastName}`,
        password,
        username: this.generateUsername()
      }
      const newStudentsArray = [newStudent].concat(students)
      this.setState({ firstName: '', lastName: '', students: newStudentsArray })
      this.firstNameInput.current.handleInputContainerClick()
      this.lastNameInput.current.deactivateInput()
    }
  }

  generateUsername(number=0) {
    const { firstName, lastName, } = this.state
    const { classroom } = this.props
    const correctedFirstName = this.correctedNameString(firstName).toLowerCase()
    const correctedLastName = this.correctedNameString(lastName).toLowerCase()
    let username = `${correctedFirstName}.${correctedLastName}${number ? number : ''}@${classroom.code}`
    if (!this.allStudents().find(student => student.username === username)) {
      return username
    } else {
      return this.generateUsername(number + 1)
    }
  }

  renderTable() {
    const allStudents = this.allStudents()
    if (allStudents.length) {
      const studentRows = []
      allStudents.forEach(s => {
        if (s.id) {
          studentRows.push(s)
        } else {
          const newStudent = Object.assign({}, {...s}, { id: s.username, removable: true })
          studentRows.push(newStudent)
        }
      })
      return (
        <DataTable
          headers={tableHeaders}
          removeRow={this.removeStudent}
          rows={studentRows}
          showRemoveIcon={true}
        />
      )
    }
  }

  renderBody() {
    const { firstName, lastName, } = this.state
    return (
      <div className="create-a-class-modal-body modal-body create-students">
        <h3 className="title">Create accounts for your students</h3>
        <form onSubmit={this.addStudent}>
          <Input
            characterLimit={50}
            className="first-name"
            handleChange={this.handleFirstNameChange}
            id="first-name"
            label="First name"
            ref={this.firstNameInput}
            type="text"
            value={firstName}
          />
          <Input
            characterLimit={50}
            className="last-name"
            handleChange={this.handleLastNameChange}
            label="Last name"
            ref={this.lastNameInput}
            type="text"
            value={lastName}
          />
          <input className={this.submitClass()} name="commit" type="submit" value="Add" />
        </form>
        {this.renderTable()}
      </div>
    )
  }

  renderFooter() {
    const { back } = this.props
    const { waiting } = this.state
    let nextButton = <button className={this.footerButtonClass()} onClick={this.createStudents}>Next</button>
    if (waiting) {
      nextButton = <button className={this.footerButtonClass()}><ButtonLoadingIndicator /></button>
    }
    return (
      <div className="create-a-class-modal-footer with-back-button">
        <button className="quill-button secondary outlined medium" onClick={back}>Back</button>
        {nextButton}
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
