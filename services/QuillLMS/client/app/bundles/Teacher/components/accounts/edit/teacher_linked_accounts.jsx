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

    this.hideGoogleModal = this.hideGoogleModal.bind(this)
    this.hideCleverModal = this.hideCleverModal.bind(this)
    this.showGoogleModal = this.showGoogleModal.bind(this)
    this.showCleverModal = this.showCleverModal.bind(this)
    this.toggleGoogleClassroomAssignments = this.toggleGoogleClassroomAssignments.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.cleverId !== this.props.cleverId || nextProps.googleId !== this.props.googleId) {
      this.setState({
        showGoogleModal: false,
        showCleverModal: false,
      })
    }
  }

  hideGoogleModal() {
    this.setState({ showGoogleModal: false, })
  }

  hideCleverModal() {
    this.setState({ showCleverModal: false, })
  }

  showGoogleModal() {
    this.setState({ showGoogleModal: true, })
  }

  showCleverModal() {
    this.setState({ showCleverModal: true, })
  }

  toggleGoogleClassroomAssignments() {
    const { updateUser, postGoogleClassroomAssignments, } = this.props
    const data = {
      post_google_classroom_assignments: !postGoogleClassroomAssignments,
      school_options_do_not_apply: true
    };
    updateUser(data, '/teachers/update_my_account', 'Settings saved')
  }

  renderCheckbox() {
    const { postGoogleClassroomAssignments, } = this.props
    if (postGoogleClassroomAssignments) {
      return <div className="quill-checkbox selected" onClick={this.toggleGoogleClassroomAssignments}><img alt="check" src={smallWhiteCheckSrc} /></div>
    } else {
      return <div className="quill-checkbox unselected" onClick={this.toggleGoogleClassroomAssignments} />
    }
  }

  renderGoogleSection() {
    let actionElement, copy, checkboxRow
    const { googleId, } = this.props
    if (!googleId || !googleId.length) {
      copy = 'Google is not linked'
      actionElement = <a className="google-or-clever-action" href="/auth/google_oauth2?prompt=consent">Link your account</a>
    } else {
      copy = 'Google account is linked'
      actionElement = <span className="google-or-clever-action" onClick={this.showGoogleModal}>Unlink</span>
      checkboxRow = (<div className="checkbox-row post-assignments">
        {this.renderCheckbox()}
        <span>Post assignments as announcements in Google Classroom</span>
      </div>)

    }
    return (
      <div>
        <div className="google-row">
          <div className="first-half">
            <img alt="google icon" src="/images/google_icon.svg" />
            <span>{copy}</span>
          </div>
          {actionElement}
        </div>
        {checkboxRow}
      </div>);
  }

  renderCleverSection() {
    let actionElement, copy
    const { cleverId, } = this.props
    if (!cleverId || !cleverId.length) {
      copy = 'Clever is not linked'
      actionElement = <a className="google-or-clever-action" href={this.props.cleverLink}>Link your account</a>
    } else {
      copy = 'Clever account is linked'
      actionElement = <span className="google-or-clever-action" onClick={this.showCleverModal}>Unlink</span>
    }
    return (<div className="clever-row">
      <div className="first-half">
        <img alt="clever icon" src={`${process.env.CDN_URL}/images/shared/clever_icon.svg`} />
        <span>{copy}</span>
      </div>
      {actionElement}
    </div>)
  }

  renderModal() {
    const { updateUser, email, timesSubmitted, errors, } = this.props
    if (this.state.showGoogleModal) {
      return (<UnlinkModal
        cancel={this.hideGoogleModal}
        email={email}
        errors={errors}
        googleOrClever="Google"
        timesSubmitted={timesSubmitted}
        updateUser={this.props.updateUser}
      />)
    } else if (this.state.showCleverModal) {
      return (<UnlinkModal
        cancel={this.hideCleverModal}
        email={email}
        errors={errors}
        googleOrClever="Clever"
        timesSubmitted={timesSubmitted}
        updateUser={this.props.updateUser}
      />)
    }
  }

  render() {
    return <div className="teacher-account-linked-accounts teacher-account-section">
      {this.renderModal()}
      <h1>Linked accounts</h1>
      {this.renderGoogleSection()}
      <hr />
      {this.renderCleverSection()}
    </div>
  }
}
