EC.CategoryLabel = React.createClass({

  propTypes: {
    name: React.PropTypes.string.isRequired,
    extraClassName: React.PropTypes.string.isRequired,
    filterByCategory: React.PropTypes.func.isRequired
  },

  generateClassName: function () {
    return ['category-label', 'img-rounded', this.props.extraClassName].join(' ')
  },

  render: function () {
    return (
      <div onClick={this.props.filterByCategory} className={this.generateClassName()}>{this.props.name}</div>
    )
  }
});