import React from 'react'

import { Input } from '../../../../Shared/index'

const smallWhiteCheckSrc = `${import.meta.env.VITE_PROCESS_ENV_CDN_URL}/images/shared/check-small-white.svg`

export default class UnlinkModal extends React.Component {
  constructor(props) {
    super(props)

    const { email } = this.props

    this.state = {
      email,
      password: '',
      checkboxOne: false,
      checkboxTwo: false,
      checkboxThree: false
    }
  }

  handleChange = (field, e) => {
    this.setState({ [field]: e.target.value, })
  };

  handleSubmit = e => {
    const { updateUser, googleOrClever, } = this.props
    const { email, password, } = this.state
    e.preventDefault()
    const data = {
      email,
      password,
      school_options_do_not_apply: true
    };
    if (googleOrClever === 'Google') {
      data.google_id = null
      data.signed_up_with_google = false
    } else {
      data.clever_id = null
    }
    updateUser(data, '/teachers/update_my_account', `${googleOrClever} unlinked`)
  };

  submitClass() {
    const { googleOrClever, } = this.props
    const { email, password, checkboxOne, checkboxTwo, checkboxThree, } = this.state
    const googleOrCleverCheckboxesChecked = googleOrClever === 'Clever' ? (checkboxOne && checkboxTwo && checkboxThree) : checkboxOne
    let buttonClass = 'quill-button contained primary medium';
    if (!(email.length && password.length && googleOrCleverCheckboxesChecked)) {
      buttonClass += ' disabled';
    }
    return buttonClass;
  }

  toggleCheckbox = checkboxNumber => {
    this.setState({ [checkboxNumber]: !this.state[checkboxNumber], })
  };

  renderCheckbox(checkboxNumber) {
    const checkbox = this.state[checkboxNumber]
    if (checkbox) {
      return <div className="quill-checkbox selected" onClick={() => this.toggleCheckbox(checkboxNumber)}><img alt="check" src={smallWhiteCheckSrc} /></div>
    } else {
      return <div className="quill-checkbox unselected" onClick={() => this.toggleCheckbox(checkboxNumber)} />
    }
  }

  renderCheckboxes() {
    const { googleOrClever, } = this.props
    if (googleOrClever === 'Google') {
      return (
        <div className="checkboxes">
          <div className="checkbox-row">
            {this.renderCheckbox('checkboxOne')}
            <span>I understand that I will no longer be able to sync classes with Google Classroom.</span>
          </div>
        </div>
      )
    } else {
      return (
        <div className="checkboxes">
          <div className="checkbox-row">
            {this.renderCheckbox('checkboxOne')}
            <span>I understand that I no longer have access to Quill through Clever.</span>
          </div>
          <div className="checkbox-row">
            {this.renderCheckbox('checkboxTwo')}
            <span>I understand that I now log in to Quill using the "log in" button on the homepage.</span>
          </div>
          <div className="checkbox-row">
            {this.renderCheckbox('checkboxThree')}
            <span>I understand that my students can still access Quill through Clever.</span>
          </div>
        </div>
      )
    }
  }

  render() {
    const { googleOrClever, cancel, timesSubmitted, errors, } = this.props
    const { email, password, } = this.state
    return (
      <div>
        <div className="modal-background" />
        <div className={`modal unlink-modal ${googleOrClever.toLowerCase()}`}>
          <h1>Unlink your {googleOrClever} account</h1>
          <p>
            Before we unlink your account,
            please create a password to use when logging into Quill.
          </p>
          <Input
            className="email"
            error={errors.email}
            handleChange={(e) => this.handleChange('email', e)}
            label="Change email (optional)"
            timesSubmitted={timesSubmitted}
            type="text"
            value={email}
          />
          <Input
            className="password inspectletIgnore"
            error={errors.password}
            handleChange={(e) => this.handleChange('password', e)}
            label="Password"
            timesSubmitted={timesSubmitted}
            type="password"
            value={password}
          />
          {this.renderCheckboxes()}
          <div className="button-section">
            <div className="quill-button outlined secondary medium" id="cancel" onClick={cancel}>Cancel</div>
            <input
              className={this.submitClass()}
              name="commit"
              onClick={this.handleSubmit}
              type="submit"
              value={`Unlink ${googleOrClever}`}
            />
          </div>
        </div>
      </div>
    )
  }
}
