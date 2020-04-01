import React from 'react';
import _ from 'underscore';
import $ from 'jquery';

export default class SelectRole extends React.Component {

  updateRole = () => {
    var x = $(this.refs.select).val();
    this.props.updateRole(x);
  };

  render() {
    const options = _.map(['teacher', 'student', 'admin', 'staff'], function (role) {
      return <option key={role} value={role}>{role}</option>;
    });

    return (
      <div className='row'>
        <div className='col-xs-2 form-label'>
          Role
        </div>
        <div className='col-xs-4'>
          <select onChange={this.updateRole} ref='select' value={this.props.role.toLowerCase()}>
            {options}
          </select>
        </div>
        <div className='col-xs-4 errors'>
          {this.props.errors}
        </div>
      </div>
    );
  }
}
