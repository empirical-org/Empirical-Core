import * as React from 'react'
import { Card } from '../../../Shared/index'
import { studentsCreate, teacherCreates } from './add_students'

const studentAccountsSrc = `${import.meta.env.VITE_PROCESS_ENV_CDN_URL}/images/illustrations/student-accounts.svg`
const joinLinkSrc = `${import.meta.env.VITE_PROCESS_ENV_CDN_URL}/images/illustrations/join-link.svg`

interface StudentOptionsProps {
  next: (event) => void;
  setStudentOption: Function;
}

export default class StudentOptions extends React.Component<StudentOptionsProps> {

  renderBody() {
    return (
      <div className="create-a-class-modal-body modal-body">
        <h3 className="title">How do you want to add your students?</h3>
        <div className="quill-cards">
          <Card
            header="Students create their own accounts"
            imgSrc={joinLinkSrc}
            onClick={() => { this.props.setStudentOption(studentsCreate) }}
            text="Get a unique link that students can use to create accounts and join your class."
          />
          <Card
            header="Create accounts for students"
            imgSrc={studentAccountsSrc}
            onClick={() => { this.props.setStudentOption(teacherCreates) }}
            text="Create accounts by inputting each student name. You'll get downloadable login information to share with your students."
          />
        </div>
      </div>
    )
  }

  renderFooter() {
    const { next, } = this.props
    return (
      <div className="create-a-class-modal-footer">
        <button className="quill-button secondary outlined medium" onClick={next}>Skip</button>
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
