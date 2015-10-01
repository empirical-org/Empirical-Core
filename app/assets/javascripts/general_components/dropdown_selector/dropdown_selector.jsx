EC.DropdownSelector = React.createClass({
  propTypes: {
    options: React.PropTypes.array.isRequired,
    select: React.PropTypes.func.isRequired,
    label: React.PropTypes.string.isRequired
  },

  select: function () {
    var id = $(this.refs.select.getDOMNode()).val();
    this.props.select(id);
  },

  generateOption: function (option) {
    var id = (option.id ? option.id : option)
    var name = (option.name ? option.name : option)
    return (
      <option key={id} value={id}>{name}</option>
    );
  },

  render: function () {
    var options = _.map(this.props.options, this.generateOption, this);
    return (
      <div className='dropdown-select-and-label'>
        <h3 className='dropdown-select-label'>{this.props.label}</h3>
        <select ref={'select'} value={this.props.defaultValue} onChange={this.select}>
         {options}
        </select>
      </div>
    );
  }

});