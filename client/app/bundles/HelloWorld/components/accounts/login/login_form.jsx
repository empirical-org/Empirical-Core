import React, { Component } from 'react';
import ReactOnRails from 'react-on-rails';
import $ from 'jquery';

class LoginFormApp extends Component {
  constructor() {

    super();

    this.state = {
      showPass: false,
      authToken: ReactOnRails.authenticityToken()
    }

  }

  loginAttempt(user, password) {
    const csrfToken = ReactOnRails.authenticityToken();
    $.ajax({
        type: 'POST',
        url: '/session',
        data: {
          user: {
          username: user,
          password: password
          }
        },
        error: this.signUpError
      });
  }

  signUpError(xhr) {
    var errors = $.parseJSON(xhr.responseText).errors;
    this.setState({errors: errors});
  }

  handleSubmit(e) {
    e.preventDefault();
    this.loginAttempt(this.user.value, this.password.value);
  }

  clickHandler() {
    this.setState(prevState => ({
      showPass: !prevState.showPass
    }));
  }

  togglePass() {
    return !this.state.showPass ? 'password' : 'text';
  }

  toggleButtonText() {
    return !this.state.showPass ? 'show' : 'hide';
  }

  render() {
    return (
        <form id='new_user' className='new_user' action='/session' accept-charset="UTF-8" method="post">
          <input name="utf8" type="hidden" value="✓"/>
          <input value={this.state.authToken} type='hidden' name='authenticity_token'/>
          <label>Email or username</label>
          <input
            name="user[email]"
            ref={(input) => {
              this.user = input;
              }
            }
            type='text'/>
          <label>Password</label>
          <div className='login-password'>
            <input
              name="user[password]"
              ref={(input) => {
                this.password = input;
                }
              }
              type={this.togglePass()}/>
            <button style={{backgroundColor: '#00c2a2', color: 'white'}} onClick={() => {this.clickHandler()}}>{this.toggleButtonText()}</button>
          </div>
          <input type='submit' name="commit" value='Login'/>
        </form>
    );
  }
}

export default LoginFormApp;
