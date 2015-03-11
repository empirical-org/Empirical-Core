EC.DropdownFilter = React.createClass({
  propTypes: {
    defaultOption: React.PropTypes.string.isRequired,
    options: React.PropTypes.array.isRequired,
    selectOption: React.PropTypes.func.isRequired
  },

  getInitialState: function() {
    return {
      selectedOptionName: this.props.defaultOption
    };
  },

  getFilterOptions: function() {
    return (
      <ul className="dropdown-menu" role="menu">
        {_.map(this.props.options, function(option, i) {
          return <EC.DropdownFilterOption key={i} name={option.name} value={option.value} selectOption={this.handleSelect} />
        }, this)}
      </ul>
    );
  },

  handleSelect: function(optionValue) {
    // Find the option corresponding to the selected value.
    var option = _.find(this.props.options, function(option) {
      return option.value === optionValue;
    });

    this.setState({
      selectedOptionName: option.name
    }, function() {
      this.props.selectOption(optionValue);
    });
  },

  render: function() {
    return (
        <div className="button-select">
          <button type="button" className="select-mixin select-gray button-select button-select-wrapper" data-toggle="dropdown">
            {this.state.selectedOptionName}
            <i className="fa fa-caret-down"></i>
          </button>
          {this.getFilterOptions()}
        </div>
    );
  }
});