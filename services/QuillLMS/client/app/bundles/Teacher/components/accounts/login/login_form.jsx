import React from 'react';
import request from 'request';
import { SegmentAnalytics, Events } from '../../../../../modules/analytics';
import { Input } from 'quill-component-library/dist/componentLibrary'

import PasswordInfo from './password_info.jsx';
import getAuthToken from '../../modules/get_auth_token';

class LoginFormApp extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showPass: false,
      email: '',
      password: '',
      errors: {},
      timesSubmitted: 0,
    };
  }

  handleTogglePassClick = () => {
    this.setState(prevState => ({
      showPass: !prevState.showPass,
    }), () => {
      const { showPass, } = this.state
      let setState = showPass ? 'showPassword' : 'hidePassword';
      SegmentAnalytics.track(Events.CLICK_SHOW_HIDE_PASSWORD, {setState: setState});
    });
  }

  togglePass = () => {
    const { showPass, } = this.state
    return !showPass ? 'password' : 'text';
  }

  toggleButtonText = () => {
    const { showPass, } = this.state
    return !showPass ? 'Show' : 'Hide';
  }

  submitClass = () => {
    const { password, email, } = this.state
    let buttonClass = 'quill-button contained primary medium';
    if (!password.length || !email.length) {
      buttonClass += ' disabled';
    }
    return buttonClass;
  }

  onEmailChange = (e) => {
    this.setState({ email: e.target.value, });
  }

  onPasswordChange = (e) => {
    this.setState({ password: e.target.value, });
  }

  handleSubmit = (e) => {
    const { timesSubmitted, email, password, } = this.state;
    e.preventDefault();
    SegmentAnalytics.track(Events.SUBMIT_LOG_IN, {provider: Events.providers.EMAIL});
    request({
      url: `${process.env.DEFAULT_URL}/session/login_through_ajax`,
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
        window.location = `${process.env.DEFAULT_URL}${body.redirect}`;
      } else {
        let state;
        if (body.type && body.message) {
          const errors = {};
          errors[body.type] = body.message;
          state = { lastUpdate: new Date(), errors, timesSubmitted: timesSubmitted + 1, };
        } else {
          let message = 'You have entered an incorrect email/username or password.';
          if (httpResponse.statusCode === 429) {
            message = 'Too many failed attempts. Please wait one minute and try again.';
          }
          state = { lastUpdate: new Date(), message: (body.message || message), };
        }
        this.setState(state);
      }
    });
  }

  handleSignUpClick = (e) => {
    SegmentAnalytics.track(Events.CLICK_SIGN_UP, {location: 'doNotHaveAccount'})
    window.location.href = '/account/new'
  }

  handleKeyEnterOnSignUpLink = (e) => {
    if (e.key !== 'Enter') { return }

    this.handleSignUpClick(e)
  }

  handleKeyEnterOnTogglePassword = (e) => {
    if (e.key !== 'Enter') { return }

    this.handleTogglePassClick(e)
  }

  handleGoogleClick = (e) => {
    SegmentAnalytics.track(Events.SUBMIT_LOG_IN, {provider: Events.providers.GOOGLE})
    window.location.href = '/auth/google_oauth2'
  }

  handleCleverClick = (e) => {
    const { cleverLink, } = this.props
    SegmentAnalytics.track(Events.SUBMIT_LOG_IN, {provider: Events.providers.CLEVER})
    window.location.href = cleverLink
  }

  render() {
    const { errors, email, password, timesSubmitted, authToken, } = this.state;
    return (
      <div className="container account-form">
        <h1>Good to see you again!</h1>
        <div className="account-container text-center">
          <div className="auth-section">
            <button onClick={this.handleGoogleClick} type="button">
              <img alt="Google icon" src={`${process.env.CDN_URL}/images/shared/google_icon.svg`} />
              <span>Log in with Google</span>
            </button>
            <button onClick={this.handleCleverClick} type="button">
              <img alt="Clever icon" src={`${process.env.CDN_URL}/images/shared/clever_icon.svg`} />
              <span>Log in with Clever</span>
            </button>
          </div>
          <div className="break"><span  />or<span  /></div>
          <div className="login-form">
            <div>
              <form acceptCharset="UTF-8" onSubmit={this.handleSubmit} >
                <input aria-hidden="true" aria-label="utf8" name="utf8" type="hidden" value="✓" />
                <input aria-hidden="true" aria-label="authenticity token" name="authenticity_token" type="hidden" value={authToken} />
                <Input
                  className="email"
                  error={errors.email}
                  handleChange={this.onEmailChange}
                  label="Email or username"
                  timesSubmitted={timesSubmitted}
                  type="text"
                  value={email}
                />
                <Input
                  className="password inspectletIgnore"
                  error={errors.password}
                  handleChange={this.onPasswordChange}
                  label="Password"
                  timesSubmitted={timesSubmitted}
                  type={this.togglePass()}
                  value={password}
                />
                <div className="forget-and-show-password">
                  <a href="/password_reset">Forgot password?</a>
                  <span onClick={this.handleTogglePassClick} onKeyDown={this.handleKeyEnterOnTogglePassword} role="button" tabIndex={0}>
                    {this.toggleButtonText()} password
                  </span>
                </div>
                <input aria-label="Log in" className={this.submitClass()} name="commit" type="submit" value="Log in" />
              </form>
            </div>
          </div>
        </div>
        <p className="sign-up-link">Don&#39;t have an account?&nbsp;<span onClick={this.handleSignUpClick} onKeyDown={this.handleKeyEnterOnSignUpLink} role="link" tabIndex={0}>Sign up</span></p>
        <PasswordInfo showHintBox={Object.keys(errors).length} />
      </div>
    );
  }
}

export default LoginFormApp;
