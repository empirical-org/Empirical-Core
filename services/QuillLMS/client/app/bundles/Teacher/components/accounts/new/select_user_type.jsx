import * as React from 'react'
import request from 'request'
import getAuthToken from '../../../components/modules/get_auth_token'

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
    this.setRoleOnSession('student');
  }

  setTeacherRoleOnSession() {
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

  render () {
    return (
      <div id='user-type'>
        <h1>Welcome! Let's create your account. Are you a student or a teacher?</h1>
        <div className="cards">
          <div className="card" onClick={this.setStudentRoleOnSession}>
            <img src={studentPencilImg} />
            <div className="text">
              <h3>Student</h3>
              <p>Select this option to join your teacher’s class and complete assigned activities.</p>
            </div>
          </div>
          <div className="card" onClick={this.setTeacherRoleOnSession}>
            <img src={teacherChalkboardImg} />
            <div className="text">
              <h3>Teacher</h3>
              <p>Select this option to create classes, assign activities, and view reports.</p>
            </div>
          </div>
        </div>
        <p className="return-to-login">Already have an account? <a href="/session/new">Log in</a></p>
      </div>
    )
    // return (
    //   <div className='container account-form' id='sign-up'>
    //     <div className='row sign_up_select_role'>
    //         <div className='row'>
    //           <h3 className='col-xs-12'>
    //             Sign up for Quill as:
    //           </h3>
    //         </div>
    //         <div className='option-wrapper'>
    //           <Link to="#">
    //             <button onClick={this.setTeacherRoleOnSession} className='button-green'>
    //               Educator
    //             </button>
    //           </Link>
    //           <Link to="#">
    //             <button onClick={this.setStudentRoleOnSession} className='button-green'>
    //               Student
    //             </button>
    //           </Link>
    //         </div>
    //         <div className='row'>
    //           <div className='col-xs-12'>Already signed up? <a href='/session/new'>Return to Login</a></div>
    //         </div>
    //     </div>
    //   </div>
    // )
  }
}
export default SelectUserType
