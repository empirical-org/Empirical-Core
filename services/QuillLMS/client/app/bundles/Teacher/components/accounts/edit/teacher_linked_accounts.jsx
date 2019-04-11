import React from 'react';
import UnlinkModal from './unlink_modal'

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

  renderGoogleSection() {
    let actionElement, copy
    const { googleId, } = this.props
    if (!googleId || !googleId.length) {
      copy = 'Google is not linked'
      actionElement = <a className="google-or-clever-action" href="/auth/google_oauth2">Link your account</a>
    } else {
      copy = 'Google account is linked'
      actionElement = <span className="google-or-clever-action" onClick={this.showGoogleModal}>Unlink</span>
    }
    return (
      <div>
        <div className="google-row">
          <div className="first-half">
            <img src="/images/google_icon.svg" alt="google icon" />
            <span>{copy}</span>
          </div>
          {actionElement}
        </div>
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
        <img src={`${process.env.CDN_URL}/images/shared/clever_icon.svg`} alt="clever icon" />
        <span>{copy}</span>
      </div>
      {actionElement}
    </div>)
  }

  renderModal() {
    const { updateUser, email, timesSubmitted, errors, } = this.props
    if (this.state.showGoogleModal) {
      return (<UnlinkModal
        googleOrClever="Google"
        cancel={this.hideGoogleModal}
        updateUser={this.props.updateUser}
        email={email}
        errors={errors}
        timesSubmitted={timesSubmitted}
      />)
    } else if (this.state.showCleverModal) {
      return (<UnlinkModal
        googleOrClever="Clever"
        cancel={this.hideCleverModal}
        updateUser={this.props.updateUser}
        email={email}
        errors={errors}
        timesSubmitted={timesSubmitted}
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
