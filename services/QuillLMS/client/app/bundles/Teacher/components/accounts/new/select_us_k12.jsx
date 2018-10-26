import React from 'react';
import request from 'request'
import AuthSignUp from './auth_sign_up'
import Input from '../../shared/input'
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
      analytics: new AnalyticsWrapper()
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
    const { password, firstName, lastName, email } = this.state
    let buttonClass = "button contained primary medium"
    if (!password.length || !firstName.length || !lastName.length || !email.length) {
      buttonClass += ' disabled'
    }
    return buttonClass
  }

  handleSubmit(e) {
    const { firstName, lastName, email, password, sendNewsletter } = this.state
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
          state = { lastUpdate: new Date(), errors: body.errors, }
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
    this.setState({ sendNewsletter: !this.state.sendNewsletter, })
  }

  renderNewsletterRow() {
    let checkbox
    if (this.state.sendNewsletter) {
      checkbox = <div className="quill-checkbox selected" onClick={this.toggleNewsletter}><img src={smallWhiteCheckSrc} /></div>
    } else {
      checkbox = <div className="quill-checkbox unselected" onClick={this.toggleNewsletter} />
    }
    return <div className="newsletter-row">{checkbox} <p>Send me a monthly update on new&nbsp;content</p></div>
  }

  render () {
    return (
      <div className="container account-form select-k12">
        <h1>Let's find your school</h1>
        <a href="/sign-up/add-k12"
      </div>
    )
  }
}

export default SignUpTeacher
