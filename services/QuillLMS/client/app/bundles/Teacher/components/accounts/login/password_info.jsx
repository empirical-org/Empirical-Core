import React from 'react';
const bulbSrc = `${process.env.CDN_URL}/images/onboarding/bulb.svg`

export default class PasswordInfo extends React.Component {
  passwordHintBox() {
    if (this.props.showHintBox) {
      return (
        <div className="password-hint">
          <h3><span>Having trouble signing in? Here's a hint:</span> <img src={bulbSrc}/></h3>
          <div className="username">
            <p>Example username:</p>
            <p className="example">jane.smith@magic-apple</p>
            <p>Your username is your first and last name combined with your class code.</p>
          </div>
          <div className="password">
            <p>Example password:</p>
            <p>Smith</p>
            <p>Your password might be your last name with the first letter capitalized.</p>
          </div>
        </div>
      );
    } else {
      return <span/>
    }
  }

  render() {
    return this.passwordHintBox();
  }
}
