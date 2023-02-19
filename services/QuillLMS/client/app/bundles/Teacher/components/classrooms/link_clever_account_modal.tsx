import * as React from 'react'

const smallWhiteCheckSrc = `${import.meta.env.VITE_PROCESS_ENV_CDN_URL}/images/shared/check-small-white.svg`

interface LinkCleverAccountModalProps {
  cleverLink: string;
  close: () => void;
  user: any;
}

interface LinkCleverAccountModalState {
  checkboxOne?: boolean;
}

export default class LinkCleverAccountModal
  extends React.Component<LinkCleverAccountModalProps, LinkCleverAccountModalState> {

  constructor(props) {
    super(props)

    this.state = {
      checkboxOne: false
    }

    this.toggleCheckbox = this.toggleCheckbox.bind(this)
  }

  renderLinkAccountButton() {
    const { cleverLink } = this.props
    const { checkboxOne } = this.state

    let buttonClass = 'quill-button contained primary medium';
    if (checkboxOne) {
      return <a className={buttonClass} href={cleverLink}>Link account</a>
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
            I understand that I will now log in to Quill via the &ldquo;Log in with Clever&rdquo; button.
          </span>
        </div>
      </div>
    )
  }

  render() {
    const { user, close } = this.props
    return (
      <div className="modal-container link-clever-account-modal-container">
        <div className="modal-background" />
        <div className="link-clever-account-modal quill-modal modal-body">
          <div>
            <h3 className="title">Link your account to Clever</h3>
          </div>
          <p>Your email, {user.email}, is not associated with a Clever account.</p>
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
