EC.UnitTemplateProfileAssignButton = React.createClass({
  propTypes: {
    data: React.PropTypes.object.isRequired,
    actions: React.PropTypes.object.isRequired
  },

  render: function () {
    return (
      <div>
        <button className='button-green full-width' onClick={this.props.actions.assign}>Assign to Your Class</button>
        <p className="time"><i className='fa fa-clock-o'></i>Estimated Time: {this.props.data.model.time} mins</p>
      </div>
    )
  }
});