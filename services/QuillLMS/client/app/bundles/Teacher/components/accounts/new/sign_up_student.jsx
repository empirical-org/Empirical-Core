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
              <form acceptCharset="UTF-8" onSubmit={this.handleSubmit} >
                <input name="utf8" type="hidden" value="✓" />
                <input name="authenticity_token" type="hidden" value={authToken} />
                <div className="name">
                  <Input
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
                  className="email"
                  error={errors.email}
                  handleChange={this.update}
                  id="email"
                  label="Email (optional)"
                  timesSubmitted={timesSubmitted}
                  type="text"
                  value={email}
                />
                <Input
                  className="password"
                  error={errors.password}
                  handleChange={this.update}
                  id="password"
                  label="Password"
                  timesSubmitted={timesSubmitted}
                  type='password'
                  value={password}
                />
                <input className={this.submitClass()} name="commit" type="submit" value="Sign up" />
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
