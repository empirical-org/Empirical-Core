import React from 'react'
import request from 'request'
import Input from '../../shared/input'
import getAuthToken from '../../modules/get_auth_token';

const bulbSrc = `${process.env.CDN_URL}/images/onboarding/bulb.svg`

export default class ForgotPassword extends React.Component {
  constructor() {
    super();
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handlePasswordConfirmationChange = this.handlePasswordConfirmationChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      password: '',
      passwordConfirmation: '',
      errors: {}
    };
  }

  handlePasswordChange(e) {
    this.setState({ password: e.target.value, });
  }

  handlePasswordConfirmationChange(e) {
    this.setState({ passwordConfirmation: e.target.value, });
  }

  submitClass() {
    let buttonClass = "button contained primary medium"
    if (!this.state.password.length || !this.state.passwordConfirmation.length) {
      buttonClass += ' disabled'
    }
    return buttonClass
  }

  handleSubmit(e) {
    e.preventDefault();
    request({
      url: `${process.env.DEFAULT_URL}/password_reset/${this.props.user.id}`,
      method: 'PUT',
      json: {
        user: {
          password: this.state.password,
          password_confirmation: this.state.passwordConfirmation,
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
      <div className="container account-form reset-password">
        <h3>Reset Your Password</h3>

        <div>
          <div>
            <form onSubmit={this.handleSubmit} acceptCharset="UTF-8" >
              <input name="utf8" type="hidden" value="✓" />
              <input value={this.state.authToken} type="hidden" name="authenticity_token" />
              <Input
                label="Password"
                value={this.state.password}
                handleChange={this.handlePasswordChange}
                type="text"
                className="password"
                error={this.state.errors.password}
              />
              <Input
                label="Confirm password"
                value={this.state.passwordConfirmation}
                handleChange={this.handlePasswordConfirmationChange}
                type="text"
                className="password-confirmation"
                error={this.state.errors.password_confirmation}
              />
              <input type="submit" name="commit" value="Save and log in" className={this.submitClass()} />
            </form>
          </div>
        </div>

        <div className="student-info-box">
          <h3><span>Need your teacher to reset your password? Share these instructions:</span> <img src={bulbSrc}/></h3>
          <ol>
            <li>Sign in to your teacher account</li>
            <li>Click on the "Classes" tab, and then click on "Edit Students"</li>
            <li>Find the student, and click on "Edit Account"</li>
            <li>Click on "Reset password to last name"</li>
          </ol>
        </div>

      </div>

    )
  }
}
