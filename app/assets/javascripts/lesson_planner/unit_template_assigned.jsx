'use strict';

EC.UnitTemplatesAssigned = React.createClass({
  propTypes: {
    data: React.PropTypes.object.isRequired,
    actions: React.PropTypes.object.isRequired
  },

  teacherSpecificComponents: function() {
    var message;
    if (this.props.actions.studentsPresent() === true) {
      message = (
        <span>
          <p className='assign-success-message'>Your activity pack has been assigned.</p>
          <div className="assign-success-button-container">
            <a href = '/teachers/classrooms/lesson_planner'>
              <button onClick className="button-green add-students">
                View Assigned Activity Packs
              </button>
            </a>
          </div>
       </span>);
    } else {
      message = (
        <span>
          <p>
            You've assigned an activity-pack to:
              <b>{this.props.actions.getLastClassroomName()}</b>
          </p>
          <div className = "assignSuccess-button-container">
            <p>Your next step is to add students.</p>
            <a href = {this.props.actions.getInviteStudentsUrl()} >
              <button onClick className="button-green add-students">
                Add Students
              </button>
            </a>
          </div>
        </span>);
    };
    return (<div className='successBox'>
      <div className='messageBox'>
        <h2>Success</h2 >
      </div>
      {message}
    </div>);

  },

  render: function () {
    return this.teacherSpecificComponents();
  }
});
