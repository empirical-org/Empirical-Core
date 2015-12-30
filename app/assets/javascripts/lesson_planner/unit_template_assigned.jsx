'use strict';

EC.UnitTemplatesAssigned = React.createClass({
  propTypes: {
    data: React.PropTypes.object.isRequired,
    actions: React.PropTypes.object.isRequired
  },

  hideSubNavBars: function() {
    $(".unit-tabs").hide();
    $(".tab-outer-wrap").hide();
  },

  activityName: function() {
    return this.props.data.name;
  },

  teacherSpecificComponents: function() {
    this.hideSubNavBars();
    console.log(this.props.data);
    var proceedButton;
    if (this.props.actions.studentsPresent() === true) {
      proceedButton = (
        <span>
          <div className="assign-success-button-container">
            <a href = '/teachers/classrooms/lesson_planner'>
              <button onClick className="button-green add-students">
                View Assigned Activity Packs
              </button>
            </a>
          </div>
        </span>);
    } else {
      proceedButton = (
        <span>
          <div className = "assignSuccess-button-container">
            <a href = {this.props.actions.getInviteStudentsUrl()} >
              <button onClick className="button-green add-students">
                Add Students
              </button>
            </a>
          </div>
        </span>);
    };
    return (proceedButton);

  },

  render: function () {
    debugger;
    return (
    <div className='successBox'>
        <span className='assign-success-message'>You’ve successfully assigned the {this.activityName()} Activity Pack!{this.teacherSpecificComponents()}</span>
    </div>
  );
  }
});
