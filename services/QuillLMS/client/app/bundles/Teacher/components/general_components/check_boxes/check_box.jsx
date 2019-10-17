'use strict';
import React from 'react'

export default React.createClass({
  propTypes: {
    checked: React.PropTypes.bool.isRequired,
    toggleItem: React.PropTypes.func.isRequired,
    item: React.PropTypes.string.isRequired
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
