'use strict';

import React from 'react';
import _ from 'underscore';
import $ from 'jquery';

export default React.createClass({
  propTypes: {
    role: React.PropTypes.string.isRequired,
    updateRole: React.PropTypes.func.isRequired
  },
  updateRole: function () {
    var x = $(this.refs.select.getDOMNode()).val();
    this.props.updateRole(x);
  },
  render: function () {
    var options = _.map(['teacher', 'student', 'admin', 'staff'], function (role) {
      return <option key={role} value={role}>{role}</option>;
    });
    return (
      <div className='row'>
        <div className='col-xs-2 form-label'>
          Role
        </div>
        <div className='col-xs-4'>
          <select ref='select' value={this.props.role.toLowerCase()} onChange={this.updateRole}>
            {options}
          </select>
        </div>
        <div className='col-xs-4 errors'>
          {this.props.errors}
        </div>
      </div>
    );
  }
});
