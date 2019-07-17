import * as React from 'react'
import { Input } from 'quill-component-library/dist/componentLibrary'
import { DataTable } from './dataTable'

import { requestGet, requestPost } from '../../../../modules/request/index.js';

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

  // getClassCode() {
  //   requestGet('/teachers/classrooms/regenerate_code', (body) => this.setState({ code: body.code }));
  // }

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

  // createClass() {
  //   const { name, grade, code, timesSubmitted } = this.state
  //   const classroom = { name, code, grade: grade.value, }
  //   requestPost('/teachers/classrooms', { classroom, }, (body) => {
  //     if (body && body.errors) {
  //       this.setState({ errors: body.errors, timesSubmitted: timesSubmitted + 1 });
  //     } else {
  //       this.props.setClassroom(body.classroom)
  //       this.props.next()
  //     }
  //   })
  // }

  addStudent() {
    const { firstName, lastName, students } = this.state
    const newStudent = {
      name: `${firstName} ${lastName}`,
      password: lastName,
      username: this.generateUsername()
    }
    const newStudentsArray = [newStudent].concat(students)
    this.setState({ firstName: '', lastName: '', students: newStudentsArray })
  }

  generateUsername(number=null) {
    const { firstName, lastName, students } = this.state
    const { classroom } = this.props
    let username = `${firstName}.${lastName}${number}@${classroom.code}`
    if (!students.find(student => student.username === username)) {
      return username
    } else {
      return this.generateUsername(number ? number + 1 : 1)
    }
  }

  renderTable() {
    const { students } = this.state
    if (students.length) {
      const studentRows = students.map(s => {
        s.id = s.username
        return s
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
    const { firstName, lastName, students } = this.state
    return <div className="create-a-class-modal-body modal-body">
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
      <button className={this.footerButtonClass()} onClick={this.createClass}>Next</button>
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
