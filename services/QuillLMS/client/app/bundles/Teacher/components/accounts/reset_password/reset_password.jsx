import React from 'react'
import request from 'request'
import { SegmentAnalytics, Events } from '../../../../../modules/analytics';

import getAuthToken from '../../modules/get_auth_token';
import { Input, } from '../../../../Shared/index'


export default class ForgotPassword extends React.Component {
  constructor() {
    super();

    this.state = {
      password: '',
      passwordConfirmation: '',
      errors: {},
      timesSubmitted: 0,
    };
  }

  onPasswordChange = (e) => {
    this.setState({ password: e.target.value, });
  }

  onPasswordConfirmationChange = (e) => {
    this.setState({ passwordConfirmation: e.target.value, });
  }

  handleSubmit = (e) => {
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

  submitClass() {
    const { password, passwordConfirmation, } = this.state
    let buttonClass = "quill-button contained primary medium focus-on-light"
    if (!password.length || !passwordConfirmation.length) {
      buttonClass += ' disabled'
    }
    return buttonClass
  }

  render() {
    const { authToken, password, passwordConfirmation, errors, timesSubmitted, } = this.state
    return (
      <div className="container account-form reset-password">
        <h1>Reset Password</h1>

        <div className="form-container">
          <form acceptCharset="UTF-8" onSubmit={this.handleSubmit} >
            <input aria-hidden="true" aria-label="utf8" name="utf8" type="hidden" value="✓" />
            <input aria-hidden="true" aria-label="authenticity token" name="authenticity_token" type="hidden" value={authToken} />
            <Input
              autoComplete="new-password"
              className="password inspectletIgnore"
              error={errors.password}
              handleChange={this.onPasswordChange}
              label="New password"
              timesSubmitted={timesSubmitted}
              type="password"
              value={password}
            />
            <Input
              autoComplete="new-password"
              className="password-confirmation inspectletIgnore"
              error={errors.password_confirmation}
              handleChange={this.onPasswordConfirmationChange}
              label="Confirm password"
              timesSubmitted={timesSubmitted}
              type="password"
              value={passwordConfirmation}
            />
            <input aria-label="Save and log in" className={this.submitClass()} name="commit" type="submit" value="Save and log in" />
          </form>
        </div>

      </div>

    )
  }
}
