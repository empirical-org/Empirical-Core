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

  componentWillReceiveProps(nextProps) {
    const { active, email, firstName, lastName, userName } = nextProps;

    if (this.props.active && !active) {
      this.reset();
    }

    if (email !== this.props.email
      || firstName !== this.props.firstName
      || lastName !== this.props.lastName
      || userName !== this.props.userName
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
      this.setState({ showButtonSection: true });
      activateSection();
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
        <div className="quill-button outlined secondary medium" id="cancel" onClick={() => this.resetAndDeactivateSection()}>Cancel</div>
        <input className={this.submitClass()} name="commit" type="submit" value="Save changes" />
      </div>)
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { email, firstName, lastName, userName } = this.state;
    const name = `${firstName} ${lastName}`;
    let errors = {};

    if (!firstName && !lastName) {
      errors.firstName = "First name cannot be blank";
      errors.lastName = "Last name cannot be blank";
    } else if (!firstName) {
      errors.firstName = "First name cannot be blank";
    } else if (!lastName) {
      errors.lastName = "Last name cannot be blank";
    }
    if(!userName) {
      errors.username = "Username cannot be blank"
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
    const isDisabled = cleverId || googleId;
    const teacherCreated = accountType === "Teacher Created Account";

    return (
      <div className="user-account-general user-account-section">
        <h1>General</h1>
        <form acceptCharset="UTF-8" onSubmit={this.handleSubmit} >
          <div className="fields">
            <Input
              characterLimit={50}
              className="first-name"
              disabled={isDisabled}
              error={errors.firstName}
              handleChange={e => this.updateField(e, 'firstName')}
              label="First name"
              onClick={!isDisabled ? this.activateSection : null}
              timesSubmitted={timesSubmitted}
              type="text"
              value={firstName}
            />
            <Input
              characterLimit={50}
              className="last-name"
              disabled={isDisabled}
              error={errors.lastName}
              handleChange={e => this.updateField(e, 'lastName')}
              label="Last name"
              onClick={!isDisabled ? this.activateSection : null}
              timesSubmitted={timesSubmitted}
              type="text"
              value={lastName}
            />
            <Input
              className="username"
              disabled={isDisabled || teacherCreated}
              error={errors.username}
              handleChange={e => this.updateField(e, 'userName')}
              helperText={teacherCreated ? 'Only your teacher can change your username' : ''}
              label="Username"
              onClick={(!isDisabled && !teacherCreated) ? this.activateSection : null}
              timesSubmitted={timesSubmitted}
              type="text"
              value={userName}
            />
            <Input
              className="email"
              disabled={isDisabled}
              error={errors.email}
              handleChange={e => this.updateField(e, 'email')}
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
