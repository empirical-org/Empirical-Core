import React from 'react'
import DropdownButton from 'react-bootstrap/lib/DropdownButton';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import request from 'request'

import getAuthToken from '../../../components/modules/get_auth_token'

export default class StudentAccountForm extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      email: this.props.email,
      notGoogleUser: (!props.googleId && !props.signedUpWithGoogle),
      errors: []
    }

    this.handleClick = this.handleClick.bind(this)
    this.updateEmail = this.updateEmail.bind(this)
    this.showErrors = this.showErrors.bind(this)
  }

  updateEmail(e) {
    this.setState({ email: e.target.value, })
  }

  handleClick() {
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

  showErrors(){
    return this.state.errors ? <span>{this.state.errors}</span> : null
  }

  render() {
    let submitButton, email
    // email and submitButton should only show for the student page
    if (window.location.pathname === '/account_settings' && this.state.notGoogleUser) {
      submitButton = (
        <div className="row">
          <div className="col-xs-4 offset-xs-2">
            <button className="button-green" onClick={this.handleClick}>Submit</button>
          </div>
        </div>)
        // email should only show up if the student is not a google user
      if (this.state.notGoogleUser) {
        email = (
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
        {email}
        {submitButton}
        <p><strong>Need to change your account type?</strong> Email us at <a href="mailto:support@quill.org" style={{ color: '#00c2a2' }}>support@quill.org</a>, and we'll help you sort it out.</p>
        {this.showErrors()}
      </div>
    );
  }
}
