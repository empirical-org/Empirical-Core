import React from 'react'
import createReactClass from 'create-react-class';
export default createReactClass({
  propTypes: {
    name: React.PropTypes.string.isRequired,
    value: React.PropTypes.any.isRequired,
    selectOption: React.PropTypes.func.isRequired,
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
