import React from 'react';

import AuthSignUp from './auth_sign_up'

import PasswordWrapper from '../shared/password_wrapper'
import AnalyticsWrapper from '../../shared/analytics_wrapper'
import AgreementsAndLinkToLogin from './agreements_and_link_to_login'
import { Input, } from '../../../../Shared/index'
import { requestPost, } from '../../../../../modules/request/index'

class SignUpStudent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      username: '',
      email: null,
      password: '',
      errors: {},
      analytics: new AnalyticsWrapper(),
      timesSubmitted: 0
    }
  }

  componentDidMount() {
    document.title = 'Quill.org | Student Sign Up'
  }

  handleClickSignUpAsTeacher = (e) => {
    window.location.href = '/sign-up/teacher'
  }

  handleKeyDownOnSignUpAsTeacher = (e) => {
    if (e.key !== 'Enter') { return }
    this.handleClickSignUpAsTeacher(e)
  }

  handleSubmit = e => {
    const { firstName, lastName, username, password, timesSubmitted, email, } = this.state
    const emailToSubmit = email && email.length ? email : null
    e.preventDefault();
    requestPost(
      `${import.meta.env.DEFAULT_URL}/account`,
      {
        user: {
          name: `${firstName} ${lastName}`,
          password,
          username,
          email: emailToSubmit,
          role: 'student',
          account_type: 'Student Created Account'
        }
      },
      (body) => {
        window.location = `${import.meta.env.DEFAULT_URL}${body.redirect}`;
      },
      (body) => {
        let state
        if (body.errors) {
          state = { lastUpdate: new Date(), errors: body.errors, timesSubmitted: timesSubmitted + 1}
        } else {
          let message = 'You have entered an incorrect email/username or password.';
          if (httpResponse.statusCode === 429) {
            message = 'Too many failed attempts. Please wait one minute and try again.';
          }
          state = { lastUpdate: new Date(), message: (body.message || message), }
        }
        this.setState(state)
      }
    )
  };

  submitClass = () => {
    const { password, firstName, lastName, username } = this.state
    let buttonClass = "quill-button contained primary medium focus-on-light"
    if (!password.length || !firstName.length || !lastName.length || !username.length) {
      buttonClass += ' disabled'
    }
    return buttonClass
  };

  update = e => {
    this.updateKeyValue(e.target.id, e.target.value)
  };

  updateKeyValue = (key, value) => {
    const newState = Object.assign({}, this.state);
    newState[key] = value;
    this.setState(newState);
  };

  render () {
    const { authToken, firstName, lastName, username, timesSubmitted, email, errors, password, } = this.state
    return (
      <div className="container account-form student-sign-up">
        <h1>Create a student account</h1>
        <p className="sub-header">Are you a teacher or guardian?
          <span className="inline-link" onClick={this.handleClickSignUpAsTeacher} onKeyDown={this.handleKeyDownOnSignUpAsTeacher} role="link" tabIndex={0}>Sign up here</span>
        </p>
        <div className="account-container text-center">
          <AuthSignUp />
          <div className='break'><span />or<span /></div>
          <div className="student-signup-form">
            <div>
              <form acceptCharset="UTF-8" onSubmit={this.handleSubmit} >
                <input aria-hidden="true" aria-label="utf8" name="utf8" type="hidden" value="✓" />
                <input aria-hidden="true" aria-label="authenticity token" name="authenticity_token" type="hidden" value={authToken} />
                <div className="name">
                  <Input
                    autoComplete="given-name"
                    className="first-name"
                    error={errors.first_name}
                    handleChange={this.update}
                    id="firstName"
                    label="First name"
                    timesSubmitted={timesSubmitted}
                    type="text"
                    value={firstName}
                  />
                  <Input
                    autoComplete="family-name"
                    className="last-name"
                    error={errors.last_name}
                    handleChange={this.update}
                    id="lastName"
                    label="Last name"
                    timesSubmitted={timesSubmitted}
                    type="text"
                    value={lastName}
                  />
                </div>
                <Input
                  autocomplete="username"
                  className="username"
                  error={errors.username}
                  handleChange={this.update}
                  id="username"
                  label="Username"
                  timesSubmitted={timesSubmitted}
                  type="text"
                  value={username}
                />
                <Input
                  autocomplete="email"
                  className="email"
                  error={errors.email}
                  handleChange={this.update}
                  id="email"
                  label="Email (optional)"
                  timesSubmitted={timesSubmitted}
                  type="email"
                  value={email}
                />
                <PasswordWrapper
                  autoComplete="new-password"
                  className="password inspectletIgnore"
                  error={errors.password}
                  id="password"
                  label="Password"
                  onChange={this.update}
                  timesSubmitted={timesSubmitted}
                  value={password}
                />
                <input aria-label="Sign up" className={this.submitClass()} name="commit" type="submit" value="Sign up" />
              </form>
            </div>
          </div>
        </div>
        <AgreementsAndLinkToLogin />
      </div>
    )
  }
}

export default SignUpStudent
