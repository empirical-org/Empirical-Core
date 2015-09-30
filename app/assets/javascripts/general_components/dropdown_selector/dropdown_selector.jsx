EC.DropdownSelector = React.createClass({
  propTypes: {
    options: React.PropTypes.array.isRequired,
    select: React.PropTypes.func.isRequired,
    label: React.PropTypes.string.isRequired
  },

  select: function () {
    var value = $(this.refs.select.getDOMNode()).val();
    this.props.select(value);
  },

  generateOption: function (option) {
    return (
      <option key={option} value={option}>{option}</option>
    );
  },

  render: function () {
    var options = _.map(this.props.options, this.generateOption, this);
    return (
      <div className='dropdown-select-and-label'>
        <h3 className='dropdown-select-label'>{this.props.label}</h3>
        <select ref={'select'} onChange={this.select}>
         {options}
        </select>
      </div>
    );
  }

});