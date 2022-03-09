import React from 'react';

export default class DropdownFilterOption extends React.Component {
  clickOption = () => {
    this.props.selectOption(this.props.value);
  };

  render() {
    return (
      <li>
        <button className="filter_option interactive-wrapper focus-on-light" onClick={this.clickOption} type="button">
          {this.props.name}
        </button>
      </li>
    );
  }
}
