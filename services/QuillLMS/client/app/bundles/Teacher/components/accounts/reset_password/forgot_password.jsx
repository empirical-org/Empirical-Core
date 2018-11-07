import React from 'react'
import request from 'request'
import Input from '../../shared/input'
import getAuthToken from '../../modules/get_auth_token';

const bulbSrc = `${process.env.CDN_URL}/images/onboarding/bulb.svg`

export default class ForgotPassword extends React.Component {
  constructor() {
    super();
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      email: '',
      errors: {}
    };
  }

  handleEmailChange(e) {
    this.setState({ email: e.target.value, });
  }

  submitClass() {
    let buttonClass = "button contained primary medium"
    if (!this.state.email.length) {
      buttonClass += ' disabled'
    }
    return buttonClass
  }

  handleSubmit(e) {
    e.preventDefault();
    request({
      url: `${process.env.DEFAULT_URL}/password_reset`,
      method: 'POST',
      json: {
        user: {
          email: this.state.email,
          password: this.state.password,
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
        if (body.type && body.message) {
          const errors = {}
          errors[body.type] = body.message
          state = { lastUpdate: new Date(), errors, }
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
    return (
      <div className="container account-form forgot-password">
        <h1>Reset Password</h1>
        <p className="sub-header">We'll email you a link to reset your password. You can also ask your teacher to reset it for you.</p>
        <div className="form-container">
          <form onSubmit={this.handleSubmit} acceptCharset="UTF-8" >
            <input name="utf8" type="hidden" value="✓" />
            <input value={this.state.authToken} type="hidden" name="authenticity_token" />
            <Input
              label="Email"
              value={this.state.email}
              handleChange={this.handleEmailChange}
              type="text"
              className="email"
              error={this.state.errors.email}
            />
            <input type="submit" name="commit" value="Reset password" className={this.submitClass()} />
          </form>
        </div>

        <div className="student-info-box">
          <h3><span>Need your teacher to reset your password? Share these instructions:</span> <img src={bulbSrc}/></h3>
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
