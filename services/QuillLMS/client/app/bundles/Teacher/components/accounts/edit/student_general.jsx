import React, { Component } from 'react';

import { timeZoneOptions } from './shared';

import { DropdownInput, Input } from '../../../../Shared/index';

export default class StudentGeneralAccountInfo extends Component {
  constructor(props) {
    super(props);
    const { email, firstName, lastName, userName, timeZone, } = props;

    this.state = {
      email: email,
      firstName: firstName,
      lastName: lastName,
      showButtonSection: false,
      userName: userName,
      timeZone
    };
  }

  componentDidUpdate(prevProps) {
    const { active, email, firstName, lastName, userName, timeZone, } = this.props;

    if (prevProps.active && !active) {
      this.reset();
    }

    if (email !== prevProps.email
      || firstName !== prevProps.firstName
      || lastName !== prevProps.lastName
      || userName !== prevProps.userName
      || timeZone !== prevProps.timeZone
    ) {
      this.setState({
        email,
        firstName,
        lastName,
        userName,
        timeZone
      });
    }
  }

  onEmailChange = e => this.updateField(e, 'email')

  onFirstNameChange = e => this.updateField(e, 'firstName')

  onLastNameChange = e => this.updateField(e, 'lastName')

  onUsernameChange = e => this.updateField(e, 'userName')

  onTimezoneChange = timeZone => {
    this.setState({ timeZone: timeZone.name, });
  };

  activateSection = () => {
    const { active, activateSection } = this.props;
    const { showButtonSection, } = this.state
    if (!active || !showButtonSection) {
      this.setState({ showButtonSection: true }, activateSection);
    }
  }

  handleCancel = () => {
    const { deactivateSection, } = this.props
    this.reset();
    deactivateSection();
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { updateUser, } = this.props
    const { email, firstName, lastName, userName, timeZone, } = this.state;
    const name = `${firstName} ${lastName}`;
    const errorMessages = ['First name cannot be blank', 'Last name cannot be blank', 'Username cannot be blank'];
    let errors = {};

    if (!firstName && !lastName) {
      errors.firstName = errorMessages[0];
      errors.lastName = errorMessages[1];
    } else if (!firstName) {
      errors.firstName = errorMessages[0];
    } else if (!lastName) {
      errors.lastName = errorMessages[1];
    }
    if(!userName) {
      errors.username = errorMessages[2]
    }
    const data = {
      name,
      email,
      username: userName,
      time_zone: timeZone,
    };
    updateUser(data, '/students/update_account', 'Settings saved', errors);
  }

  reset = () => {
    const { email, firstName, lastName, userName, timeZone, } = this.props
    this.setState({
      email,
      firstName,
      lastName,
      userName,
      timeZone,
      showButtonSection: false
    });
  }

  submitClass = () => {
    const { email, firstName, lastName, userName, timeZone, } = this.state;
    let buttonClass = 'quill-button contained primary medium focus-on-light';
    // disabling destructuring because destructuring would cause a namespace collision
    /* eslint-disable react/destructuring-assignment */
    if (firstName === this.props.firstName
      && lastName === this.props.lastName
      && email === this.props.email
      && userName === this.props.userName
      && timeZone === this.props.timeZone
    ) {
      /* eslint-enable react/destructuring-assignment */
      buttonClass += ' disabled';
    }
    return buttonClass;
  }

  updateField = (e, field) => {
    this.setState({[field]: e.target.value });
  }

  renderButtonSection() {
    const { showButtonSection, } = this.state
    if (showButtonSection) {
      return (
        <div className="button-section">
          <button className="quill-button outlined secondary medium focus-on-light" id="cancel" onClick={this.handleCancel} type="button">Cancel</button>
          <input aria-label="Save changes" className={this.submitClass()} name="commit" type="submit" value="Save changes" />
        </div>
      )
    }
  }

  render() {
    const { email, firstName, lastName, userName, timeZone, } = this.state;
    const { accountType, cleverId, errors, googleId, timesSubmitted, isBeingPreviewed } = this.props;
    const selectedTimeZone = timeZoneOptions.find(tz => tz.name === timeZone)
    const oAuthed = (cleverId || googleId);
    const isDisabled = !!oAuthed || isBeingPreviewed;
    const editStatus = isDisabled ? '-not-editable' : '';
    const emailLabel = oAuthed ? 'Email' : 'Email (optional)';
    const teacherCreated = accountType === "Teacher Created Account";

    return (
      <div className="user-account-general user-account-section">
        <h1>General</h1>
        <form acceptCharset="UTF-8" onSubmit={this.handleSubmit} >
          <div className="fields">
            <Input
              autoComplete="given-name"
              characterLimit={isDisabled ? 0 : 50}
              disabled={isDisabled}
              error={errors.firstName}
              handleChange={this.onFirstNameChange}
              id={`first-name${editStatus}`}
              label="First name"
              onClick={!isDisabled ? this.activateSection : null}
              timesSubmitted={timesSubmitted}
              type="text"
              value={firstName}
            />
            <Input
              autoComplete="family-name"
              characterLimit={isDisabled ? 0 : 50}
              disabled={isDisabled}
              error={errors.lastName}
              handleChange={this.onLastNameChange}
              id={`last-name${editStatus}`}
              label="Last name"
              onClick={!isDisabled ? this.activateSection : null}
              timesSubmitted={timesSubmitted}
              type="text"
              value={lastName}
            />
            <Input
              autoComplete="username"
              disabled={isDisabled || teacherCreated}
              error={errors.username}
              handleChange={this.onUsernameChange}
              helperText={teacherCreated ? 'Only your teacher can change your username' : ''}
              id={`username${(isDisabled || teacherCreated) ? '-not-editable' : ''}`}
              label="Username"
              onClick={(!isDisabled && !teacherCreated) ? this.activateSection : null}
              timesSubmitted={timesSubmitted}
              type="text"
              value={userName}
            />
            <Input
              autoComplete="email"
              disabled={isDisabled}
              error={errors.email}
              handleChange={this.onEmailChange}
              id={`email${editStatus}`}
              label={emailLabel}
              onClick={!isDisabled ? this.activateSection : null}
              timesSubmitted={timesSubmitted}
              type="text"
              value={email}
            />
            <DropdownInput
              error={errors.timeZone}
              handleChange={this.onTimezoneChange}
              label="Time zone"
              onClick={this.activateSection}
              options={timeZoneOptions}
              value={selectedTimeZone}
            />
          </div>
          {this.renderButtonSection()}
        </form>
      </div>
    );
  }
}
