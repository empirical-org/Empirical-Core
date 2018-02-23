import React from 'react'
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
export default createReactClass({
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
