import * as React from 'react'
import request from 'request'
import { SegmentAnalytics, Events } from '../../../../../modules/analytics'; 
import getAuthToken from '../../../components/modules/get_auth_token'
import { Card } from 'quill-component-library/dist/componentLibrary'

const studentPencilImg = `${process.env.CDN_URL}/images/onboarding/student-pencil.svg`
const teacherChalkboardImg = `${process.env.CDN_URL}/images/onboarding/teacher-chalkboard.svg`

class SelectUserType extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }

    this.setTeacherRoleOnSession = this.setTeacherRoleOnSession.bind(this);
    this.setStudentRoleOnSession = this.setStudentRoleOnSession.bind(this);
    this.setRoleOnSession = this.setRoleOnSession.bind(this);
    this.setRoleOnSessionError = this.setRoleOnSessionError.bind(this);
  }
  setRoleOnSessionError() {
    alert('We had trouble setting your role. Please let us know if the problem persists.');
  }

  setStudentRoleOnSession() {
    SegmentAnalytics.track(Events.CLICK_CREATE_STUDENT_USER);
    this.setRoleOnSession('student');
  }

  setTeacherRoleOnSession() {
    SegmentAnalytics.track(Events.CLICK_CREATE_TEACHER_USER);
    this.setRoleOnSession('teacher');
  }

  setRoleOnSession(role) {
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

  render() {
    return (
      <div className="container account-form" id='user-type'>
        <h1>Welcome! Let's create your account. Are you a student or a teacher?</h1>
        <div className="quill-cards">
          <Card
            onClick={this.setStudentRoleOnSession}
            imgSrc={studentPencilImg}
            imgAlt="pencil"
            header="Student"
            text="Select this option to join your teacher’s class and complete assigned activities."
          />
          <Card
            onClick={this.setTeacherRoleOnSession}
            imgSrc={teacherChalkboardImg}
            imgAlt="chalkboard"
            header="Teacher"
            text="Select this option to create classes, assign activities, and view reports."
          />
        </div>
        <div className="agreements-and-link-to-login">
          <p className="return-to-login">Already have an account?
            <a href="/session/new" onClick={(e) => SegmentAnalytics.track(Events.CLICK_LOG_IN, {location: 'alreadyHaveAccount'})}>Log in</a></p>
        </div>
      </div>
    )
  }
}
export default SelectUserType
