import React from 'react';

import UnlinkModal from './unlink_modal'
import AuthGoogleAccessForm from '../AuthGoogleAccessForm';

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

  renderCleverSection = () => {
    const { cleverLink, } = this.props
    let actionElement, copy
    if (this.isLinkedToGoogle() && !this.isLinkedToClever()) {
      copy = 'Clever is not linked. Unlink Google to link your Clever account.'
    } else if (!this.isLinkedToClever()) {
      copy = 'Clever is not linked'
      actionElement = (
        <a
          className='google-or-clever-action'
          href={cleverLink}
        >
          Link your account
        </a>
      )
    } else {
      copy = 'Clever account is linked'
      actionElement = (
        <button
          className='google-or-clever-action'
          onClick={this.handleClickUnlinkClever}
          type='button'
        >
          Unlink
        </button>
      )
    }
    return (
      <div className='clever-row'>
        <div className='first-half'>
          <img alt='Clever icon' src={`${process.env.CDN_URL}/images/shared/clever_icon.svg`} />
          <span>{copy}</span>
        </div>
        {actionElement}
      </div>
    )
  }

  renderGoogleSection = () => {
    let actionElement, copy

    if (this.isLinkedToClever() && !this.isLinkedToGoogle()) {
      copy = 'Google is not linked. Unlink Clever to link your Google account.'
    } else if (!this.isLinkedToGoogle()) {
      copy = 'Google is not linked'

      actionElement = (
        <AuthGoogleAccessForm
          buttonClass='interactive-wrapper'
          offlineAccess={true}
          showIcon={false}
          spanClass='google-or-clever-action'
          text='Link your account'
        />
      )
    } else {
      copy = 'Google account is linked'
      actionElement = (
        <button
          className='google-or-clever-action'
          onClick={this.handleClickUnlinkGoogle}
          type='button'
        >
          Unlink
        </button>
      )
    }
    return (
      <div>
        <div className='google-row'>
          <div className='first-half'>
            <img alt='Google icon' src={`${process.env.CDN_URL}/images/shared/google_icon.svg`} />
            <span>{copy}</span>
          </div>
          {actionElement}
        </div>
      </div>
    );
  }

  renderModal = () => {
    const { showGoogleModal, showCleverModal, } = this.state
    const { updateUser, email, timesSubmitted, errors, } = this.props
    if (showGoogleModal) {
      return (
        <UnlinkModal
          cancel={this.hideGoogleModal}
          email={email}
          errors={errors}
          googleOrClever='Google'
          timesSubmitted={timesSubmitted}
          updateUser={updateUser}
        />
      )
    } else if (showCleverModal) {
      return (
        <UnlinkModal
          cancel={this.hideCleverModal}
          email={email}
          errors={errors}
          googleOrClever='Clever'
          timesSubmitted={timesSubmitted}
          updateUser={updateUser}
        />
      )
    }
  }

  render() {
    return (
      <div className='user-linked-accounts user-account-section'>
        {this.renderModal()}
        <h1>Linked accounts</h1>
        {this.renderGoogleSection()}
        <hr />
        {this.renderCleverSection()}
      </div>
    )
  }
}
