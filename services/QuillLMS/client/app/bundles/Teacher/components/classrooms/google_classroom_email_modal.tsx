import * as React from 'react'

const smallWhiteCheckSrc = `${process.env.CDN_URL}/images/shared/check-small-white.svg`

interface GoogleClassroomEmailModalProps {
  close: () => void;
  user: any;
}

interface GoogleClassroomEmailModalState {
  checkboxOne?: boolean;
}

export default class GoogleClassroomEmailModal extends React.Component<GoogleClassroomEmailModalProps, GoogleClassroomEmailModalState> {
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
      return <a className={buttonClass} href="/auth/google_oauth2?prompt=consent">Link account</a>
    } else {
      buttonClass += ' disabled';
      return <button className={buttonClass}>Link account</button>
    }
  }

  toggleCheckbox(checkboxNumber: 'checkboxOne'|'checkboxTwo'|'checkboxThree') {
    const newStateObj:{[K in CheckboxNames]?: boolean} = { [checkboxNumber]: !this.state[checkboxNumber], }
    this.setState(newStateObj)
  }

  renderCheckbox(checkboxNumber) {
    const checkbox = this.state[checkboxNumber]
    if (checkbox) {
      return <div className="quill-checkbox selected" onClick={() => this.toggleCheckbox(checkboxNumber)}><img src={smallWhiteCheckSrc} alt="check" /></div>
    } else {
      return <div className="quill-checkbox unselected" onClick={() => this.toggleCheckbox(checkboxNumber)} />
    }
  }

  renderCheckboxes() {
    return (<div className="checkboxes">
      <div className="checkbox-row">
        {this.renderCheckbox('checkboxOne')}
        <span>I understand that I will now log in to Quill via the "Log in with Google" button.</span>
      </div>
    </div>)
  }

  render() {
    const { user, close } = this.props
    return <div className="modal-container google-classroom-email-modal-container">
      <div className="modal-background" />
      <div className="google-classroom-email-modal modal modal-body">
        <div>
          <h3 className="title">Link your account to Google Classroom</h3>
        </div>
        <p>Your email, {user.email}, is not associated with a Google Classroom account.</p>
        {this.renderCheckboxes()}
        <div className="form-buttons">
          <button className="quill-button outlined secondary medium" onClick={close}>Cancel</button>
          {this.renderLinkAccountButton()}
        </div>
      </div>
    </div>
  }
}
