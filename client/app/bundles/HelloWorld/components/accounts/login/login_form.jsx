import React, { Component } from 'react';
import ReactOnRails from 'react-on-rails';
import request from 'request';

class LoginFormApp extends Component {
  constructor() {
    super();
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      showPass: false,
      email: '',
      password: '',
    };
  }

  clickHandler() {
    this.setState(prevState => ({
      showPass: !prevState.showPass,
    }));
  }

  togglePass() {
    return !this.state.showPass ? 'password' : 'text';
  }

  toggleButtonText() {
    return !this.state.showPass ? 'Show' : 'Hide';
  }

  toggleButtonClass() {
    return !this.state.showPass ? 'not-showing' : 'showing-password';
  }

  handleEmailChange(e) {
    this.setState({ email: e.target.value, });
  }

  handlePasswordChange(e) {
    this.setState({ password: e.target.value, });
  }

  handleSubmit(e) {
    request({
      url: `${process.env.DEFAULT_URL}/session/login_through_ajax`,
      method: 'POST',
      json: { user: this.state, authenticity_token: ReactOnRails.authenticityToken(), },
    },
    (err, httpResponse, body) => {
      if (httpResponse.statusCode === 200 && body.redirect) {
        window.location = `${process.env.DEFAULT_URL}${body.redirect}`;
      } else {
        this.setState({ lastUpdate: new Date(), message: (body.message || 'You have entered an incorrect email/username or password.'), });
      }
    });
    e.preventDefault();
  }

  render() {
    return (
      <div>
        <div key={this.state.lastUpdate} className={`error ${this.state.message ? 'shake' : null}`}>
          {this.state.message}
        </div>
        <form id="new_user" className="new_user" onSubmit={this.handleSubmit} acceptCharset="UTF-8" >
          <input name="utf8" type="hidden" value="✓" />
          <input value={this.state.authToken} type="hidden" name="authenticity_token" />
          <label>Email or username</label>
          <input
            placeholder="Email or Username"
            name="user[email]"
            value={this.state.email}
            onChange={this.handleEmailChange}
            type="text"
          />
          <label>Password</label>
          <div className="login-password">
            <input
              placeholder="Password"
              className="password-input"
              name="user[password]"
              value={this.state.password}
              onChange={this.handlePasswordChange}
              type={this.togglePass()}
            />
            <div
              onClick={() => { this.clickHandler(); }}
              className={this.toggleButtonClass()}
            >
              {this.toggleButtonText()}
            </div>
          </div>
          <input type="submit" name="commit" value="Login" />
        </form>
      </div>
    );
  }
}

export default LoginFormApp;
