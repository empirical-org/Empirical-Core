EC.UnitTemplateProfileAssignButton = React.createClass({
  propTypes: {
    data: React.PropTypes.object.isRequired,
    actions: React.PropTypes.object.isRequired
  },

  stateSpecificComponent: function () {
    if (this.props.data.non_authenticated) {
      return <button className='button-green full-width' onClick={this.props.actions.signUp}>Sign Up</button>
    } else {
      return <button className='button-green full-width' onClick={this.props.actions.assign}>Assign to Your Class</button>
    }
  },

  render: function () {
    return (
      <div>
        {this.stateSpecificComponent()}
        <p className="time"><i className='fa fa-clock-o'></i>Estimated Time: {this.props.data.model.time} mins</p>
      </div>
    )
  }
});