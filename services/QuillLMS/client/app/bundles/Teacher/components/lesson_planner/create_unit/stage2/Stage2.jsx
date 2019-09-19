import React from 'react';

import ButtonLoadingIndicator from '../../../shared/button_loading_indicator';
import NameTheUnit from './name_the_unit';
import ReviewActivities from './review_activities'
import AssignStudents from './assign_students'

export default class Stage2 extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      buttonDisabled: false,
      prematureAssignAttempted: false,
      loading: false
    }

    this.finish = this.finish.bind(this)
  }

  finish() {
    if (!this.state.buttonDisabled && !this.props.errorMessage) {
      // this.setState({buttonDisabled: true});
      this.setState({ loading: true, });
      this.props.finish();
    } else {
      this.setState({ prematureAssignAttempted: true, });
    }
  }

  determineAssignButtonClass() {
    if ((!this.state.buttonDisabled) && this.props.areAnyStudentsSelected) {
      return 'button-green';
    }
    return 'button-gray';
  }

  determineErrorMessageClass() {
    // && !this.props.unitName || this.props.errorMessage
    if (this.state.prematureAssignAttempted) {
      return 'error-message visible-error-message';
    }
    return 'error-message hidden-error-message';
  }

  renderReviewActivitiesSection() {
    const {
      selectedActivities,
      toggleActivitySelection,
      assignActivityDueDate,
      dueDates,
    } = this.props
    return (<ReviewActivities
      activities={selectedActivities}
      toggleActivitySelection={toggleActivitySelection}
      assignActivityDueDate={assignActivityDueDate}
      dueDates={dueDates}
    />)
  }

  renderNameSection() {
    const { errorMessage, unitName, updateUnitName, } = this.props
    const nameError = this.state.prematureContinueAttempted && errorMessage && errorMessage.includes('name') ? 'name-error' : '';
    return (<NameTheUnit
      unitName={unitName}
      updateUnitName={updateUnitName}
      nameError={nameError}
    />)
  }

  renderAssignStudentsSection() {
    const {
      toggleClassroomSelection,
      toggleStudentSelection,
      user,
      classrooms,
      fetchClassrooms
    } = this.props
    return <AssignStudents
      user={user}
      classrooms={classrooms}
      toggleClassroomSelection={toggleClassroomSelection}
      toggleStudentSelection={toggleStudentSelection}
      fetchClassrooms={fetchClassrooms}
    />
  }

  assignButton() {
    return this.state.loading
      ? <button ref="button" id="assign" className={`${this.determineAssignButtonClass()} pull-right`}>Assigning... <ButtonLoadingIndicator /></button>
      : <button ref="button" id="assign" className={`${this.determineAssignButtonClass()} pull-right`} onClick={this.finish}>Assign</button>;
  }

  render() {
    return (
      <div className="name-and-assign-activity-pack">
        <h1>Assign</h1>
        {this.renderNameSection()}
        {this.renderReviewActivitiesSection()}
        {this.renderAssignStudentsSection()}
        <div className="error-message-and-button">
          <div className={this.determineErrorMessageClass()}>{this.props.errorMessage}</div>
          {this.assignButton()}
        </div>
      </div>
    );
  }
}
