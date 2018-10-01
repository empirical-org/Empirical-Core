import {
  Link,
} from 'react-router-dom';
import React, { Component } from 'react';

class SelectUserType extends Component {
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
              <Link to="/sign-up/teacher">
                <button className='button-green'>
                  Educator
                </button>
              </Link>
              <Link to="/sign-up/student">
                <button className='button-green'>
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
