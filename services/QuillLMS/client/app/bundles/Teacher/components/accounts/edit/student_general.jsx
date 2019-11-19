import React, { Component } from 'react';
import { Input } from 'quill-component-library/dist/componentLibrary';

export default class StudentGeneralAccountInfo extends Component {
  constructor(props) {
    super(props);
    const { email, firstName, lastName, userName} = props;
    this.state = {
      email: email,
      firstName: firstName,
      lastName: lastName,
      showButtonSection: false,
      userName: userName
    };
  }

  componentDidUpdate(prevProps) {
    const { active, email, firstName, lastName, userName } = this.props;

    if (prevProps.active && !active) {
      this.reset();
    }

    if (email !== prevProps.email
      || firstName !== prevProps.firstName
      || lastName !== prevProps.lastName
      || userName !== prevProps.userName
    ) {
      this.setState({
        email,
        firstName,
        lastName,
        userName
      });
    }
  }

  activateSection = () => {
    const { active, activateSection } = this.props;
    if (!active || !this.state.showButtonSection) {
      this.setState({ showButtonSection: true }, activateSection);
    }
  }

  reset = () => {
    const { email, firstName, lastName, userName } = this.props
    this.setState({
      email,
      firstName,
      lastName,
      userName,
      showButtonSection: false
    });
  }

  resetAndDeactivateSection = () => {
    this.reset();
    this.props.deactivateSection();
  }

  updateField = (e, field) => {
    this.setState({[field]: e.target.value });
  }

  submitClass = () => {
    const { email, firstName, lastName, userName } = this.state;
    let buttonClass = 'quill-button contained primary medium';
    if (firstName === this.props.firstName
      && lastName === this.props.lastName
      && email === this.props.email
      && userName === this.props.userName
    ) {
      buttonClass += ' disabled';
    }
    return buttonClass;
  }

  renderButtonSection() {
    if (this.state.showButtonSection) {
      return (<div className="button-section">
        <div className="quill-button outlined secondary medium" id="cancel" onClick={this.resetAndDeactivateSection}>Cancel</div>
        <input className={this.submitClass()} name="commit" type="submit" value="Save changes" />
      </div>)
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { email, firstName, lastName, userName } = this.state;
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
      username: userName
    };
    this.props.updateUser(data, '/students/update_account', 'Settings saved', errors);
  }

  render() {
    const { email, firstName, lastName, userName } = this.state;
    const { accountType, cleverId, errors, googleId, timesSubmitted } = this.props;
    const isDisabled = !!(cleverId || googleId);
    const teacherCreated = accountType === "Teacher Created Account";
    const editStatus = isDisabled ? '-not-editable' : '';

    return (
      <div className="user-account-general user-account-section">
        <h1>General</h1>
        <form acceptCharset="UTF-8" onSubmit={this.handleSubmit} >
          <div className="fields">
            <Input
              characterLimit={50}
              disabled={isDisabled}
              error={errors.firstName}
              handleChange={e => this.updateField(e, 'firstName')}
              id={`first-name${editStatus}`}
              label="First name"
              onClick={!isDisabled ? this.activateSection : null}
              timesSubmitted={timesSubmitted}
              type="text"
              value={firstName}
            />
            <Input
              characterLimit={50}
              disabled={isDisabled}
              error={errors.lastName}
              handleChange={e => this.updateField(e, 'lastName')}
              id={`last-name${editStatus}`}
              label="Last name"
              onClick={!isDisabled ? this.activateSection : null}
              timesSubmitted={timesSubmitted}
              type="text"
              value={lastName}
            />
            <Input
              disabled={isDisabled || teacherCreated}
              error={errors.username}
              handleChange={e => this.updateField(e, 'userName')}
              helperText={teacherCreated ? 'Only your teacher can change your username' : ''}
              id={`username${(isDisabled || teacherCreated) ? '-not-editable' : ''}`}
              label="Username"
              onClick={(!isDisabled && !teacherCreated) ? this.activateSection : null}
              timesSubmitted={timesSubmitted}
              type="text"
              value={userName}
            />
            <Input
              disabled={isDisabled}
              error={errors.email}
              handleChange={e => this.updateField(e, 'email')}
              id={`email${editStatus}`}
              label="Email (Optional)"
              onClick={!isDisabled ? this.activateSection : null}
              timesSubmitted={timesSubmitted}
              type="text"
              value={email}
            />
          </div>
          {this.renderButtonSection()}
        </form>
      </div>
    );
  }
}
