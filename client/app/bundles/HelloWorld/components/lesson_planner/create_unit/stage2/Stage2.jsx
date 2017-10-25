import React from 'react';
import Classroom from './classroom';
import ActivityDueDate from './activity_due_date';
import ClassroomsWithStudents from './ClassroomsWithStudents.jsx';
import AssigningIndicator from '../../../shared/button_loading_indicator';
import NameTheUnit from './name_the_unit.jsx';

export default React.createClass({

  getInitialState() {
    return {
      classroomsAndTheirStudents: [],
      buttonDisabled: false,
      prematureAssignAttempted: false,
      loading: false,
    };
  },

  finish() {
    if (!this.state.buttonDisabled && !this.props.errorMessage) {
      // this.setState({buttonDisabled: true});
      this.setState({ loading: true, });
      this.props.finish();
    } else {
      this.setState({ prematureAssignAttempted: true, });
    }
  },

  determineAssignButtonClass() {
    if ((!this.state.buttonDisabled) && this.props.areAnyStudentsSelected) {
      return 'button-green';
    }
    return 'button-gray';
  },

  determineErrorMessageClass() {
    // && !this.props.unitName || this.props.errorMessage
    if (this.state.prematureAssignAttempted) {
      return 'error-message visible-error-message';
    }
    return 'error-message hidden-error-message';
  },

  dueDate(activityId) {
    if (this.props.dueDates && this.props.dueDates[activityId]) {
      return this.props.dueDates[activityId];
    }
  },

  classroomList() {
    if (this.props.classrooms) {
      const that = this;
      return this.props.classrooms.map(el => <Classroom
        key={el.classroom.id}
        classroom={el.classroom}
        students={el.students}
        allSelected={el.allSelected || el.emptyClassroomSelected}
        toggleClassroomSelection={that.props.toggleClassroomSelection}
        toggleStudentSelection={that.props.toggleStudentSelection}
      />);
    }
    return [];
  },

  dueDateList() {
    const that = this;
    return this.props.selectedActivities.map(activity => (<ActivityDueDate
      activity={activity}
      key={activity.id}
      dueDate={that.dueDate()}
      toggleActivitySelection={that.props.toggleActivitySelection}
      assignActivityDueDate={that.props.assignActivityDueDate}
    />));
  },

  nameComponent() {
    const nameError = this.state.prematureContinueAttempted && this.props.errorMessage && this.props.errorMessage.includes('name') ? 'name-error' : '';
    return <NameTheUnit unitName={this.props.unitName} updateUnitName={this.props.updateUnitName} nameError={nameError} />;
  },

  assignButton() {
    return this.state.loading
      ? <button ref="button" id="assign" className={`${this.determineAssignButtonClass()} pull-right`}>Assigning... <AssigningIndicator /></button>
      : <button ref="button" id="assign" className={`${this.determineAssignButtonClass()} pull-right`} onClick={this.finish}>Assign</button>;
  },

  render() {
    return (
      <div className="name-and-assign-activity-pack">
        <h1>Name & Assign Activity Pack</h1>
        {this.nameComponent()}
        <section className="select-students">
          <h2 className="section-header">Select Students To Assign Activity Pack To:</h2>
          <div className="automatic-assign-note">
            <i className="fa fa-icon fa-lightbulb-o"/>
            <p><span className="bold">Note:</span> If you choose to assign the activity pack to the <span className="italic">entire class</span>, new students to the classroom will get assigned the activity pack automatically. But, if you only assign the activity pack to <span className="italic">certain students</span>, then the activity pack <span className="bold">will not be assigned</span> to the new students automatically.</p>
          </div>
          {this.classroomList()}
        </section>
        <section className="assign-dates">
          <h2 className="section-header">
            Optional - <span>Assign Due Dates To Your Activities:</span>
          </h2>
          <table className="table activity-table">
            <tbody>
              {this.dueDateList()}
            </tbody>
          </table>
          <div className="error-message-and-button">
            <div className={this.determineErrorMessageClass()}>{this.props.errorMessage}</div>
            {this.assignButton()}
          </div>
        </section>
      </div>
    );
  },
});
