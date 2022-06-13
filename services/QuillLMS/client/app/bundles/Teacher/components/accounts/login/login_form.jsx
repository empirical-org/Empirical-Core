import React from 'react';
import request from 'request';

import PasswordInfo from './password_info.jsx';

import PasswordWrapper from '../shared/password_wrapper'
import AssignActivityPackBanner from '../assignActivityPackBanner'
import getAuthToken from '../../modules/get_auth_token';
import { Input, } from '../../../../Shared/index'

const smallWhiteCheckSrc = `${process.env.CDN_URL}/images/shared/check-small-white.svg`

class LoginFormApp extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      errors: {},
      timesSubmitted: 0,
      keepMeSignedIn: true
    };
  }

  onEmailChange = (e) => {
    this.setState({ email: e.target.value, });
  }

  onPasswordChange = (e) => {
    this.setState({ password: e.target.value, });
  }

  async fetchUser() {
    return fetch('/api/v1/users.json', {
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
    }).then((response) => {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response.json();
    });
  }

  handleCleverClick = (e) => {
    const { cleverLink, } = this.props
    window.location.href = cleverLink
  }

  handleGoogleClick = (e) => {
    const { googleLink, } = this.props
    window.location.href = googleLink
  }

  handleKeyEnterOnSignUpLink = (e) => {
    if (e.key !== 'Enter') { return }

    this.handleSignUpClick(e)
  }

  handleToggleKeepMeSignedIn = () => {
    this.setState(prevState => ({ keepMeSignedIn: !prevState.keepMeSignedIn, }))
  }

  handleSignUpClick = (e) => {
    window.location.href = '/account/new'
  }

  handleSubmit = (e) => {
    const { timesSubmitted, email, password, keepMeSignedIn, } = this.state;
    e.preventDefault();
    request({
      url: `${process.env.DEFAULT_URL}/session/login_through_ajax`,
      method: 'POST',
      json: {
        user: {
          email,
          password,
        },
        keep_me_signed_in: keepMeSignedIn,
        authenticity_token: getAuthToken(),
      },
    },
    (err, httpResponse, body) => {
      if (httpResponse.statusCode === 200 && body.redirect) {
        window.location = body.redirect;
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

  submitClass = () => {
    const { password, email, } = this.state
    let buttonClass = 'quill-button contained primary medium focus-on-light';
    if (!password.length || !email.length) {
      buttonClass += ' disabled';
    }
    return buttonClass;
  }

  renderKeepMeSignedIn = () => {
    const { keepMeSignedIn, } = this.state
    let checkbox
    if (keepMeSignedIn) {
      checkbox = <button aria-checked={true} className="quill-checkbox selected focus-on-light" onClick={this.handleToggleKeepMeSignedIn} onKeyDown={this.handleKeyDownOnToggleNewsletter} role="checkbox" type="button"><img alt="check" src={smallWhiteCheckSrc} /></button>
    } else {
      checkbox = <button aria-checked={false} aria-label="Unchecked" className="quill-checkbox unselected focus-on-light" onClick={this.handleToggleKeepMeSignedIn} role="checkbox" type="button" />
    }
    return <div className="keep-me-signed-in-row">{checkbox} <p>Keep me signed in</p></div>
  }

  render() {
    const { errors, email, password, timesSubmitted, authToken, } = this.state;
    return (
      <div>
        <AssignActivityPackBanner login={true} />
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
            <div className="break"><span />or<span /></div>
            <div className="login-form">
              <div>
                <form acceptCharset="UTF-8" onSubmit={this.handleSubmit} >
                  <input aria-hidden="true" aria-label="utf8" name="utf8" type="hidden" value="✓" />
                  <input aria-hidden="true" aria-label="authenticity token" name="authenticity_token" type="hidden" value={authToken} />
                  <Input
                    className="email"
                    error={errors.email}
                    handleChange={this.onEmailChange}
                    id="email-or-username"
                    label="Email or username"
                    timesSubmitted={timesSubmitted}
                    type="text"
                    value={email}
                  />
                  <PasswordWrapper
                    autoComplete="current-password"
                    className="password inspectletIgnore"
                    error={errors.password}
                    id="password"
                    label="Password"
                    onChange={this.onPasswordChange}
                    timesSubmitted={timesSubmitted}
                    value={password}
                  />
                  <div className="forget-and-show-password">
                    {this.renderKeepMeSignedIn()}
                    <a className="inline-link" href="/password_reset">Forgot password?</a>
                  </div>
                  <input
                    aria-label="Log in"
                    className={this.submitClass()}
                    id="log-in"
                    name="commit"
                    type="submit"
                    value="Log in"
                  />
                </form>
              </div>
            </div>
          </div>
          <p className="sign-up-link">Don&#39;t have an account?&nbsp;<span className="inline-link" onClick={this.handleSignUpClick} onKeyDown={this.handleKeyEnterOnSignUpLink} role="link" tabIndex={0}>Sign up</span></p>
          <PasswordInfo showHintBox={Object.keys(errors).length} />
        </div>
      </div>
    );
  }
}

export default LoginFormApp;
