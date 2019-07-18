import * as React from 'react'
import { Input, DataTable } from 'quill-component-library/dist/componentLibrary'

import { requestPost } from '../../../../modules/request/index.js';

interface CreateStudentAccountsProps {
  next: Function;
  classroom: any;
}

interface CreateStudentAccountsState {
  firstName: string,
  lastName: string,
  students: Array<{ name: string, username: string, password: string }>
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
      students: []
    }

    this.handleFirstNameChange = this.handleFirstNameChange.bind(this)
    this.handleLastNameChange = this.handleLastNameChange.bind(this)
    this.removeStudent = this.removeStudent.bind(this)
    this.addStudent = this.addStudent.bind(this)
    this.createStudents = this.createStudents.bind(this)
  }

  correctedNameString(string) {
    return string.replace(/\W|\s/g, '-')
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
    const { students } = this.state
    let buttonClass = 'quill-button contained primary medium';
    if (!students.length) {
      buttonClass += ' disabled';
    }
    return buttonClass;
  }

  submitClass() {
    let buttonClass = 'quill-button outlined secondary medium';
    if (!this.state.firstName.length || !this.state.lastName.length) {
      buttonClass += ' disabled';
    }
    return buttonClass;
  }

  createStudents() {
    const { classroom, next, } = this.props
    requestPost(`/teachers/classrooms/${this.props.classroom.id}/create_students`, { students: this.state.students }, (body) => {
      this.props.next()
    })
  }

  addStudent(e) {
    e.preventDefault()
    const { firstName, lastName, students } = this.state
    const newStudent = {
      name: `${firstName} ${lastName}`,
      password: this.correctedNameString(lastName),
      username: this.generateUsername()
    }
    const newStudentsArray = [newStudent].concat(students)
    this.setState({ firstName: '', lastName: '', students: newStudentsArray })
  }

  generateUsername(number=0) {
    const { firstName, lastName, students } = this.state
    const { classroom } = this.props
    const correctedFirstName = this.correctedNameString(firstName).toLowerCase()
    const correctedLastName = this.correctedNameString(lastName).toLowerCase()
    let username = `${correctedFirstName}.${correctedLastName}${number ? number : ''}@${classroom.code}`
    if (!students.find(student => student.username === username)) {
      return username
    } else {
      return this.generateUsername(number + 1)
    }
  }

  renderTable() {
    const { students } = this.state
    if (students.length) {
      const studentRows = []
      students.forEach(s => {
        const newStudent = Object.assign({}, {...s}, { id: s.username })
        studentRows.push(newStudent)
      })
      return <DataTable
        headers={tableHeaders}
        rows={studentRows}
        removeRow={this.removeStudent}
        showRemoveIcon={true}
      />
    }
  }

  renderBody() {
    const { firstName, lastName, } = this.state
    return <div className="create-a-class-modal-body modal-body create-students">
      <h3 className="title">Create accounts for your students</h3>
      <form onSubmit={this.addStudent}>
        <Input
          label="First name"
          value={firstName}
          handleChange={this.handleFirstNameChange}
          type="text"
          className="first-name"
          characterLimit={50}
        />
        <Input
          label="Last name"
          value={lastName}
          handleChange={this.handleLastNameChange}
          type="text"
          className="last-name"
          characterLimit={50}
        />
        <input type="submit" name="commit" value="Add" className={this.submitClass()} />
      </form>
      {this.renderTable()}
    </div>
  }

  renderFooter() {
    return <div className="create-a-class-modal-footer">
      <button className={this.footerButtonClass()} onClick={this.createStudents}>Next</button>
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
