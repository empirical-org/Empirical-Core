import React, { Component } from 'react';
import { Input } from 'quill-component-library/dist/componentLibrary';
import getAuthToken from '../../modules/get_auth_token';
import request from 'request';

export default class StudentGeneralAccountInfo extends Component {
  state = {
    email: this.props.email,
    firstName: this.props.firstName,
    lastName: this.props.lastName,
    userName: this.props.userName,
    notGoogleUser: (!this.props.googleId && !this.props.signedUpWithGoogle),
    showButtonSection: false
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

  updateEmail = (e) => {
    this.setState({ email: e.target.value, })
  }

  handleFieldChange = (e, field) => {
    this.setState({[field]: e.target.value });
  }

  handleClick = () => {
    request.put({
      url: `${process.env.DEFAULT_URL}/update_email`,
      json: {
        email: this.state.email,
        role: "student",
        authenticity_token: getAuthToken(),
      }
    },
    (e, r, body) => {
      if (r.statusCode === 200) {
        window.location = '/profile'
      } else {
        this.setState({ errors: body.errors, })
      }
    });
  }

  submitClass = () => {
    const { firstName, lastName, email, userName } = this.state;
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
    const { notGoogleUser, firstName, lastName, userName, email } = this.state;
    const { accountType, timesSubmitted, errors } = this.props;
    const correctPath = window.location.pathname === '/account_settings';
    let submitButton, emailField, form
    // email and submitButton should only show for the student page
    if (correctPath && notGoogleUser && accountType === "Student Created Account") {
      form = (
        <div className="teacher-account-general teacher-account-section">
          <h1>General</h1>
          <form acceptCharset="UTF-8" onSubmit={this.handleSubmit} >
            <div className="fields">
              <Input
                characterLimit={50}
                className="first-name"
                error={errors.firstName}
                onClick={this.activateSection}
                handleChange={e => this.handleFieldChange(e, 'firstName')}
                timesSubmitted={timesSubmitted}
                label="First name"
                type="text"
                value={firstName}
              />
              <Input
                characterLimit={50}
                className="last-name"
                error={errors.lastName}
                onClick={this.activateSection}
                handleChange={e => this.handleFieldChange(e, 'lastName')}
                timesSubmitted={timesSubmitted}
                label="Last name"
                type="text"
                value={lastName}
              />
              <Input
                className="username"
                error={errors.username}
                onClick={this.activateSection}
                handleChange={e => this.handleFieldChange(e, 'userName')}
                timesSubmitted={timesSubmitted}
                label="Username"
                type="text"
                value={userName}
              />
              <Input
                className="email"
                error={errors.email}
                onClick={this.activateSection}
                handleChange={e => this.handleFieldChange(e, 'email')}
                timesSubmitted={timesSubmitted}
                label="Email (Optional)"
                type="text"
                value={email}
              />
            </div>
            {this.renderButtonSection()}
          </form>
        </div>
      )
    } else if (correctPath && notGoogleUser) {
      submitButton = (
        <div className="row">
          <div className="col-xs-4 offset-xs-2">
            <button className="button-green" onClick={this.handleClick}>Submit</button>
          </div>
        </div>)
        // email should only show up if the student is not a google user
      if (this.state.notGoogleUser) {
        emailField = (
          <div className="row">
            <div className="form-label col-xs-2">
              Email
            </div>
            <div className="col-xs-4">
              <input
                defaultValue={this.props.email}
                label='Email'
                name='Email'
                onChange={this.updateEmail}
              />
            </div>
          </div>
        )
      }
    }

    return (
      <div>
        {form}
        {emailField}
        {submitButton}
      </div>
    );
  }
}
