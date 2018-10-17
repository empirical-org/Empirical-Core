import {
  Link,
} from 'react-router-dom';
import React, { Component } from 'react';
import AuthSignUp from './auth_sign_up'
import AnalyticsWrapper from '../../shared/analytics_wrapper'

class SignUpStudent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      first_name: null,
      last_name: null,
      username: null,
      email: null,
      password: null,
      password_confirmation: null,
      errors: {},
      analytics: new AnalyticsWrapper()
    }
    this.formFields = [
      {
        name: 'first_name',
        label: 'First Name*',
        errorLabel: 'First name'
      },
      {
        name: 'last_name',
        label: 'Last Name*',
        errorLabel: 'Last name'
      },
      {
        name: 'email',
        label: 'Email',
        errorLabel: 'Email'
      },
      {
        name: 'username',
        label: 'Username',
        errorLabel: 'Username'
      },
      {
        name: 'password',
        label: 'Password*',
        errorLabel: 'Password'
      }
    ];
    this.inputs = this.inputs.bind(this);
    this.updateKeyValue = this.updateKeyValue.bind(this);
    this.update = this.update.bind(this);
    this.signUp = this.signUp.bind(this);
    this.signUpData = this.signUpData.bind(this);
    this.signUpError = this.signUpError.bind(this);
  }

  updateKeyValue(key, value) {
      const newState = Object.assign({}, this.state);
      newState[key] = value;
      this.setState(newState);
  }

  update(e) {
    this.updateKeyValue(e.target.id, e.target.value)
  }

  signUpData() {
    const name = this.state.first_name + ' ' + this.state.last_name
    const data = {
      role: 'student',
      account_type: 'Student Created Account',
      name,
      username: this.state.username,
      email: this.state.email,
      password: this.state.password,
    };
    return {user: data};
  }

  uponSignup() {
    window.location = '/add_classroom';
  }

  signUpError(xhr) {
    var errors = $.parseJSON(xhr.responseText).errors;
    this.setState({errors: errors});
  }

  signUp() {
    if (this.state.first_name && this.state.last_name && (this.state.email || this.state.username)) {
      $.ajax({
        type: 'POST',
        url: '/account',
        data: this.signUpData(),
        success: this.uponSignup,
        error: this.signUpError
      });
    } else {
      const errors = {}
      if (!this.state.first_name) {
        errors['first_name'] = "can't be blank"
      }
      if (!this.state.last_name) {
        errors['last_name'] = "can't be blank"
      }
      if (!this.state.email && !this.state.username) {
        errors['email'] = "OR username must be filled"
      }
      this.setState({errors});
    }
  }

  inputs() {
    const that = this
    return this.formFields.map(function(field) {
      const type = field.name === 'password' ? 'password' : 'text'
      const error = that.state.errors[field.name]
        ? <div className="error">{field.errorLabel} {that.state.errors[field.name]}.</div>
        : <span />
      return <div className="text-input-row" key={field.name}>
        <div className="form-label">{field.label}</div>
        <input id={field.name} placeholder={field.label} type={type} onChange={that.update}/>
        {error}
      </div>
    }
    )
  }

  render () {
    return (
      <div className="new-student-account">
        <div className='text-center'>
          <div>
            <h3 className='sign-up-header'>Sign up for a Student Account</h3>
            <p className='text-center support-p'>We now support Google Classroom!</p>
            <AuthSignUp />
          </div>
        </div>
        <div className='need-a-border'/>
        {this.inputs()}
        <button className='sign-up-button button-green' onClick={this.signUp}>Sign Up</button>
        <div className='text-align-center'>* Either a username or an email is required to sign up.</div>
        <div className='text-align-center'>By signing up, you agree to our<a href='/tos' target='_blank'> terms of service </a> and <a href='/privacy' target='_blank'> privacy policy</a>.</div>
    </div>
    )
  }
}

export default SignUpStudent
