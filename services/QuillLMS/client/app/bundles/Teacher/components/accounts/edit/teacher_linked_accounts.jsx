import React from 'react';

import UnlinkModal from './unlink_modal'
const smallWhiteCheckSrc = `${process.env.CDN_URL}/images/shared/check-small-white.svg`

export default class TeacherLinkedAccounts extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      showGoogleModal: false,
      showCleverModal: false
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { cleverId, googleId, } = this.props
    if (nextProps.cleverId !== cleverId || nextProps.googleId !== googleId) {
      this.setState({
        showGoogleModal: false,
        showCleverModal: false,
      })
    }
  }

  handleClickUnlinkClever = () => {
    this.setState({ showCleverModal: true, })
  }

  handleClickUnlinkGoogle = () => {
    this.setState({ showGoogleModal: true, })
  }

  handleKeyDownOnPostGoogleClassroomAssignments = (e) => {
    if (e.key !== 'Enter') { return }

    this.handleToggleGoogleClassroomAssignments()
  }

  handleToggleGoogleClassroomAssignments = () => {
    const { updateUser, postGoogleClassroomAssignments, } = this.props
    const data = {
      post_google_classroom_assignments: !postGoogleClassroomAssignments,
      school_options_do_not_apply: true
    };
    updateUser(data, '/teachers/update_my_account', 'Settings saved')
  }

  hideCleverModal = () => {
    this.setState({ showCleverModal: false, })
  }

  hideGoogleModal = () => {
    this.setState({ showGoogleModal: false, })
  }

  isLinkedToClever = () => {
    const { cleverId } = this.props
    return cleverId && cleverId.length
  }

  isLinkedToGoogle = () => {
    const { googleId } = this.props
    return googleId && googleId.length
  }

  renderCheckbox = () => {
    const { postGoogleClassroomAssignments, } = this.props
    if (postGoogleClassroomAssignments) {
      return <div aria-checked={true} className="quill-checkbox selected" onClick={this.handleToggleGoogleClassroomAssignments} onKeyDown={this.handleKeyDownOnPostGoogleClassroomAssignments} role="checkbox" tabIndex={0} ><img alt="check" src={smallWhiteCheckSrc} /></div>
    } else {
      return <div aria-checked={false} aria-label="Unchecked checkbox" className="quill-checkbox unselected" onClick={this.handleToggleGoogleClassroomAssignments} onKeyDown={this.handleKeyDownOnPostGoogleClassroomAssignments} role="checkbox" tabIndex={0} />
    }
  }

  renderCleverSection = () => {
    const { cleverLink, } = this.props
    let actionElement, copy
    if (this.isLinkedToGoogle() && !this.isLinkedToClever()) {
      copy = 'Clever is not linked. Unlink Google to link your Clever account.'
    } else if (!this.isLinkedToClever()) {
      copy = 'Clever is not linked'
      actionElement = <a className="google-or-clever-action" href={cleverLink}>Link your account</a>
    } else {
      copy = 'Clever account is linked'
      actionElement = <button className="google-or-clever-action" onClick={this.handleClickUnlinkClever} type="button">Unlink</button>
    }
    return (<div className="clever-row">
      <div className="first-half">
        <img alt="Clever icon" src={`${process.env.CDN_URL}/images/shared/clever_icon.svg`} />
        <span>{copy}</span>
      </div>
      {actionElement}
    </div>)
  }

  renderGoogleSection = () => {
    let actionElement, copy, checkboxRow
    if (this.isLinkedToClever() && !this.isLinkedToGoogle()) {
      copy = 'Google is not linked. Unlink Clever to link your Google account.'
    } else if (!this.isLinkedToGoogle()) {
      copy = 'Google is not linked'
      actionElement = <a className="google-or-clever-action" href="/auth/google_oauth2?prompt=consent">Link your account</a>
    } else {
      copy = 'Google account is linked'
      actionElement = <button className="google-or-clever-action" onClick={this.handleClickUnlinkGoogle} type="button">Unlink</button>
      checkboxRow = (<div className="checkbox-row post-assignments">
        {this.renderCheckbox()}
        <span>Post assignments as announcements in Google Classroom</span>
      </div>)

    }
    return (
      <div>
        <div className="google-row">
          <div className="first-half">
            <img alt="Google icon" src={`${process.env.CDN_URL}/images/shared/google_icon.svg`} />
            <span>{copy}</span>
          </div>
          {actionElement}
        </div>
        {checkboxRow}
      </div>);
  }

  renderModal = () => {
    const { showGoogleModal, showCleverModal, } = this.state
    const { updateUser, email, timesSubmitted, errors, } = this.props
    if (showGoogleModal) {
      return (<UnlinkModal
        cancel={this.hideGoogleModal}
        email={email}
        errors={errors}
        googleOrClever="Google"
        timesSubmitted={timesSubmitted}
        updateUser={updateUser}
      />)
    } else if (showCleverModal) {
      return (<UnlinkModal
        cancel={this.hideCleverModal}
        email={email}
        errors={errors}
        googleOrClever="Clever"
        timesSubmitted={timesSubmitted}
        updateUser={updateUser}
      />)
    }
  }

  render() {
    return (<div className="user-linked-accounts user-account-section">
      {this.renderModal()}
      <h1>Linked accounts</h1>
      {this.renderGoogleSection()}
      <hr />
      {this.renderCleverSection()}
    </div>)
  }
}
