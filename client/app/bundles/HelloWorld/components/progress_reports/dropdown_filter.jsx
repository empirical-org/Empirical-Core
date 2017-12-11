import React from 'react';
import DropdownFilterOption from './dropdown_filter_option.jsx';
import _ from 'underscore';
import $ from 'jquery';

export default React.createClass({
  propTypes: {
    selectedOption: React.PropTypes.object.isRequired,
    options: React.PropTypes.array.isRequired,
    selectOption: React.PropTypes.func.isRequired,
  },

  getFilterOptions() {
    return (
      <ul className="dropdown-menu" role="menu">
        {_.map(this.props.options, function (option, i) {
          return <DropdownFilterOption key={i} name={option.name} value={option.value} selectOption={this.handleSelect} />;
        }, this)}
      </ul>
    );
  },

  handleSelect(optionValue) {
    // Find the option corresponding to the selected value.
    const option = _.find(this.props.options, option => option.value === optionValue);
    this.props.selectOption(option);
  },
  getButtonClassName() {
    // if (this.props.selectedOption && this.props.selectedOption.value == '') {
    //   return 'select-gray';
    // }
    return 'select-white';
  },
  render() {
    const icon = this.props.icon ? <i className={`fa fa-icon scorebook-dropdown-icon ${this.props.icon}`}/> : <span/>
    const buttonText = (this.props.selectedOption && this.props.selectedOption.name) ? this.props.selectedOption.name : this.props.placeholder
    return (
        <div className={`button-select ${this.props.className}`}>
          <button type="button" className={this.getButtonClassName() + " select-mixin button-select button-select-wrapper"} data-toggle="dropdown">
            {icon} <span className="button-text">{buttonText}</span>
            <i className="fa fa-caret-down"></i>
          </button>
          {this.getFilterOptions()}
        </div>
    );
  },
});
