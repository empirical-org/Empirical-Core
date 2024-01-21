import React from 'react';

import { requestPost, } from '../../../../../modules/request/index';
import { Input, Snackbar, } from '../../../../Shared/index';
import AuthGoogleAccessForm from '../AuthGoogleAccessForm';
import AssignActivityPackBanner from '../assignActivityPackBanner';
import PasswordWrapper from '../shared/password_wrapper';
import PasswordInfo from './password_info.jsx';

const smallWhiteCheckSrc = `${process.env.CDN_URL}/images/shared/check-small-white.svg`
const informationSrc = `${process.env.CDN_URL}/images/icons/description-information.svg`

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

    requestPost(
      `${process.env.DEFAULT_URL}/session/login_through_ajax`,
      {
        user: {
          email,
          password,
        },
        keep_me_signed_in: keepMeSignedIn,
      },
      (body) => {
        window.location = body.redirect;
      },
      (body) => {
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
    )
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
    const keepMeSignedInId = "keep-me-signed-in"
    let checkbox
    if (keepMeSignedIn) {
      checkbox = <button aria-checked={true} aria-labelledby={keepMeSignedInId} className="quill-checkbox selected focus-on-light" onClick={this.handleToggleKeepMeSignedIn} onKeyDown={this.handleKeyDownOnToggleNewsletter} role="checkbox" type="button"><img alt="check" src={smallWhiteCheckSrc} /></button>
    } else {
      checkbox = <button aria-checked={false} aria-labelledby={keepMeSignedInId} className="quill-checkbox unselected focus-on-light" onClick={this.handleToggleKeepMeSignedIn} role="checkbox" type="button" />
    }
    return <div className="keep-me-signed-in-row" id={keepMeSignedInId}>{checkbox} <p>Keep me signed in</p></div>
  }

  renderGoogleOfflineAccessConsent = () => {
    return (
      <div>
        <div className="container account-form">
          <h1>Sorry, Quill's access to your Google Account has expired. Please re-authorize access to continue.</h1>
          <div className="account-container text-center" style={{minHeight: 0}}>
            <div className="auth-section" style={{paddingBottom: 0}}>
              <AuthGoogleAccessForm offlineAccess={true} text='Re-authorize Google' />
            </div>
          </div>
        </div>
      </div>
    )
  }

  render() {
    const { googleOfflineAccessExpired, expiredSessionRedirect } = this.props
    const { errors, email, password, timesSubmitted, authToken, } = this.state;

    if (googleOfflineAccessExpired) { return this.renderGoogleOfflineAccessConsent() }

    return (
      <div>
        {expiredSessionRedirect && <Snackbar text="Your session has expired. Please re-authenticate." visible={true} />}
        <AssignActivityPackBanner login={true} />
        <div className="container account-form">
          <h1>Good to see you again!</h1>
          <div className="account-container text-center">
            <div className="auth-section">
              <AuthGoogleAccessForm text='Log in with Google' />
              <div className="google-tbd">
                <h4><img alt="" src={informationSrc} /> Having trouble logging in with Google?</h4>
                <p>If you're a Google user, you can also log in using your email address. You just need to create a password.</p>
                <a className="inline-link" href="/password_reset">Create a password</a>
              </div>
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
                    disabled={!(email.length && password.length)}
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
    )
  }
}

export default LoginFormApp;
