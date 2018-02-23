'use strict';
import React from 'react'
import createReactClass from 'create-react-class'
import PropTypes from 'prop-types'

export default createReactClass({
  propTypes: {
    selectRole: PropTypes.func.isRequired
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
