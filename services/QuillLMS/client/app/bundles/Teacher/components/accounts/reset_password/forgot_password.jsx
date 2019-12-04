import React from 'react'
import request from 'request'
import { Input } from 'quill-component-library/dist/componentLibrary'

import getAuthToken from '../../modules/get_auth_token';

const bulbSrc = `${process.env.CDN_URL}/images/onboarding/bulb.svg`

export default class ForgotPassword extends React.Component {
  constructor() {
    super();
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      email: '',
      errors: {},
      timesSubmitted: 0,
    };
  }

  handleEmailChange(e) {
    this.setState({ email: e.target.value, });
  }

  submitClass() {
    let buttonClass = "quill-button contained primary medium"
    if (!this.state.email.length) {
      buttonClass += ' disabled'
    }
    return buttonClass
  }

  handleSubmit(e) {
    const { email, password, timesSubmitted, } = this.state
    e.preventDefault();
    request({
      url: "https://quill-lms-sprint-docker.herokuapp.com/password_reset",
      method: 'POST',
      json: {
        user: {
          email,
          password,
        },
        authenticity_token: getAuthToken(),
      },
    },
    (err, httpResponse, body) => {
      if (httpResponse.statusCode === 200 && body.redirect) {
        // console.log(body);
        window.location = "https://quill-lms-sprint-docker.herokuapp.com${body.redirect}";
      } else {
        let state
        if (body.type && body.message) {
          const errors = {}
          errors[body.type] = body.message
          state = { lastUpdate: new Date(), errors, timesSubmitted: timesSubmitted + 1, }
        } else {
          let message = 'An account with this email does not exist. Try again.';
          if (httpResponse.statusCode === 429) {
            message = 'Too many failed attempts. Please wait one minute and try again.';
          }
          state = { lastUpdate: new Date(), message: (body.message || message), }
        }
        this.setState(state)
      }
    });
  }

  render() {
    const { timesSubmitted, email, authToken, errors, } = this.state
    return (
      <div className="container account-form forgot-password">
        <h1>Reset Password</h1>
        <p className="sub-header">We'll email you a link to reset your password. You can also ask your teacher to reset it for you.</p>
        <div className="form-container">
          <form acceptCharset="UTF-8" onSubmit={this.handleSubmit} >
            <input name="utf8" type="hidden" value="✓" />
            <input name="authenticity_token" type="hidden" value={authToken} />
            <Input
              className="email"
              error={errors.email}
              handleChange={this.handleEmailChange}
              label="Email"
              timesSubmitted={timesSubmitted}
              type="text"
              value={email}
            />
            <input className={this.submitClass()} name="commit" type="submit" value="Reset password" />
          </form>
        </div>

        <div className="student-info-box">
          <h3><span>Need your teacher to reset your password? Share these instructions:</span> <img src={bulbSrc} /></h3>
          <ol>
            <li>Sign in to your teacher account</li>
            <li>Click on the "Classes" tab, and then click on  "Edit Students"</li>
            <li>Find the student, and click on "Edit Account"</li>
            <li>Click on "Reset password to last name"</li>
          </ol>
        </div>

      </div>

    )
  }
}
