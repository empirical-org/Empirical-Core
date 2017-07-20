'use strict'

 import React from 'react'
 import Classroom from './classroom'
 import ActivityDueDate from './activity_due_date'
 import ClassroomsWithStudents  from './ClassroomsWithStudents.jsx'
 import AssigningIndicator from '../../../shared/button_loading_indicator'

 export default  React.createClass({

  getInitialState: function() {
    return {
      classroomsAndTheirStudents: [],
      buttonDisabled: false,
      prematureAssignAttempted: false,
      loading: false
    };
  },

  finish: function () {
    if ((!this.state.buttonDisabled) && this.props.areAnyStudentsSelected) {
      // this.setState({buttonDisabled: true});
      this.setState({loading: true})
      this.props.finish();
    } else if (!this.state.buttonDisabled) {
      this.setState({prematureAssignAttempted: true});
    }
  },

  determineAssignButtonClass: function () {
    if ((!this.state.buttonDisabled) && this.props.areAnyStudentsSelected) {
      return 'button-green';
    } else {
      return 'button-grey';
    }
  },

  determineErrorMessageClass: function () {
    if (this.state.prematureAssignAttempted) {
      return 'error-message visible-error-message';
    } else {
      return 'error-message hidden-error-message';
    }
  },

  dueDate: function(activityId){
    if (this.props.dueDates && this.props.dueDates[activityId]) {
      return this.props.dueDates[activityId];
    }
  },

  classroomList: function() {
    if (this.props.classrooms) {
      let that = this;
      return this.props.classrooms.map((el)=> {
        return <Classroom    key = {el.classroom.id}
                             classroom={el.classroom}
                             students={el.students}
                             allSelected={el.allSelected}
                             toggleClassroomSelection={that.props.toggleClassroomSelection}
                             toggleStudentSelection={that.props.toggleStudentSelection} />;
      })
    } else {
      return []
    }
  },

  dueDateList: function() {
    const that = this
    return this.props.selectedActivities.map(function(activity) {
      return <ActivityDueDate activity={activity}
                                 key={activity.id}
                                 dueDate={that.dueDate()}
                                 toggleActivitySelection={that.props.toggleActivitySelection}
                                 assignActivityDueDate={that.props.assignActivityDueDate}/>;
    });
  },

  assignButton: function() {
    return this.state.loading
      ? <button ref='button' id='assign' className={this.determineAssignButtonClass() + ' pull-right'}>Assigning... <AssigningIndicator /></button>
      : <button ref='button' id='assign' className={this.determineAssignButtonClass() + ' pull-right'} onClick={this.finish}>Assign</button>
  },

  render: function() {
    return (
      <span>
        <section className='select-students'>
          <h1 className='section-header'>Select Students</h1>
          {this.classroomList()}
        </section>
        <section className='assign-dates'>
          <h1 className='section-header'>
            Assign Dates for {this.props.unitName} (optional)
          </h1>
          <table className='table activity-table'>
            <tbody>
              {this.dueDateList()}
            </tbody>
          </table>
          <div className='error-message-and-button'>
            <div className={this.determineErrorMessageClass()}>{this.props.errorMessage}</div>
            {this.assignButton()}
          </div>
        </section>
      </span>
    );
  }
});
