import React from 'react'
import DropdownButton from 'react-bootstrap/lib/DropdownButton';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import $ from 'jquery';

export default React.createClass({

  getInitialState: function () {
    return {role: this.props.role}
  },

  handleSelect: function(role){
    if (window.confirm("Are you sure you want to change your account type?")) {
      if (this.props.updateRole) {
        this.props.updateRole(role)
      }
      this.setState({role})
    }
  },

  handleClick: function(){
    $.ajax({
      url: "/make_teacher",
      method: "PUT"})
    .success(
      ()=>window.location = '/profile'
    )
  },

  render: function () {
    let submitButton;
    // only has update role if it a teacher account
    if (this.state.role !== this.props.role && !this.props.updateRole) {
      submitButton = (
        <div className="row">
          <div className="col-xs-4 offset-xs-2">
            <button className="button-green" onClick={this.handleClick}>Submit</button>
          </div>
        </div>)
    }
    return (
      <div>
        <div className="row">
          <div className="form-label col-xs-2">
            Role
          </div>
          <div className="col-xs-4">
            <DropdownButton bsStyle='default' title={this.state.role[0].toUpperCase() + this.state.role.slice(1)} id='select-classroom-dropdown' onSelect={this.handleSelect}>
              <MenuItem key='student' eventKey='student'>Student</MenuItem>
              <MenuItem key='teacher' eventKey='teacher'>Teacher</MenuItem>
            </DropdownButton>
          </div>
        </div>
        {submitButton}
      </div>
    );
  }
});
