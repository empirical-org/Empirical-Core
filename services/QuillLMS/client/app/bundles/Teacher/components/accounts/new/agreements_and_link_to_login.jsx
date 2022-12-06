import * as React from 'react'

import Agreements from '../shared/agreements'

export default class AgreementsAndLinkToLogin extends React.Component {

  handleKeyDownOnLogIn = (e) => {
    if (e.key !== 'Enter') { return }

    this.handleLogInClick()
  }

  handleLogInClick = () => {
    window.location.href = '/session/new'
  }

  render() {
    return (
      <div className="agreements-and-link-to-login">
        <p className="return-to-login">Already have an account?
          <span className="inline-link" onClick={this.handleLogInClick} onKeyDown={this.handleKeyDownOnLogIn} role="link" tabIndex={0}>Log in</span>
        </p>
        <Agreements />
      </div>
    )
  }
}
