import React, { Component } from 'react';
import { Input, } from 'quill-component-library/dist/componentLibrary'

export default class UpdatePassword extends Component {
  state = {
    currentPassword: '',
    newPassword: '',
    confirmedNewPassword: '',
    showButtonSection: false
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.active && !nextProps.active) {
      this.reset()
    }
  }

  activateSection = (e) => {
    if (!this.props.active || !this.state.showButtonSection) {
      this.setState({ showButtonSection: true, })
      this.props.activateSection()
    }
  }

  handleSubmit = (e) => {
    const { currentPassword, newPassword, confirmedNewPassword, } = this.state;
    const { updateUser, role } = this.props;
    const url = role === 'teacher' ? '/teachers/update_my_password' : '/students/update_password';
    e.preventDefault()
    const data = {
      current_password: currentPassword,
      new_password: newPassword,
      confirmed_new_password: confirmedNewPassword
    };
    updateUser(data, url, 'Settings saved')
  }


  reset = () => {
    this.setState({
      currentPassword: '',
      newPassword: '',
      confirmedNewPassword: ''
    })
  }

  handleChange = (field, e) => {
    this.setState({ [field]: e.target.value, })
  }

  submitClass = () => {
    const { currentPassword, newPassword, confirmedNewPassword, } = this.state
    let buttonClass = 'quill-button contained primary medium';
    if (!(currentPassword.length && newPassword.length && confirmedNewPassword.length)) {
      buttonClass += ' disabled';
    }
    return buttonClass;
  }

  resetAndDeactivateSection = () => {
    this.reset()
    this.props.deactivateSection()
  }

  renderButtonSection = () => {
    if (this.state.showButtonSection) {
      return (<div className="button-section">
        <div className="quill-button outlined secondary medium" id="cancel" onClick={this.resetAndDeactivateSection}>Cancel</div>
        <input className={this.submitClass()} name="commit" type="submit" value="Change password" />
      </div>)
    }
  }

  renderContent = () => {
    const { currentPassword, newPassword, confirmedNewPassword, } = this.state
    const { errors, active, timesSubmitted, googleId, cleverId, } = this.props
    if (active) {
      return (<form acceptCharset="UTF-8" onSubmit={this.handleSubmit} >
        <div className="fields">
          <div className="current-password-section">
            <Input
              className="current-password inspectletIgnore"
              error={errors.current_password}
              handleChange={(e) => this.handleChange('currentPassword', e)}
              label="Current password"
              timesSubmitted={timesSubmitted}
              type="password"
              value={currentPassword}
            />
            <a className="forgot-password" href="/password_reset">Forgot password?</a>
          </div>
          <Input
            className="new-password inspectletIgnore"
            error={errors.new_password}
            handleChange={(e) => this.handleChange('newPassword', e)}
            label="New password"
            timesSubmitted={timesSubmitted}
            type="password"
            value={newPassword}
          />
          <Input
            className="confirmed-new-password inspectletIgnore"
            error={errors.confirmed_new_password}
            handleChange={(e) => this.handleChange('confirmedNewPassword', e)}
            label="Confirm new password"
            timesSubmitted={timesSubmitted}
            type="password"
            value={confirmedNewPassword}
          />
        </div>
        {this.renderButtonSection()}
      </form>)
    } else if (googleId || cleverId) {
      return (
        <p className="google-or-clever-password">
          Before you can create a password, you will need to unlink your {googleId ? 'Google' : 'Clever'} account&nbsp;below.
        </p>
      )
    } else {
      return (<div className="inactive-password-container">
        <Input
          className="not-a-password"
          disabled={true}
          label="Password"
          type="password"
          value="notapassword"
        />
        <div className="change-password" onClick={this.activateSection}>Change password</div>
      </div>)
    }
  }

  render() {
    return (<div className="teacher-account-password teacher-account-section">
      <h1>Password</h1>
      {this.renderContent()}
    </div>)
  }
}
