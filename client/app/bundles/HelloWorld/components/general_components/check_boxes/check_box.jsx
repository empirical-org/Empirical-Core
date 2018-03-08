'use strict';
import React from 'react'
import createReactClass from 'create-react-class'
import PropTypes from 'prop-types'

export default createReactClass({
  propTypes: {
    checked: PropTypes.bool.isRequired,
    toggleItem: PropTypes.func.isRequired,
    item: PropTypes.string.isRequired
  },

  handleChange: function () {
    this.props.toggleItem(this.props.item)
  },

  determineCheckedText: function () {
    return (this.props.checked ? 'checked' : '');
  },

  render: function () {
    return (
      <div className='checkbox-and-label'>
        <input type="checkbox"
         checked={this.determineCheckedText()}
         className="checkbox"
         onChange={this.handleChange} />
        <label>{this.props.item}</label>
      </div>
    );
  }
});
