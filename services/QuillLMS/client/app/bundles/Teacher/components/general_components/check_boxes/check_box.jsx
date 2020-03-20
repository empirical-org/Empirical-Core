'use strict';
import PropTypes from 'prop-types';
import React from 'react'

export default React.createClass({
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
        <input
          checked={this.determineCheckedText()}
          className="checkbox"
          onChange={this.handleChange}
          type="checkbox"
        />
        <label>{this.props.item}</label>
      </div>
    );
  }
});
