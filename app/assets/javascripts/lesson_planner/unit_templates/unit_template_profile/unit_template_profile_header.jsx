EC.UnitTemplateProfileHeader = React.createClass({
  propTypes: {
    data: React.PropTypes.object.isRequired,
    eventHandlers: React.PropTypes.object.isRequired
  },

  divStyle: function () {
    return {
      backgroundColor: this.props.data.model.unit_template_category.primary_color
    };
  },

  render: function () {
    return (
      <div className='big-title' style={this.divStyle()}>
        <EC.CategoryLabel data={this.props.data} eventHandlers={this.props.eventHandlers} />
        <h1><strong>{this.props.data.model.name}</strong></h1>
        <div className="author-details">
          <div className="author-picture">
            <img src={this.props.data.model.author.avatar_url}></img>
          </div>
          <p>by {this.props.data.model.author.name}</p>
        </div>
      </div>
    )
  }

});