EC.CategoryLabel = React.createClass({

  propTypes: {
    data: React.PropTypes.object.isRequired,
    eventHandlers: React.PropTypes.object.isRequired
  },

  render: function () {
    return (
      <p>
        <a className='unit-template-category-label img-rounded'>{this.props.data.model.unit_template_category.name.toUpperCase()}</a>
      </p>
    )
  }
});