import * as React from 'react'
import request from 'request'
import getAuthToken from '../../../components/modules/get_auth_token'
import { Card } from '../../../../Shared/index'

import AssignActivityPackBanner from '../assignActivityPackBanner'

const studentPencilImg = `${process.env.CDN_URL}/images/onboarding/student-pencil.svg`
const teacherChalkboardImg = `${process.env.CDN_URL}/images/onboarding/teacher-chalkboard.svg`

class SelectUserType extends React.Component {
  setRoleOnSession = (role) => {
    request.post(`${process.env.DEFAULT_URL}/account/role`, {
      json: {
        role,
        authenticity_token: getAuthToken(),
      }, }, (e) => {
      if (e) {
        this.setRoleOnSessionError()
      } else {
        window.location = `/sign-up/${role}`;
      }
    }
    )
  }

  setRoleOnSessionError = () => {
    alert('We had trouble setting your role. Please let us know if the problem persists.');
  }

  handleClickStudent = () => {
    this.setRoleOnSession('student');
  }

  handleClickTeacher = () => {
    this.setRoleOnSession('teacher');
  }

  handleKeyDownOnLogIn = (e) => {
    if (e.key !== 'Enter') { return }

    this.handleLogInClick()
  }

  handleLogInClick = (e) => {
    window.location.href = '/session/new'
  }

  render() {
    return (
      <div>
        <AssignActivityPackBanner />
        <div className="container account-form" id='user-type'>
          <h1>Welcome! Let&#39;s create your account. Choose one.</h1>
          <div className="quill-cards">
            <Card
              header="Student"
              imgAlt="Pencil writing"
              imgSrc={studentPencilImg}
              onClick={this.handleClickStudent}
              text="Select this option to join your teacher’s class and complete assigned activities."
            />
            <Card
              header="Teacher or Guardian"
              imgAlt="Chalkboard"
              imgSrc={teacherChalkboardImg}
              onClick={this.handleClickTeacher}
              text="Select this option to create classes, assign activities, and view reports."
            />
          </div>
          <div className="agreements-and-link-to-login">
            <p className="return-to-login">Already have an account?
              <span className="inline-link" onClick={this.handleLogInClick} onKeyDown={this.handleKeyDownOnLogIn} role="link" tabIndex={0}>Log in</span></p>
          </div>
        </div>
      </div>
    )
  }
}
export default SelectUserType
