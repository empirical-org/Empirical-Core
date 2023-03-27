import React, { Component } from 'react';

import { Input } from '../../../../Shared/index';
import PasswordWrapper from '../shared/password_wrapper';

export default class UpdatePassword extends Component {
  state = {
    currentPassword: '',
    newPassword: '',
    showButtonSection: false
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { active, } = this.props
    if (active && !nextProps.active) {
      this.reset();
    }
  }

  onCurrentPasswordChange = (e) => this.handleChange('currentPassword', e)

  onNewPasswordChange = (e) => this.handleChange('newPassword', e)

  handleChange = (field, e) => {
    this.setState({ [field]: e.target.value, });
  }

  handleClickCancel = () => {
    const { deactivateSection, } = this.props
    this.reset();
    deactivateSection();
  }

  handleClickChangePassword = (e) => {
    const { showButtonSection, } = this.state
    const { active, activateSection, isBeingPreviewed, } = this.props;
    if (isBeingPreviewed || active || showButtonSection ) { return }

    this.setState({ showButtonSection: true, });
    activateSection();
  }

  handleSubmit = (e) => {
    const { currentPassword, newPassword, } = this.state;
    const { updateUser, role } = this.props;
    const url = role === 'teacher' ? '/teachers/update_my_password' : '/students/update_password';
    e.preventDefault()
    const data = {
      current_password: currentPassword,
      new_password: newPassword
    };
    updateUser(data, url, 'Settings saved');
  }

  reset = () => {
    this.setState({
      currentPassword: '',
      newPassword: ''
    });
  }

  submitClass = () => {
    const { currentPassword, newPassword, } = this.state
    let buttonClass = 'quill-button contained primary medium focus-on-light';
    if (!(currentPassword.length && newPassword.length)) {
      buttonClass += ' disabled';
    }
    return buttonClass;
  }

  renderButtonSection = () => {
    const { showButtonSection, } = this.state
    if (showButtonSection) {
      return (
        <div className="button-section">
          <button className="quill-button outlined secondary medium focus-on-light" id="cancel" onClick={this.handleClickCancel} type="button">Cancel</button>
          <input aria-label="Change password" className={this.submitClass()} name="commit" type="submit" value="Change password" />
        </div>
      )
    }
  }

  renderContent = () => {
    const { currentPassword, newPassword, } = this.state
    const { errors, active, timesSubmitted, googleId, cleverId, role,} = this.props;
    const accountType = googleId ? 'Google' : 'Clever';
    const teacherScript = `Before you can create a password, you will need to unlink your ${accountType} account below.`;
    const studentScript = `Your Quill account is linked to ${accountType}. Go to your ${accountType} account settings to change your password.`;
    if (active) {
      return (
        <form acceptCharset="UTF-8" onSubmit={this.handleSubmit} >
          <div className="fields">
            <div className="current-password-section">
              <PasswordWrapper
                autoComplete="current-password"
                className="current-password inspectletIgnore"
                error={errors.current_password}
                label="Current password"
                onChange={this.onCurrentPasswordChange}
                timesSubmitted={timesSubmitted}
                value={currentPassword}
              />
              <a className="forgot-password inline-link" href="/password_reset">Forgot password?</a>
            </div>
            <PasswordWrapper
              autoComplete="new-password"
              className="new-password inspectletIgnore"
              error={errors.new_password}
              label="New password"
              onChange={this.onNewPasswordChange}
              timesSubmitted={timesSubmitted}
              value={newPassword}
            />
          </div>
          {this.renderButtonSection()}
        </form>
      )
    } else if (googleId || cleverId) {
      return (
        <p className="google-or-clever-password">{role === 'teacher' ? teacherScript : studentScript}</p>
      )
    } else {
      return (
        <div className="inactive-password-container">
          <Input
            className="not-a-password"
            disabled={true}
            label="Password"
            type="password"
            value="notapassword"
          />
          <button className="change-password focus-on-light" onClick={this.handleClickChangePassword} type="button">Change password</button>
        </div>
      )
    }
  }

  render() {
    return (
      <div className="user-account-password user-account-section">
        <h1>Password</h1>
        {this.renderContent()}
      </div>
    )
  }
}
