import {
  Link,
} from 'react-router-dom';
import React, { Component } from 'react';

class SelectUserType extends Component {
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
    var that = this;
    $.ajax({
      type: 'POST',
      url: '/account/role',
      data: {
        role: role,
        authenticity_token: $('meta[name=csrf-token]').attr('content')
      },
      success: function () {
          window.location = `/sign-up/${role}`;
      },
      error: this.setRoleOnSessionError
    });
  }

  render () {
    return (
      <div className='container account-form' id='sign-up'>
        <div className='row sign_up_select_role'>
            <div className='row'>
              <h3 className='col-xs-12'>
                Sign up for Quill as:
              </h3>
            </div>
            <div className='option-wrapper'>
              <Link to="#">
                <button onClick={this.setTeacherRoleOnSession} className='button-green'>
                  Educator
                </button>
              </Link>
              <Link to="#">
                <button onClick={this.setStudentRoleOnSession} className='button-green'>
                  Student
                </button>
              </Link>
            </div>
            <div className='row'>
              <div className='col-xs-12'>Already signed up? <a href='/session/new'>Return to Login</a></div>
            </div>
        </div>
      </div>
    )
  }
}
export default SelectUserType
