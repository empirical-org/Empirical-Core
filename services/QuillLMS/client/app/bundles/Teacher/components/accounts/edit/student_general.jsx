import React, { Component } from 'react';
import { Input } from 'quill-component-library/dist/componentLibrary';

export default class StudentGeneralAccountInfo extends Component {
  state = {
    email: this.props.email,
    firstName: this.props.firstName,
    lastName: this.props.lastName,
    userName: this.props.userName,
    notGoogleUser: (!this.props.googleId && !this.props.signedUpWithGoogle),
    errors: { firstName: null, lastName: null },
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

    if (!firstName && !lastName) {
      const errors = { ...this.state.errors }
      errors.firstName = "First name cannot be blank";
      errors.lastName = "Last name cannot be blank";
      this.setState({ errors: errors });
    } else if (!firstName) {
      const errors = { ...this.state.errors }
      errors.firstName = "First name cannot be blank";
      this.setState({ errors: errors });
    } else if (!lastName) {
      const errors = { ...this.state.errors }
      errors.lastName = "Last name cannot be blank";
      this.setState({ errors: errors });
    } else {
      this.setState({ errors: {} }, () => {
        const data = {
          name,
          email,
          username: userName
        };
        this.props.updateUser(data, '/update_account', 'Settings saved');
      });
    }
  }

  // handleUpdate = () => {
  //   const { email, userName, firstName, lastName } = this.state;

  //   if (!firstName && !lastName) {
  //     const errors = { ...this.state.errors }
  //     errors.firstName = "First name cannot be blank";
  //     errors.lastName = "Last name cannot be blank";
  //     this.setState({ errors: errors });
  //   } else if (!firstName) {
  //     const errors = { ...this.state.errors }
  //     errors.firstName = "First name cannot be blank";
  //     this.setState({ errors: errors });
  //   } else if (!lastName) {
  //     const errors = { ...this.state.errors }
  //     errors.lastName = "Last name cannot be blank";
  //     this.setState({ errors: errors });
  //   }
  //   const name = `${firstName} ${lastName}`;
  //   request.put({
  //     url: `${process.env.DEFAULT_URL}/update_account`,
  //     json: {
  //       name: name,
  //       email: email,
  //       username: userName,
  //       authenticity_token: getAuthToken()
  //     }
  //   },
  //     (e, r, body) => {
  //       if (r.statusCode === 200 && !errors) {
  //         console.log('success!~')
  //         // window.location = '/account_settings';
  //       } else {
  //         this.setState({ errors: body.errors, })
  //       }
  //     });
  // }

  render() {
    const { notGoogleUser, firstName, lastName, userName, email, errors } = this.state;
    const { accountType, timesSubmitted } = this.props;
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
                handleChange={this.handleFirstNameChange}
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
                handleChange={this.handleLastNameChange}
                timesSubmitted={timesSubmitted}
                label="Last name"
                type="text"
                value={lastName}
              />
              <Input
                className="username"
                error={errors.userName}
                onClick={this.activateSection}
                handleChange={this.handleUsernameChange}
                timesSubmitted={timesSubmitted}
                label="Username"
                type="text"
                value={userName}
              />
              <Input
                className="email"
                error={errors.email}
                onClick={this.activateSection}
                handleChange={this.handleEmailChange}
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
