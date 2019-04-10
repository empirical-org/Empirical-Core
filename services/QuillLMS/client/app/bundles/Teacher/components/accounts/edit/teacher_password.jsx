import React from 'react';
import { Input, } from 'quill-component-library/dist/componentLibrary'

export default class TeacherGeneralAccountInfo extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      currentPassword: '',
      newPassword: '',
      confirmedNewPassword: '',
      showButtonSection: false
    }

    this.activateSection = this.activateSection.bind(this)
    this.resetAndDeactivateSection = this.resetAndDeactivateSection.bind(this)
    this.reset = this.reset.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.renderContent = this.renderContent.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.active && !nextProps.active) {
      this.reset()
    }
  }

  activateSection(e) {
    if (!this.props.active || !this.state.showButtonSection) {
      this.setState({ showButtonSection: true, })
      this.props.activateSection()
    }
  }

  handleSubmit(e) {
    const { name, email, timeZone, school } = this.state
    e.preventDefault()
    const data = {
      name,
      email,
      time_zone: timeZone,
      school_id: school.id
    };
    this.props.updateUser(data)
  }


  reset() {
    this.setState({
      currentPassword: '',
      newPassword: '',
      confirmedNewPassword: ''
    })
  }

  submitClass() {
    const { currentPassword, newPassword, confirmedNewPassword, } = this.state
    let buttonClass = 'quill-button contained primary medium';
    if (currentPassword.length && newPassword.length && confirmedNewPassword.length ) {
      buttonClass += ' disabled';
    }
    return buttonClass;
  }

  resetAndDeactivateSection() {
    this.reset()
    this.props.deactivateSection()
  }

  renderButtonSection() {
    if (this.state.showButtonSection) {
      return <div className="button-section">
        <div id="cancel" className="quill-button outlined secondary medium" onClick={this.resetAndDeactivateSection}>Cancel</div>
        <input type="submit" name="commit" value="Change password" className={this.submitClass()} />
      </div>
    }
  }

  renderContent() {
    const { currentPassword, newPassword, confirmedNewPassword, } = this.state
    const { errors, active, timesSubmitted, googleId, cleverId, } = this.props
    if (this.props.active) {
      return <form onSubmit={this.handleSubmit} acceptCharset="UTF-8" >
        <div className="fields">
          <div className="current-password-section">
            <Input
              label="Current password"
              value={currentPassword}
              handleChange={(e) => this.handleChange('currentPassword', e)}
              type="text"
              className="current-password"
              error={errors.current_password}
              timesSubmitted={timesSubmitted}
            />
            <a classsName="forgot-password" href="/password_reset">Forgot password?</a>
          </div>
          <Input
            label="New password"
            value={newPassword}
            handleChange={(e) => this.handleChange('newPassword', e)}
            type="text"
            className="new-password"
            error={errors.new_password}
            timesSubmitted={timesSubmitted}
          />
          <Input
            label="Confirm new password"
            value={confirmedNewPassword}
            handleChange={(e) => this.handleChange('confirmedNewPassword', e)}
            type="text"
            className="confirmed-new-password"
            error={errors.confirmed_new_password}
            timesSubmitted={timesSubmitted}
          />
        </div>
        {this.renderButtonSection()}
      </form>
    } else if (googleId || cleverId) {
      return (
        <p className="google-or-clever-password">
          Before you can create a password, you will need to unlink your {googleId ? 'Google' : 'Clever'} account below.
        </p>
      )
    } else {
      return <div className="inactive-password-container">
        <Input
          label="Password"
          value="notapassword"
          type="password"
          className="not-a-password"
          disabled={true}
        />
        <div onClick={this.activateSection} className="change-password">Change password</div>
      </div>
    }
  }

  render() {
    return <div className="teacher-account-password teacher-account-section">
      <h1>Password</h1>
      {this.renderContent()}
    </div>
  }
}
