import React from 'react'
const smallWhiteCheckSrc = `${process.env.CDN_URL}/images/shared/check-small-white.svg`

export default class DeleteAccountModal extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      checkboxOne: false,
      checkboxTwo: false,
      checkboxThree: false
    }
  }

  submitClass() {
    const { checkboxOne, checkboxTwo, checkboxThree, } = this.state
    let buttonClass = 'quill-button contained primary medium';
    if (!(checkboxOne && checkboxTwo && checkboxThree)) {
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
    return (
      <div className="checkboxes">
        <div className="checkbox-row">
          {this.renderCheckbox('checkboxOne')}
          <span>Your personal information</span>
        </div>
        <div className="checkbox-row">
          {this.renderCheckbox('checkboxTwo')}
          <span>Classes and students' assignments and progress</span>
        </div>
        <div className="checkbox-row">
          {this.renderCheckbox('checkboxThree')}
          <span>All content you created, including lessons and projects</span>
        </div>
      </div>
    )
  }

  render() {
    const { cancel, deleteAccount, } = this.props
    return (
      <div>
        <div className="modal-background" />
        <div className="modal delete-account-modal">
          <h1>Delete your Quill account</h1>
          <p>
            When we remove your account, the following information will be permanently deleted.
            Please check each box to confirm your understanding.
          </p>
          {this.renderCheckboxes()}
          <div className="button-section">
            <div className="quill-button outlined secondary medium" id="cancel" onClick={cancel}>Cancel</div>
            <input className={this.submitClass()} name="commit" onClick={deleteAccount} type="submit" value="Delete account" />
          </div>
        </div>
      </div>
    )
  }
}
