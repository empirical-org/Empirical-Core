import React from 'react';

export default class DropdownFilterOption extends React.Component {
  clickOption = () => {
    this.props.selectOption(this.props.value);
  };

  render() {
    return (
      <li onClick={this.clickOption}>
        <span className="filter_option">
          {this.props.name}
        </span>
      </li>
    );
  }
}
