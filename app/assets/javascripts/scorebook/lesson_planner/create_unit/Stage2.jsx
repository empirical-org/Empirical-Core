"use strict";
EC.Stage2 = React.createClass({

  getInitialState: function() {
    return {
      classroomsAndTheirStudents: [],
      buttonDisabled: false
    };
  },

  finish: function () {
    if (!this.state.buttonDisabled) {
      this.setState({buttonDisabled: true});
      this.props.finish();
    }
  },

  componentDidMount: function() {
    this.fetchClassrooms();
  },

  fetchClassrooms: function() {
    $.ajax({
      url: '/teachers/classrooms/retrieve_classrooms_for_assigning_activities',
      context: this,
      success: function (data) {
        this.fetchClassroomsSuccess(data);
      },
      error: function () {
        console.log('error fetching classrooms');
      }
    });
  },

  determineAssignButtonClass: function () {
    if (!this.state.buttonDisabled) {
      return this.props.determineAssignButtonClass();
    } else {
      return "button-grey pull-right";
    }

  },

  determineButtonText: function () {
    if (!this.state.buttonDisabled) {
      return "Assign";
    } else {
      return "Assigning...";
    }
  },

  fetchClassroomsSuccess: function(data) {
    this.setState({classroomsAndTheirStudents: data.classrooms_and_their_students});
  },

  render: function() {
    var classroomList = this.state.classroomsAndTheirStudents.map(function(entry) {
      return <EC.Classroom classroom={entry.classroom}
                           students={entry.students}
                           toggleClassroomSelection={this.props.toggleClassroomSelection}
                           toggleStudentSelection={this.props.toggleStudentSelection} />;
    }, this);

    var dueDateList = this.props.selectedActivities.map(function(activity) {
      return <EC.ActivityDueDate activity={activity}
                                 toggleActivitySelection={this.props.toggleActivitySelection}
                                 assignActivityDueDate={this.props.assignActivityDueDate}/>;
    }, this);

    return (
      <span>
        <section className="select-students">
          <h1 className="section-header">Select Students</h1>
          {classroomList}
        </section>

        <section className="assign-dates">
          <h1 className="section-header">
            Assign Dates for {this.props.unitName}
          </h1>
          <table className="table">
            <tbody>
              {dueDateList}
            </tbody>
          </table>
          <button ref="button" className={this.determineAssignButtonClass() + " pull-right"} id="assign" onClick={this.finish}>{this.determineButtonText()}</button>
        </section>
      </span>
    );
  }
});