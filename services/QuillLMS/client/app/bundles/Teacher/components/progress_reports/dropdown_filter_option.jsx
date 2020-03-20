import PropTypes from 'prop-types';
import React from 'react';
export default React.createClass({
  propTypes: {
    name: PropTypes.string.isRequired,
    value: PropTypes.any.isRequired,
    selectOption: PropTypes.func.isRequired,
  },

  clickOption() {
    this.props.selectOption(this.props.value);
  },

  render() {
    return (
      <li onClick={this.clickOption}>
        <span className="filter_option">
          {this.props.name}
        </span>
      </li>
    );
  },
});
