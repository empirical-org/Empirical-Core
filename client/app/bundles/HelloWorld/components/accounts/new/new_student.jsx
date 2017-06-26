'use strict';
import React from 'react'
import AuthSignUp from './auth_sign_up'

export default React.createClass({
  propTypes: {
    signUp: React.PropTypes.func.isRequired,
    errors: React.PropTypes.object
  },

  formFields: [
    {
      name: 'first_name',
      label: 'First Name',
      errorLabel: 'First name'
    },
    {
      name: 'last_name',
      label: 'Last Name',
      errorLabel: 'Last name'
    },
    {
      name: 'username',
      label: 'Username',
      errorLabel: 'Username'
    },
    {
      name: 'email',
      label: 'Email (optional)',
      errorLabel: 'Email'
    },
    {
      name: 'password',
      label: 'Password',
      errorLabel: 'Password'
    }
  ],

  inputs: function() {
    const that = this
    return this.formFields.map(function(field) {
      const type = field.name === 'password' ? 'password' : 'text'
      const error = that.props.errors[field.name]
        ? <div className="error">{field.errorLabel} {that.props.errors[field.name]}.</div>
        : <span />
      return <div className="text-input-row" key={field.name}>
        <div className="form-label">{field.label}</div>
        <input id={field.name} placeholder={field.label} type={type} onChange={that.update}/>
        {error}
      </div>
    }
    )
  },

  update: function(e) {
    this.props.updateKeyValue(e.target.id, e.target.value)
  },

  render: function () {
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
        <button className='sign-up-button button-green' onClick={this.props.signUp}>Sign Up</button>
        <div className='text-align-center'>By signing up, you agree to our<a href='/tos' target='_blank'> terms of service </a> and <a href='/privacy' target='_blank'> privacy policy</a>.</div>
    </div>
    );
  }
});
