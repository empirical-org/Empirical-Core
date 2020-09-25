import React from 'react'

import { SegmentAnalytics, Events } from '../../../../../modules/analytics';

export default class AgreementsAndLinkToLogin extends React.Component {

  handleKeyDownOnLogIn = (e) => {
    if (e.key !== 'Enter') { return }

    this.handleLogInClick()
  }

  handleLogInClick = () => {
    SegmentAnalytics.track(Events.CLICK_LOG_IN, {location: 'alreadyHaveAccount'})
    window.location.href = '/session/new'
  }

  render() {
    return (
      <div className="agreements-and-link-to-login">
        <p className="return-to-login">Already have an account?
          <span className="inline-link" onClick={this.handleLogInClick} onKeyDown={this.handleKeyDownOnLogIn} role="link" tabIndex={0}>Log in</span>
        </p>
        <p className="agreements">By signing up, you agree to our <a href="/tos">Terms of Service</a> and <a href="/privacy">Privacy&nbsp;Policy.</a></p>
      </div>
    )
  }
}
