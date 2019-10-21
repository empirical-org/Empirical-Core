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
      assignActivityDueDate={assignActivityDueDate}
      dueDates={dueDates}
      toggleActivitySelection={toggleActivitySelection}
    />)
  }

  renderNameSection() {
    const { errorMessage, unitName, updateUnitName, } = this.props
    return (<NameTheUnit
      nameError={errorMessage ? errorMessage.name : null}
      unitName={unitName}
      updateUnitName={updateUnitName}
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
    return (<AssignStudents
      classrooms={classrooms}
      fetchClassrooms={fetchClassrooms}
      toggleClassroomSelection={toggleClassroomSelection}
      toggleStudentSelection={toggleStudentSelection}
      user={user}
    />)
  }

  assignButton() {
    return this.state.loading
      ? <button className={`${this.determineAssignButtonClass()} pull-right`} id="assign" ref="button">Assigning... <ButtonLoadingIndicator /></button>
      : <button className={`${this.determineAssignButtonClass()} pull-right`} id="assign" onClick={this.finish} ref="button">Assign</button>;
  }

  render() {
    const { errorMessage, unitTemplateName, selectedActivities, } = this.props
    const buttonError = errorMessage ? errorMessage.students : null
    let assignName = 'Activity Pack'
    if (unitTemplateName) {
      assignName = unitTemplateName
    } else if (selectedActivities.every(act => act.activity_classification.key === 'diagnostic')) {
      assignName = 'Diagnostic'
    }
    return (
      <div className="name-and-assign-activity-pack">
        <h1 className="assign-header">Assign {assignName}</h1>
        {this.renderNameSection()}
        {this.renderReviewActivitiesSection()}
        {this.renderAssignStudentsSection()}
        <div className="error-message-and-button">
          <div className={this.determineErrorMessageClass()}>{buttonError}</div>
          {this.assignButton()}
        </div>
      </div>
    );
  }
}
