import React from 'react'
import DropdownFilterOption from './dropdown_filter_option.jsx'
import _ from 'underscore'
import $ from 'jquery'

export default React.createClass({
  propTypes: {
    selectedOption: React.PropTypes.object.isRequired,
    options: React.PropTypes.array.isRequired,
    selectOption: React.PropTypes.func.isRequired
  },


  getFilterOptions: function() {
    return (
      <ul className="dropdown-menu" role="menu">
        {_.map(this.props.options, function(option, i) {
          return <DropdownFilterOption key={i} name={option.name} value={option.value} selectOption={this.handleSelect} />
        }, this)}
      </ul>
    );
  },

  handleSelect: function(optionValue) {
    // Find the option corresponding to the selected value.
    var option = _.find(this.props.options, function(option) {
      return option.value === optionValue;
    });
    this.props.selectOption(option)
  },
  getButtonClassName: function() {
    if (this.props.selectedOption.value == '') {
      return 'select-gray'
    } else {
      return 'select-white'
    }
  },
  render: function() {
    return (
        <div className="button-select">
          <button type="button" className={this.getButtonClassName() + " select-mixin button-select button-select-wrapper"} data-toggle="dropdown">
            {this.props.selectedOption.name}
            <i className="fa fa-caret-down"></i>
          </button>
          {this.getFilterOptions()}
        </div>
    );
  }
});
