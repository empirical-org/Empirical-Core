import React from 'react';
import request from 'request';
import { SegmentAnalytics, Events } from '../../../../../modules/analytics'; 
import { Input } from 'quill-component-library/dist/componentLibrary'

import PasswordInfo from './password_info.jsx';
import getAuthToken from '../../modules/get_auth_token';

class LoginFormApp extends React.Component {
  constructor() {
    super();
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      showPass: false,
      email: '',
      password: '',
      errors: {},
      timesSubmitted: 0,
    };
  }

  clickHandler() {
    this.setState(prevState => ({
      showPass: !prevState.showPass,
    }));
    let setState = this.state.showPass ? 'showPassword' : 'hidePassword';
    SegmentAnalytics.track(Events.CLICK_SHOW_HIDE_PASSWORD, {setState: setState});
  }

  togglePass() {
    return !this.state.showPass ? 'password' : 'text';
  }

  toggleButtonText() {
    return !this.state.showPass ? 'Show' : 'Hide';
  }

  submitClass() {
    let buttonClass = 'quill-button contained primary medium';
    if (!this.state.password.length || !this.state.email.length) {
      buttonClass += ' disabled';
    }
    return buttonClass;
  }

  handleEmailChange(e) {
    this.setState({ email: e.target.value, });
  }

  handlePasswordChange(e) {
    this.setState({ password: e.target.value, });
  }

  handleSubmit(e) {
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

  render() {
    const { errors, email, password, timesSubmitted, authToken, } = this.state;
    return (
      <div className="container account-form">
        <h1>Good to see you again!</h1>
        <div className="account-container text-center">
          <div className="auth-section">
            <a href="/auth/google_oauth2?prompt=consent" onClick={(e) => SegmentAnalytics.track(Events.SUBMIT_LOG_IN, {provider: Events.providers.GOOGLE})}>
              <img src="/images/google_icon.svg" alt="google icon" />
              <span>Log in with Google</span>
            </a>
            <a href={this.props.cleverLink} onClick={(e) => SegmentAnalytics.track(Events.SUBMIT_LOG_IN, {provider: Events.providers.CLEVER})}>
              <img src={`${process.env.CDN_URL}/images/shared/clever_icon.svg`} alt="clever icon" />
              <span>Log in with Clever</span>
            </a>
          </div>
          <div className="break"><span  />or<span  /></div>
          <div className="login-form">
            <div>
              <form onSubmit={this.handleSubmit} acceptCharset="UTF-8" >
                <input name="utf8" type="hidden" value="✓" />
                <input value={authToken} type="hidden" name="authenticity_token" />
                <Input
                  label="Email or username"
                  value={email}
                  handleChange={this.handleEmailChange}
                  type="text"
                  className="email"
                  error={errors.email}
                  timesSubmitted={timesSubmitted}
                />
                <Input
                  label="Password"
                  value={password}
                  handleChange={this.handlePasswordChange}
                  type={this.togglePass()}
                  className="password inspectletIgnore"
                  error={errors.password}
                  timesSubmitted={timesSubmitted}
                />
                <div className="forget-and-show-password">
                  <a href="/password_reset">Forgot password?</a>
                  <span onClick={() => { this.clickHandler(); }}>
                    {this.toggleButtonText()} password
                  </span>
                </div>
                <input type="submit" name="commit" value="Log in" className={this.submitClass()} />
              </form>
            </div>
          </div>
        </div>
        <p className="sign-up-link">Don't have an account?&nbsp;<a
          href="/account/new"
          onClick={(e) => SegmentAnalytics.track(Events.CLICK_SIGN_UP, {location: 'doNotHaveAccount'})}
        >Sign up</a></p>
        <PasswordInfo showHintBox={Object.keys(this.state.errors).length} />
      </div>
    );
  }
}

export default LoginFormApp;
