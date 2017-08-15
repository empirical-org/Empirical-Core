import React, { Component } from 'react';
import ReactOnRails from 'react-on-rails';

class LoginFormApp extends Component {
  constructor() {
    super();

    this.state = {
      showPass: false,
      authToken: ReactOnRails.authenticityToken()
    }
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
    return !this.state.showPass ? 'Show' : 'Hide';
  }

  toggleButtonClass() {
    return !this.state.showPass ? 'not-showing' : 'showing-password';
  }

  render() {
    return (
        <form id='new_user' className='new_user' action='/session' acceptCharset="UTF-8" method="post">
          <input name="utf8" type="hidden" value="✓"/>
          <input value={this.state.authToken} type='hidden' name='authenticity_token'/>
          <label>Email or username</label>
          <input
            placeholder="Email or Username"
            name="user[email]"
            type='text'/>
          <label>Password</label>
          <div className='login-password'>
            <input
              placeholder="Password"
              className='password-input'
              name="user[password]"
              type={this.togglePass()}/>
            <div
              onClick={() => {this.clickHandler()}}
              className={this.toggleButtonClass()}>
                {this.toggleButtonText()}
            </div>
          </div>
          <input type='submit' name="commit" value='Login'/>
        </form>
    );
  }
}

export default LoginFormApp;
