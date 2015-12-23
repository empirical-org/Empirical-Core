'use strict';
EC.UnitTemplatesAssigned = React.createClass({
  propTypes: {
    // data: React.PropTypes.object.isRequired,
    actions: React.PropTypes.object.isRequired
  },



  render: function () {
    debugger;
    return (
      <div className='successBox'>
        <div className='messageBox'><h2>Success</h2></div>
        <p>You've assigned an activity-pack to: <b>{this.props.actions.getLastClassroomName()}</b></p>
        <p>Your next step is to add students.</p>
        <div  className= "add-students-button-container">
            <a href={this.props.actions.getInviteStudentsUrl()}><button onClick className="button-green add-students">Add Students</button></a>
        </div>
      </div>
    );
  }
});
