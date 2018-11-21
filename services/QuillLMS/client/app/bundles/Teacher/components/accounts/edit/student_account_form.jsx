import React from 'react'
import DropdownButton from 'react-bootstrap/lib/DropdownButton';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import $ from 'jquery';

export default class StudentAccountForm extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      email: this.props.email,
      notGoogleUser: (!props.googleId && !props.signedUpWithGoogle),
      errors: []
    }
  }

  updateEmail(e){
    this.setState({email: e.target.value})
  }

  handleClick(){
    let that = this
    $.ajax({
      url: '/update_email',
      method: 'PUT',
      data: { email: this.state.email, role: this.state.role },
      statusCode: {
        200() {
          window.location = '/profile'        },
        400(response) {
          that.setState({errors: response.responseJSON.errors})
        }
      }
    })
  }

  showErrors(){
    return this.state.errors ? <span>{this.state.errors}</span> : null
  }

  render () {
    let submitButton, email
    // email and submitButton should only show for the student page
    if (window.location.pathname === '/account_settings') {
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
                name='Email'
                label='Email'
                defaultValue={this.props.email}
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
        <p><strong>Need to change your account type?</strong> Email us at <a style={{ color: '#00c2a2' }} href="mailto:support@quill.org">support@quill.org</a>, and we'll help you sort it out.</p>
        {this.showErrors()}
      </div>
    );
  }
}
