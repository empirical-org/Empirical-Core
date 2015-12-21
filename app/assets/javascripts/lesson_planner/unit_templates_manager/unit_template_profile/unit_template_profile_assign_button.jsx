EC.UnitTemplateProfileAssignButton = React.createClass({
  propTypes: {
    data: React.PropTypes.object.isRequired,
    actions: React.PropTypes.object.isRequired
  },

  propsSpecificComponent: function () {
    if (this.props.data.non_authenticated) {
      return <button className='button-green full-width' onClick={this.props.actions.signUp}>Sign Up</button>
    } else if (!this.props.data.firstAssignButtonClicked) {
      return <button className='button-green full-width' onClick={this.props.actions.clickAssignButton}>Assign to Your Class</button>
    } else {
      return (<span>
        <button className='button-green full-width' onClick={this.props.actions.fastAssign}>Assign to Everyone</button>
        <button className='button-green full-width' onClick={this.props.actions.customAssign}>Assign to Specific Students and Set Due Dates</button>
      </span>)
    }
  },

  render: function () {
    return (
      <div>
        {this.propsSpecificComponent()}
        <p className="time"><i className='fa fa-clock-o'></i>Estimated Time: {this.props.data.model.time} mins</p>
      </div>
    )
  }
});