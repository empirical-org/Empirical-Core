import React from 'react';
import request from 'request'
import AuthSignUp from './auth_sign_up'
import Input from '../../shared/input'
import AnalyticsWrapper from '../../shared/analytics_wrapper'
import AgreementsAndLinkToLogin from './agreements_and_link_to_login'
import getAuthToken from '../../modules/get_auth_token';

class SignUpStudent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      username: '',
      email: null,
      password: '',
      errors: {},
      analytics: new AnalyticsWrapper()
    }

    this.updateKeyValue = this.updateKeyValue.bind(this);
    this.update = this.update.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this)
    this.submitClass = this.submitClass.bind(this)
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
    const { password, firstName, lastName, username } = this.state
    let buttonClass = "button contained primary medium"
    if (!password.length || !firstName.length || !lastName.length || !username.length) {
      buttonClass += ' disabled'
    }
    return buttonClass
  }

  handleSubmit(e) {
    const { firstName, lastName, username, password } = this.state
    const email = this.state.email && this.state.email.length ? this.state.email : null
    e.preventDefault();
    request({
      url: `${process.env.DEFAULT_URL}/account`,
      method: 'POST',
      json: {
        user: {
          name: `${firstName} ${lastName}`,
          password,
          username,
          email,
          role: 'student',
          account_type: 'Student Created Account'
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
        if (body.errors) {
          state = { lastUpdate: new Date(), errors: body.errors, }
        } else {
          let message = 'You have entered an incorrect email/username or password.';
          if (httpResponse.statusCode === 429) {
            message = 'Too many failed attempts. Please wait one minute and try again.';
          }
          state = { lastUpdate: new Date(), message: (body.message || message), }
        }
        this.setState(state)
      }
    });
  }

  render () {
    return (
      <div className="container account-form student-sign-up">
        <h1>Create a student account</h1>
        <p className="sub-header">Are you a teacher? <a href="/sign-up/teacher">Sign up here</a></p>
        <div className="account-container text-center">
          <AuthSignUp />
          <div className='break'><span/>or<span/></div>
          <div className="student-signup-form">
            <div>
              <form onSubmit={this.handleSubmit} acceptCharset="UTF-8" >
                <input name="utf8" type="hidden" value="✓" />
                <input value={this.state.authToken} type="hidden" name="authenticity_token" />
                <div className="name">
                  <Input
                    label="First name"
                    value={this.state.firstName}
                    handleChange={this.update}
                    type="text"
                    className="first-name"
                    id="firstName"
                    error={this.state.errors.first_name}
                  />
                  <Input
                    label="Last name"
                    value={this.state.lastName}
                    handleChange={this.update}
                    type="text"
                    className="last-name"
                    id="lastName"
                    error={this.state.errors.last_name}
                  />
                </div>
                <Input
                  label="Username"
                  value={this.state.username}
                  handleChange={this.update}
                  type="text"
                  className="username"
                  id="username"
                  error={this.state.errors.username}
                />
                <Input
                  label="Email (optional)"
                  value={this.state.email}
                  handleChange={this.update}
                  type="text"
                  className="email"
                  id="email"
                  error={this.state.errors.email}
                />
                <Input
                  label="Password"
                  value={this.state.password}
                  handleChange={this.update}
                  type='password'
                  className="password"
                  error={this.state.errors.password}
                  id="password"
                />
                <input type="submit" name="commit" value="Sign up" className={this.submitClass()} />
              </form>
            </div>
          </div>
        </div>
        <AgreementsAndLinkToLogin />
      </div>
    )
  }
}

export default SignUpStudent
