import * as React from 'react'

import StudentOptions from './student_options'
import ClassCodeLink from './class_code_link'
import CreateStudentAccounts from './create_student_accounts'

export const studentsCreate = 'students create accounts'
export const teacherCreates = 'teacher creates accounts'

interface AddStudentsProps {
  next: (event) => void;
  showSnackbar: (event) => void;
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
  }

  setStudentOption(studentOption) {
    this.setState({ studentOption })
  }

  render() {
    const { next, classroom, showSnackbar } = this.props
    const { studentOption } = this.state
    if (studentOption === studentsCreate) {
      return <ClassCodeLink next={next} classroom={classroom} showSnackbar={showSnackbar} />
    } else if (studentOption === teacherCreates) {
      return <CreateStudentAccounts next={next} classroom={classroom} />
    } else {
      return <StudentOptions next={next} setStudentOption={this.setStudentOption}/>
    }
  }
}
