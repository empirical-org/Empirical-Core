import * as React from 'react'
import { Card, networkIcon, STUDENT, TEACHER, INDIVIDUAL_CONTRIBUTOR } from '../../../../Shared/index'

import AssignActivityPackBanner from '../assignActivityPackBanner'
import { requestPost, } from '../../../../../modules/request/index'

const studentPencilImg = `${process.env.CDN_URL}/images/onboarding/student-pencil-colored.svg`
const teacherChalkboardImg = `${process.env.CDN_URL}/images/onboarding/teacher-chalkboard-colored.svg`
const homeSchoolImg = `${process.env.CDN_URL}/images/onboarding/home-building-colored.svg`

class SelectUserType extends React.Component {
  setRoleOnSession = (role) => {
    requestPost(`${process.env.DEFAULT_URL}/account/role`, { role, },
      (body) => {
        window.location = `/sign-up/${role}`;
      },
      (body) => {
        this.setRoleOnSessionError()
      }
    )
  }

  setRoleOnSessionError = () => {
    alert('We had trouble setting your role. Please let us know if the problem persists.');
  }

  handleClickStudent = () => {
    this.setRoleOnSession(STUDENT);
  }

  handleClickTeacher = () => {
    this.setRoleOnSession(TEACHER);
  }

  handleClickIndividualContributor = () => {
    this.setRoleOnSession(INDIVIDUAL_CONTRIBUTOR);
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
          <img alt={networkIcon.alt} className="network-icon" src={networkIcon.src} />
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
              header="K-12 Teacher"
              imgAlt="Chalkboard"
              imgSrc={teacherChalkboardImg}
              onClick={this.handleClickTeacher}
              text="Select this option to create classes, assign activities, and view reports."
            />
            <Card
              header="Parent, Tutor or Caregiver"
              imgAlt="home"
              imgSrc={homeSchoolImg}
              onClick={this.handleClickIndividualContributor}
              text="Select this option to assign activities and view reports for your individual student(s)."
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
