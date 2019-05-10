import React from 'react';
import request from 'request'
import { SegmentAnalytics, Events } from '../../../../../modules/analytics'; 
import { Input } from 'quill-component-library/dist/componentLibrary'

import AuthSignUp from './auth_sign_up'
import AnalyticsWrapper from '../../shared/analytics_wrapper'
import AgreementsAndLinkToLogin from './agreements_and_link_to_login'
import getAuthToken from '../../modules/get_auth_token';

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

    this.updateKeyValue = this.updateKeyValue.bind(this);
    this.update = this.update.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this)
    this.submitClass = this.submitClass.bind(this)
  }

  updateKeyValue(key, value) {
    const newState = Object.assign({}, this.state);
    newState[key] = value;
    this.setState(newState);
  }

  update(e) {
    this.updateKeyValue(e.target.id, e.target.value)
  }

  submitClass() {
    const { password, firstName, lastName, username } = this.state
    let buttonClass = "quill-button contained primary medium"
    if (!password.length || !firstName.length || !lastName.length || !username.length) {
      buttonClass += ' disabled'
    }
    return buttonClass
  }

  handleSubmit(e) {
    const { firstName, lastName, username, password, timesSubmitted, } = this.state
    const email = this.state.email && this.state.email.length ? this.state.email : null
    e.preventDefault();
    SegmentAnalytics.track(Events.SUBMIT_SIGN_UP, {provider: Events.providers.EMAIL});
    request({
      url: `${process.env.DEFAULT_URL}/account`,
      method: 'POST',
      json: {
        user: {
          name: `${firstName} ${lastName}`,
          password,
          username,
          email,
          role: 'student',
          account_type: 'Student Created Account'
        },
        authenticity_token: getAuthToken(),
      },
    },
    (err, httpResponse, body) => {
      if (httpResponse.statusCode === 200 && body.redirect) {
        // console.log(body);
        window.location = `${process.env.DEFAULT_URL}${body.redirect}`;
      } else {
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
    });
  }

  render () {
    const { authToken, firstName, lastName, username, timesSubmitted, email, errors, password, } = this.state
    return (
      <div className="container account-form student-sign-up">
        <h1>Create a student account</h1>
        <p className="sub-header">Are you a teacher?
          <a href="/sign-up/teacher" onClick={(e) => SegmentAnalytics.track(Events.CLICK_CREATE_TEACHER_USER)}>Sign up here</a>
        </p>
        <div className="account-container text-center">
          <AuthSignUp />
          <div className='break'><span/>or<span/></div>
          <div className="student-signup-form">
            <div>
              <form onSubmit={this.handleSubmit} acceptCharset="UTF-8" >
                <input name="utf8" type="hidden" value="✓" />
                <input value={authToken} type="hidden" name="authenticity_token" />
                <div className="name">
                  <Input
                    label="First name"
                    value={firstName}
                    handleChange={this.update}
                    type="text"
                    className="first-name"
                    id="firstName"
                    error={errors.first_name}
                    timesSubmitted={timesSubmitted}
                  />
                  <Input
                    label="Last name"
                    value={lastName}
                    handleChange={this.update}
                    type="text"
                    className="last-name"
                    id="lastName"
                    error={errors.last_name}
                    timesSubmitted={timesSubmitted}
                  />
                </div>
                <Input
                  label="Username"
                  value={username}
                  handleChange={this.update}
                  type="text"
                  className="username"
                  id="username"
                  error={errors.username}
                  timesSubmitted={timesSubmitted}
                />
                <Input
                  label="Email (optional)"
                  value={email}
                  handleChange={this.update}
                  type="text"
                  className="email"
                  id="email"
                  error={errors.email}
                  timesSubmitted={timesSubmitted}
                />
                <Input
                  label="Password"
                  value={password}
                  handleChange={this.update}
                  type='password'
                  className="password"
                  error={errors.password}
                  id="password"
                  timesSubmitted={timesSubmitted}
                />
                <input type="submit" name="commit" value="Sign up" className={this.submitClass()} />
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
