import React from 'react'
export default React.createClass({
  propTypes: {
    name: React.PropTypes.string.isRequired,
    value: React.PropTypes.any.isRequired,
    selectOption: React.PropTypes.func.isRequired
  },

  clickOption: function () {
    this.props.selectOption(this.props.value);
  },

  render: function () {
    return (
      <li onClick={this.clickOption}>
        <span className="filter_option">
          {this.props.name}
        </span>
      </li>
    );
  }
});
