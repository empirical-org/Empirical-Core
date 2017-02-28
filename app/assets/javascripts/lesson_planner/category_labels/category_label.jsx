EC.CategoryLabel = React.createClass({

  propTypes: {
    data: React.PropTypes.object.isRequired,
    extraClassName: React.PropTypes.string.isRequired,
  },


  generateClassName: function () {
    return ['category-label', 'img-rounded', this.props.extraClassName].join(' ')
  },

  render: function () {
    return (
      <div href={`/teachers/classrooms/activity_planner/featured-activity-packs/category/${this.props.dataname}`} className={this.generateClassName()}>{this.props.data.name.toUpperCase()}</div>
    )
  }
});
