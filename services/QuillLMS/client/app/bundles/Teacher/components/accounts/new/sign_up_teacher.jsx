import React from 'react';
import request from 'request'

import AuthSignUp from './auth_sign_up'

import PasswordWrapper from '../shared/password_wrapper'
import AnalyticsWrapper from '../../shared/analytics_wrapper'
import AgreementsAndLinkToLogin from './agreements_and_link_to_login'
import AssignActivityPackBanner from '../assignActivityPackBanner'
import getAuthToken from '../../modules/get_auth_token';
import { Input, } from '../../../../Shared/index'

const smallWhiteCheckSrc = `${process.env.CDN_URL}/images/shared/check-small-white.svg`

class SignUpTeacher extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      sendNewsletter: true,
      errors: {},
      analytics: new AnalyticsWrapper(),
      timesSubmitted: 0
    }
  }

  componentDidMount() {
    document.title = 'Quill.org | Teacher Sign Up'
  }

  handleClickSignUpAsStudent = (e) => {
    window.location.href = '/sign-up/student'
  }

  handleKeyDownOnSignUpAsStudent = (e) => {
    if (e.key !== 'Enter') { return }

    this.handleClickSignUpAsStudent(e)
  }

  handleKeyDownOnToggleNewsletter = (e) => {
    if (e.key !== 'Enter') { return }

    this.handleToggleNewsletter()
  }

  handleSubmit = (e) => {
    const { firstName, lastName, email, password, sendNewsletter, timesSubmitted, } = this.state
    e.preventDefault();
    request({
      url: `${process.env.DEFAULT_URL}/account`,
      method: 'POST',
      json: {
        user: {
          name: `${firstName} ${lastName}`,
          password,
          email,
          role: 'teacher',
          send_newsletter: sendNewsletter,
        },
        authenticity_token: getAuthToken(),
      },
    },
    (err, httpResponse, body) => {
      if (httpResponse.statusCode === 200) {
        // console.log(body);
        window.location = '/sign-up/add-k12'
      } else {
        let state
        if (body.errors) {
          state = { lastUpdate: new Date(), errors: body.errors, timesSubmitted: timesSubmitted + 1}
        } else {
          let message = 'You have entered an incorrect email or password.';
          if (httpResponse.statusCode === 429) {
            message = 'Too many failed attempts. Please wait one minute and try again.';
          }
          state = { lastUpdate: new Date(), message: (body.message || message), }
        }
        this.setState(state)
      }
    });
  }

  handleToggleNewsletter = () => {
    this.setState(prevState => ({ sendNewsletter: !prevState.sendNewsletter, }), () => {
      const { sendNewsletter, } = this.state
      const setState = sendNewsletter ? 'optIn' : 'optOut';
    });
  }

  submitClass = () => {
    const { password, firstName, lastName, email, } = this.state
    let buttonClass = "quill-button contained primary medium focus-on-light"
    if (!password.length || !firstName.length || !lastName.length || !email.length) {
      buttonClass += ' disabled'
    }
    return buttonClass
  }

  update = (e) => {
    this.updateKeyValue(e.target.id, e.target.value)
  }

  updateKeyValue = (key, value) => {
    const newState = Object.assign({}, this.state);
    newState[key] = value;
    this.setState(newState);
  }

  renderNewsletterRow = () => {
    const { sendNewsletter, } = this.state
    let checkbox
    if (sendNewsletter) {
      checkbox = <div aria-checked={true} className="quill-checkbox selected focus-on-light" onClick={this.handleToggleNewsletter} onKeyDown={this.handleKeyDownOnToggleNewsletter} role="checkbox" tabIndex={0}><img alt="check" src={smallWhiteCheckSrc} /></div>
    } else {
      checkbox = <div aria-checked={false} aria-label="Unchecked" className="quill-checkbox unselected focus-on-light" onClick={this.handleToggleNewsletter} onKeyDown={this.handleKeyDownOnToggleNewsletter} role="checkbox" tabIndex={0} />
    }
    return <div className="newsletter-row">{checkbox} <p>Send me a monthly update on new&nbsp;content</p></div>
  }

  render() {
    const { authToken, timesSubmitted, firstName, errors, lastName, email, password, } = this.state
    return (
      <div>
        <AssignActivityPackBanner />
        <div className="container account-form teacher-sign-up">
          <h1>Create an account</h1>
          <p className="sub-header">Are you a student? <span className="inline-link" onClick={this.handleClickSignUpAsStudent} onKeyDown={this.handleKeyDownOnSignUpAsStudent} role="link" tabIndex={0}>Sign up here</span></p>
          <div className="info-and-form-container">
            <div className="info">
              <h2>More than 5,000 schools use Quill&#39;s free online tools to help their students become strong&nbsp;writers.</h2>
              <ul>
                <li>Quill provides free access to 700 writing and grammar&nbsp;activities</li>
                <li>Students receive immediate feedback on their&nbsp;work</li>
                <li>Teachers or guardians identify student needs and measure growth with diagnostics and&nbsp;reports</li>
              </ul>
            </div>
            <div className="account-container text-center">
              <AuthSignUp />
              <div className='break'><span />or<span /></div>
              <div className="teacher-signup-form">
                <div>
                  <form acceptCharset="UTF-8" onSubmit={this.handleSubmit} >
                    <input aria-hidden="true" aria-label="utf8" name="utf8" type="hidden" value="✓" />
                    <input aria-hidden="true" aria-label="authenticity token" name="authenticity_token" type="hidden" value={authToken} />
                    <div className="name">
                      <Input
                        autoComplete="given-name"
                        className="first-name"
                        error={errors.first_name}
                        handleChange={this.update}
                        id="firstName"
                        label="First name"
                        timesSubmitted={timesSubmitted}
                        type="text"
                        value={firstName}
                      />
                      <Input
                        autoComplete="family-name"
                        className="last-name"
                        error={errors.last_name}
                        handleChange={this.update}
                        id="lastName"
                        label="Last name"
                        timesSubmitted={timesSubmitted}
                        type="text"
                        value={lastName}
                      />
                    </div>
                    <Input
                      autoComplete="email"
                      className="email"
                      error={errors.email}
                      handleChange={this.update}
                      id="email"
                      label="Email"
                      timesSubmitted={timesSubmitted}
                      type="email"
                      value={email}
                    />
                    <PasswordWrapper
                      autoComplete="new-password"
                      className="password inspectletIgnore"
                      error={errors.password}
                      id="password"
                      label="Password"
                      onChange={this.update}
                      timesSubmitted={timesSubmitted}
                      value={password}
                    />
                    {this.renderNewsletterRow()}
                    <input aria-label="Sign up" className={this.submitClass()} name="commit" type="submit" value="Sign up" />
                  </form>
                </div>
              </div>
            </div>
          </div>
          <AgreementsAndLinkToLogin />
        </div>
      </div>
    )
  }
}

export default SignUpTeacher
