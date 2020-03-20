'use strict';
import PropTypes from 'prop-types';
import React from 'react'

export default class extends React.Component {
  static propTypes = {
    checked: PropTypes.bool.isRequired,
    toggleItem: PropTypes.func.isRequired,
    item: PropTypes.string.isRequired
  };

  handleChange = () => {
    this.props.toggleItem(this.props.item)
  };

  determineCheckedText = () => {
    return (this.props.checked ? 'checked' : '');
  };

  render() {
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
}
