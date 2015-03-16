EC.DropdownFilter = React.createClass({
  propTypes: {
    defaultOption: React.PropTypes.object.isRequired,
    options: React.PropTypes.array.isRequired,
    selectOption: React.PropTypes.func.isRequired
  },

  getInitialState: function() {
    return {
      selectedOption: this.props.defaultOption
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
      selectedOption: option
    }, function() {
      this.props.selectOption(optionValue);
    });
  },
  getButtonClassName: function() {
    if (this.state.selectedOption.value == '') {
      return 'select-gray'
    } else {
      return 'select-white'
    }
  },
  render: function() {
    return (
        <div className="button-select">
          <button type="button" className={this.getButtonClassName() + " select-mixin button-select button-select-wrapper"} data-toggle="dropdown">
            {this.state.selectedOption.name}
            <i className="fa fa-caret-down"></i>
          </button>
          {this.getFilterOptions()}
        </div>
    );
  }
});