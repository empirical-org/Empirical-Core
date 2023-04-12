import * as React from 'react'

import ClassCodeLink from './class_code_link'
import CreateStudentAccounts from './create_student_accounts'
import StudentOptions from './student_options'

export const studentsCreate = 'students create accounts'
export const teacherCreates = 'teacher creates accounts'

interface AddStudentsProps {
  next: () => void;
  showSnackbar: (event) => void;
  setStudents: (event) => void;
  classroom: any;
}

interface AddStudentsState {
  studentOption: string;
}

export default class AddStudents extends React.Component<AddStudentsProps, AddStudentsState> {
  constructor(props) {
    super(props)

    this.state = {
      studentOption: null
    }

    this.setStudentOption = this.setStudentOption.bind(this)
    this.unsetStudentOption = this.unsetStudentOption.bind(this)
  }

  setStudentOption(studentOption) {
    this.setState({ studentOption })
  }

  unsetStudentOption() {
    this.setState({ studentOption: null, })
  }

  render() {
    const { next, classroom, showSnackbar, setStudents, } = this.props
    const { studentOption } = this.state
    if (studentOption === studentsCreate) {
      return <ClassCodeLink back={this.unsetStudentOption} classroom={classroom} next={next} showSnackbar={showSnackbar} />
    } else if (studentOption === teacherCreates) {
      return <CreateStudentAccounts back={this.unsetStudentOption} classroom={classroom} next={next} setStudents={setStudents} />
    } else {
      return <StudentOptions next={next} setStudentOption={this.setStudentOption} />
    }
  }
}
