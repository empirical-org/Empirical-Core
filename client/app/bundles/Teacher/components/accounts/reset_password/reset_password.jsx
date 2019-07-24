import React from 'react'
import request from 'request'
import { SegmentAnalytics, Events } from '../../../../../modules/analytics'; 
import { Input } from 'quill-component-library/dist/componentLibrary'

import getAuthToken from '../../modules/get_auth_token';

export default class ForgotPassword extends React.Component {
  constructor() {
    super();

    this.state = {
      password: '',
      passwordConfirmation: '',
      errors: {},
      timesSubmitted: 0,
    };

    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handlePasswordConfirmationChange = this.handlePasswordConfirmationChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handlePasswordChange(e) {
    this.setState({ password: e.target.value, });
  }

  handlePasswordConfirmationChange(e) {
    this.setState({ passwordConfirmation: e.target.value, });
  }

  submitClass() {
    let buttonClass = "quill-button contained primary medium"
    if (!this.state.password.length || !this.state.passwordConfirmation.length) {
      buttonClass += ' disabled'
    }
    return buttonClass
  }

  handleSubmit(e) {
    const { timesSubmitted, password, passwordConfirmation, } = this.state
    e.preventDefault();
    SegmentAnalytics.track(Events.SUBMIT_SAVE_NEW_PASSWORD, {source: 'passwordResetPage'});
    request({
      url: window.location.href,
      method: 'PUT',
      json: {
        user: {
          password,
          password_confirmation: passwordConfirmation,
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
          state = { lastUpdate: new Date(), errors, timesSubmitted: timesSubmitted + 1, }
        } else {
          let message = "Those passwords didn't match. Try again.";
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
    const { authToken, password, passwordConfirmation, errors, timesSubmitted, } = this.state
    return (
      <div className="container account-form reset-password">
        <h1>Reset Password</h1>

        <div className="form-container">
          <form onSubmit={this.handleSubmit} acceptCharset="UTF-8" >
            <input name="utf8" type="hidden" value="✓" />
            <input value={authToken} type="hidden" name="authenticity_token" />
            <Input
              label="New password"
              value={password}
              handleChange={this.handlePasswordChange}
              type="password"
              className="password inspectletIgnore"
              error={errors.password}
              timesSubmitted={timesSubmitted}
            />
            <Input
              label="Confirm password"
              value={passwordConfirmation}
              handleChange={this.handlePasswordConfirmationChange}
              type="password"
              className="password-confirmation inspectletIgnore"
              error={errors.password_confirmation}
              timesSubmitted={timesSubmitted}
            />
            <input type="submit" name="commit" value="Save and log in" className={this.submitClass()} />
          </form>
        </div>

      </div>

    )
  }
}
