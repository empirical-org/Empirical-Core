import React, { Component } from 'react'
import DropdownButton from 'react-bootstrap/lib/DropdownButton';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import request from 'request';
import { Input } from 'quill-component-library/dist/componentLibrary';
import getAuthToken from '../../../components/modules/get_auth_token';

export default class StudentAccountForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      email: props.email,
      firstName: props.name.split(' ')[0],
      lastName: props.name.split(' ')[1],
      userName: props.userName,
      notGoogleUser: (!props.googleId && !props.signedUpWithGoogle),
      errors: []
    }
  }

  updateEmail = (e) => {
    this.setState({ email: e.target.value, })
  }

  handleFirstNameChange = (e) => {
    this.setState({ firstName: e.target.value, });  
  }
 
  handleLastNameChange = (e) => {
    this.setState({ lastName: e.target.value, });
  }

  handleEmailChange = (e) => {
    this.setState({ email: e.target.value, });
  }

  handleUsernameChange = (e) => {
    this.setState({ userName: e.target.value });
  }

  handleClick = () => {
    request.put({
      url: `${process.env.DEFAULT_URL}/update_email`,
      json: {
        email: this.state.email,
        role: this.state.role,
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

  handleUpdate = () => {
    const { email, userName, firstName, lastName } = this.state;
    const name = `${firstName} ${lastName}`;
    request.put({
      url: `${process.env.DEFAULT_URL}/update_account`,
      json: {
        name: name,
        email: email,
        username: userName,
        authenticity_token: getAuthToken()
      }
    },
      (e, r, body) => {
        console.log('e', e);
        console.log('errors', body.errors);
        if (r.statusCode === 200) {
          console.log('success!~')
          // window.location = '/profile'
        } else {
          this.setState({ errors: body.errors, })
        }
      });
  }

  showErrors = () => {
    const { errors } = this.state;
    return errors ? <span>{errors}</span> : null
  }

  submitClass() {
    let buttonClass = 'quill-button contained primary medium';
    if (this.state.name === this.props.name
      && this.state.email === this.props.email
      && this.state.timeZone === this.props.timeZone
      && this.state.schoolType === this.props.schoolType
      && this.state.school === this.props.school
    ) {
      buttonClass += ' disabled';
    }
    return buttonClass;
  }

  render() {
    console.log('props', this.props);
    console.log('state', this.state);
    const { notGoogleUser, firstName, lastName, userName, email } = this.state;
    const { accountType, error } = this.props;
    const correctPath = window.location.pathname === '/account_settings';
    let submitButton, emailField, form
    // email and submitButton should only show for the student page
    if (correctPath && notGoogleUser && accountType === "Student Created Account") {
      form = (
        <div className="teacher-account-general teacher-account-section">
          <h1>General</h1>
          <form acceptCharset="UTF-8" onSubmit={() => console.log('submitted!')} >
            <div className="fields">
              <Input
                characterLimit={50}
                className="first-name"
                // error={error.name}
                handleChange={this.handleFirstNameChange}
                label="First name"
                type="text"
                value={firstName}
              />
              <Input
                characterLimit={50}
                className="last-name"
                // error={error.name}
                handleChange={this.handleLastNameChange}
                label="Last name"
                type="text"
                value={lastName}
              />
              <Input
                className="username"
                // error={error.username}
                handleChange={this.handleUsernameChange}
                label="Username"
                type="text"
                value={userName}
              />
              <Input
                className="email"
                // error={error.email}
                handleChange={this.handleEmailChange}
                label="Email (Optional)"
                type="text"
                value={email}
              />
            </div>
            <div className="button-section">
              <div className="quill-button outlined secondary medium" id="cancel" onClick={this.resetAndDeactivateSection}>Cancel</div>
              <input className={this.submitClass()} onClick={this.handleUpdate} name="commit" type="submit" value="Save changes" />
            </div>
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
        {this.showErrors()}
      </div>
    );
  }
}
