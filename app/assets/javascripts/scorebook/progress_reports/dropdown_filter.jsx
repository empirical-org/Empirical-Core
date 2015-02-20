EC.DropdownFilter = React.createClass({
  propTypes: {
    defaultOption: React.PropTypes.string.isRequired,
    options: React.PropTypes.array.isRequired,
    selectOption: React.PropTypes.func.isRequired
  },

  getFilterOptions: function() {
    return (
      <ul className="dropdown-menu" role="menu">
        {_.map(this.props.options, function(option, i) {
          return <EC.DropdownFilterOption key={i} name={option.name} value={option.value} selectOption={this.props.selectOption} />
        }, this)}
      </ul>
    );
  },

  render: function() {
    return (
      <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4 col-xl-4 no-pl">
        <div className="button-select">
          <button type="button" className="select-mixin select-gray button-select button-select-wrapper" data-toggle="dropdown">
            <i className="fa fa-caret-down"></i>
          </button>
          {this.getFilterOptions()}
        </div>
      </div>
    );
  }
});