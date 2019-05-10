import React from 'react';
import request from 'request'
import { SegmentAnalytics, Events } from '../../../../../modules/analytics'; 
import { Input } from 'quill-component-library/dist/componentLibrary'

import AuthSignUp from './auth_sign_up'
import AnalyticsWrapper from '../../shared/analytics_wrapper'
import AgreementsAndLinkToLogin from './agreements_and_link_to_login'
import getAuthToken from '../../modules/get_auth_token';

const smallWhiteCheckSrc = `${process.env.CDN_URL}/images/shared/check-small-white.svg`

class SignUpTeacher extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      email: null,
      password: '',
      sendNewsletter: true,
      errors: {},
      analytics: new AnalyticsWrapper(),
      timesSubmitted: 0
    }

    this.updateKeyValue = this.updateKeyValue.bind(this);
    this.update = this.update.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this)
    this.submitClass = this.submitClass.bind(this)
    this.toggleNewsletter = this.toggleNewsletter.bind(this)
  }

  updateKeyValue(key, value) {
    const newState = Object.assign({}, this.state);
    newState[key] = value;
    this.setState(newState);
  }

  update(e) {
    this.updateKeyValue(e.target.id, e.target.value)
  }

  submitClass() {
    const { password, firstName, lastName, email, } = this.state
    let buttonClass = "quill-button contained primary medium"
    if (!password.length || !firstName.length || !lastName.length || !email.length) {
      buttonClass += ' disabled'
    }
    return buttonClass
  }

  handleSubmit(e) {
    const { firstName, lastName, email, password, sendNewsletter, timesSubmitted, } = this.state
    e.preventDefault();
    SegmentAnalytics.track(Events.SUBMIT_SIGN_UP, {provider: Events.providers.EMAIL});
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

  toggleNewsletter() {
    this.setState({ sendNewsletter: !this.state.sendNewsletter, }, () => {
      let setState = this.state.sendNewsletter ? 'optIn' : 'optOut';
      SegmentAnalytics.track(Events.CLICK_NEWSLETTER_OPT_IN_OUT, {setState: setState});
    });
  }

  renderNewsletterRow() {
    let checkbox
    if (this.state.sendNewsletter) {
      checkbox = <div className="quill-checkbox selected" onClick={this.toggleNewsletter}><img src={smallWhiteCheckSrc} alt="check" /></div>
    } else {
      checkbox = <div className="quill-checkbox unselected" onClick={this.toggleNewsletter} />
    }
    return <div className="newsletter-row">{checkbox} <p>Send me a monthly update on new&nbsp;content</p></div>
  }

  render () {
    const { authToken, timesSubmitted, firstName, errors, lastName, email, password, } = this.state
    return (
      <div className="container account-form teacher-sign-up">
        <h1>Create a teacher account</h1>
        <p className="sub-header">Are you a student?
          <a href="/sign-up/student" onClick={(e) => SegmentAnalytics.track(Events.CLICK_CREATE_STUDENT_USER)}>Sign up here</a>
        </p>
        <div className="info-and-form-container">
          <div className="info">
            <h2>More than 5,000 schools use Quill's free online tools to help their students become strong&nbsp;writers.</h2>
            <ul>
              <li>Quill provides free access to 400 writing and grammar&nbsp;activities</li>
              <li>Students receive immediate feedback on their&nbsp;work</li>
              <li>Teachers identify student needs and measure growth with diagnostics and&nbsp;reports</li>
            </ul>
          </div>
          <div className="account-container text-center">
            <AuthSignUp />
            <div className='break'><span/>or<span/></div>
              <div className="teacher-signup-form">
                <div>
                  <form onSubmit={this.handleSubmit} acceptCharset="UTF-8" >
                    <input name="utf8" type="hidden" value="✓" />
                    <input value={authToken} type="hidden" name="authenticity_token" />
                    <div className="name">
                      <Input
                        label="First name"
                        value={firstName}
                        handleChange={this.update}
                        type="text"
                        className="first-name"
                        id="firstName"
                        error={errors.first_name}
                        timesSubmitted={timesSubmitted}
                      />
                      <Input
                        label="Last name"
                        value={lastName}
                        handleChange={this.update}
                        type="text"
                        className="last-name"
                        id="lastName"
                        error={errors.last_name}
                        timesSubmitted={timesSubmitted}
                      />
                    </div>
                    <Input
                      label="Email"
                      value={email}
                      handleChange={this.update}
                      type="text"
                      className="email"
                      id="email"
                      error={errors.email}
                      timesSubmitted={timesSubmitted}
                    />
                    <Input
                      label="Password"
                      value={password}
                      handleChange={this.update}
                      type='password'
                      className="password"
                      error={errors.password}
                      id="password"
                      timesSubmitted={timesSubmitted}
                    />
                    {this.renderNewsletterRow()}
                    <input type="submit" name="commit" value="Sign up" className={this.submitClass()} />
                  </form>
                </div>
              </div>
          </div>
        </div>
        <AgreementsAndLinkToLogin />
      </div>
    )
  }
}

export default SignUpTeacher
