EC.ListFilterOption = React.createClass({
  propTypes: {
    data: React.PropTypes.object.isRequired,
    select: React.PropTypes.func.isRequired
  },

  getName: function () {
    return this.props.data.name;
  },

  getId: function () {
    return this.props.data.id;
  },

  select: function () {
    this.props.select(this.getId());
  },

  render: function () {
    return (
      <div>
        <a className='list-filter-option' onClick={this.select}>{this.getName()}</a>
      </div>
    )
  }
})