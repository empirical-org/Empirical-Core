import React from 'react';
import { PropTypes } from 'react-metrics';
import request from 'request';
import { Input } from 'quill-component-library/dist/componentLibrary'
import { withSegmentMetricsProps } from '../../../../../modules/metrics';

import PasswordInfo from './password_info.jsx';
import getAuthToken from '../../modules/get_auth_token';

class LoginFormApp extends React.Component {
  static contextTypes = {
    metrics: PropTypes.metrics
  }

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

    if (this.state.showPass) {
      this.context.metrics.track('Anonymous.NewSession.Login.ClickHidePassword');
    } else {
      this.context.metrics.track('Anonymous.NewSession.Login.ClickShowPassword');
    }
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
    this.context.metrics.track('Anonymous.NewSession.Login.SubmitLogIn');
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
            <a href="/auth/google_oauth2?prompt=consent" onClick={(e) => this.context.metrics.track('Anonymous.NewSession.Login.ClickLogInWithGoogle')}>
              <img src="/images/google_icon.svg" alt="google icon" />
              <span>Log in with Google</span>
            </a>
            <a href={this.props.cleverLink} onClick={(e) => this.context.metrics.track('Anonymous.NewSession.Login.ClickLogInWithClever')}>
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
                  <a href="/password_reset"
                     onClick={(e) => this.context.metrics.track('Anonymous.NewSession.Login.ClickForgotPassword')}>Forgot password?</a>
                  <span onClick={() => { this.clickHandler(); }}>
                    {this.toggleButtonText()} password
                  </span>
                </div>
                <input type="submit" name="commit" value="Log in" className={this.submitClass()} />
              </form>
            </div>
          </div>
        </div>
        <p className="sign-up-link">Don't have an account?&nbsp;<a href="/account/new"
           onClick={(e) => this.context.metrics.track('Anonymous.NewSession.Login.ClickSignUp')}>Sign up</a></p>
        <PasswordInfo showHintBox={Object.keys(this.state.errors).length} />
      </div>
    );
  }
}

const LoginFormAppWithMetrics = withSegmentMetricsProps(LoginFormApp);

export default LoginFormAppWithMetrics;
