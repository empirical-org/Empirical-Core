EC.UnitTemplateProfileHeader = React.createClass({

  propTypes: {
    data: React.PropTypes.object.isRequired,
    eventHandlers: React.PropTypes.object.isRequired
  },

  render: function () {
    return (
      <div className='big-title middle-school'>
        <p>
          <a className='unit-template-category-label img-rounded'>UNIVERSITY</a>
        </p>
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