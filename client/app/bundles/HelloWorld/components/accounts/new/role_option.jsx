'use strict';
import React from 'react'

export default React.createClass({
  propTypes: {
    selectRole: React.PropTypes.func.isRequired
  },
  selectRole: function () {
    var role = this.props.role == 'student' ? 'student' : 'teacher';
    this.props.selectRole(role);
  },
  render: function () {
    return (
      <button className={'select_' + this.props.role + ' button-green'} onClick={this.selectRole}>
        {this.props.role[0].toUpperCase() + this.props.role.substring(1)}
      </button>
    );
  }
});
