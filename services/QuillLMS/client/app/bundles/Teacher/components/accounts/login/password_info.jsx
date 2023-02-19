import React from 'react';
const bulbSrc = `${import.meta.env.VITE_PROCESS_ENV_CDN_URL}/images/onboarding/bulb.svg`

export default class PasswordInfo extends React.Component {

  componentDidUpdate(prevProps) {
    const { showHintBox, } = this.props
    if (showHintBox !== prevProps.showHintBox && showHintBox) {
      const element = document.getElementById('password-hint');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'nearest', });
      }
    }
  }

  render() {
    const { showHintBox, } = this.props

    if (!showHintBox) { return <span /> }

    return (
      <div id="password-hint">
        <h3><span>Having trouble signing in? Here&#39;s a hint:</span> <img alt="Lightbulb with rays shining" src={bulbSrc} /></h3>
        <div>
          <p>Example username:</p>
          <p className="example">jane.smith@magic-apple</p>
          <p>Your username is your first and last name combined with your class code.</p>
        </div>
        <div>
          <p>Example password:</p>
          <p className="example">Smith</p>
          <p>Your password might be your last name with the first letter capitalized.</p>
        </div>
      </div>
    );
  }
}
