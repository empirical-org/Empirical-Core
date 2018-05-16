import React, { Component } from 'react';
import ReactOnRails from 'react-on-rails';

class PasswordInfo extends Component {
  passwordHintBox() {
    if (this.props.showHintBox) {
      return (
        <div className="password-hint">
          <h4>Password not working? Here is a hint:</h4>
          <p>
            If your teacher created your account, your username is your first
            and last name combined with your classcode. For example:
          </p>
          <div>
            <code>
              John.Smith@magic-apple
            </code>
          </div>
          <p>
            Your password is your last name with the first letter capitalized.
          <br />
            For example:
            <div>
              <code>
                Smith
              </code>
            </div>
          </p>
        </div>
      );
    }
  }

  render() {
    return (
      <div>
        <div className="password-and-signup">
          <a href="/password_reset">Forgot your password?</a>
          <a href="/account/new">New to Quill? Sign up here</a>
        </div>
        {this.passwordHintBox()}
      </div>
    );
  }
}

export default PasswordInfo;
