import * as React from 'react';

import AuthGoogleAccessForm from '../accounts/AuthGoogleAccessForm';

const smallWhiteCheckSrc = `${process.env.CDN_URL}/images/shared/check-small-white.svg`

interface LinkGoogleAccountModalProps {
  close: () => void;
  user: any;
}

interface LinkGoogleAccountModalState {
  checkboxOne?: boolean;
}

export default class LinkGoogleAccountModal
  extends React.Component<LinkGoogleAccountModalProps, LinkGoogleAccountModalState> {

  constructor(props) {
    super(props)

    this.state = {
      checkboxOne: false
    }

    this.toggleCheckbox = this.toggleCheckbox.bind(this)
  }

  renderLinkAccountButton() {
    const { checkboxOne, } = this.state
    let buttonClass = 'quill-button contained primary medium';
    if (checkboxOne) {
      return <AuthGoogleAccessForm offlineAccess={true} text="Link Account" />
    } else {
      buttonClass += ' disabled';
      return <button className={buttonClass} type="button">Link account</button>
    }
  }

  toggleCheckbox() {
    const { checkboxOne } = this.state
    this.setState({ checkboxOne: !checkboxOne })
  }

  renderCheckbox() {
    const { checkboxOne } = this.state

    if (checkboxOne) {
      return (
        <div className="quill-checkbox selected" onClick={this.toggleCheckbox}>
          <img alt="check" src={smallWhiteCheckSrc} />
        </div>
      )
    } else {
      return <div className="quill-checkbox unselected" onClick={this.toggleCheckbox} />
    }
  }

  renderCheckboxes() {
    return (
      <div className="checkboxes">
        <div className="checkbox-row">
          {this.renderCheckbox()}
          <span>
            I understand that I will now log in to Quill via the &ldquo;Log in with Google&rdquo; button.
          </span>
        </div>
      </div>
    )
  }

  render() {
    const { user, close } = this.props
    return (
      <div className="modal-container link-google-account-modal-container">
        <div className="modal-background" />
        <div className="link-google-account-modal quill-modal modal-body">
          <div>
            <h3 className="title">Link your account to Google Classroom</h3>
          </div>
          <p>Your email, {user.email}, is not associated with a Google Classroom account.</p>
          {this.renderCheckboxes()}
          <div className="form-buttons">
            <button
              className="quill-button outlined secondary medium"
              onClick={close}
              type="button"
            >
              Cancel
            </button>
            {this.renderLinkAccountButton()}
          </div>
        </div>
      </div>
    )
  }
}
