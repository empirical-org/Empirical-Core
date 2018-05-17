import React from 'react'
import DropdownButton from 'react-bootstrap/lib/DropdownButton';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import $ from 'jquery';

export default React.createClass({

  getInitialState: function () {
    return {role: this.props.role,
            email: this.props.email,
            notGoogleUser: (!this.props.googleId && !this.props.signedUpWithGoogle),
            errors: []
          }
  },

  handleSelect: function(role){
    if (window.confirm('Are you sure you want to change your account type?')) {
      if (this.props.updateRole) {
        this.props.updateRole(role)
      }
      this.setState({role})
    }
  },

  updateEmail: function(e){
    this.setState({email: e.target.value})
  },

  handleClick: function(){
    let that = this
    $.ajax({
      url: '/make_teacher',
      method: 'PUT',
      data: {email: this.state.email, role: this.state.role},
      statusCode: {
        200: function() {
          window.location = '/profile'        },
        400: function(response) {
          that.setState({errors: response.responseJSON.errors})
        }
      }
    })
  },

  showErrors: function(){
    return this.state.errors ? <span>{this.state.errors}</span> : null
  },

  render: function () {
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
        <div className="row">
          <div className="form-label col-xs-2">
            Role
          </div>
          <div className="col-xs-4">
            <DropdownButton bsStyle='default' title={this.state.role[0].toUpperCase() + this.state.role.slice(1)} id='select-role-dropdown' onSelect={this.handleSelect}>
              <MenuItem key='student' eventKey='student'>Student</MenuItem>
              <MenuItem key='teacher' eventKey='teacher'>Teacher</MenuItem>
            </DropdownButton>
          </div>
        </div>
        {submitButton}
        {this.showErrors()}
      </div>
    );
  }
});
