import React from 'react';

import ButtonLoadingIndicator from '../../../shared/button_loading_indicator';
import NameTheUnit from './name_the_unit';
import ReviewActivities from './review_activities'
import AssignStudents from './assign_students'
import AssignmentFlowNavigation from '../../assignment_flow_navigation.tsx'
import ScrollToTop from '../../../shared/scroll_to_top'

export default class Stage2 extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      buttonDisabled: false,
      prematureAssignAttempted: false,
      loading: false,
      timesSubmitted: 0
    }

    this.finish = this.finish.bind(this)
  }

  finish() {
    const { buttonDisabled, timesSubmitted, } = this.props
    if (!this.state.buttonDisabled && !this.props.errorMessage) {
      // this.setState({buttonDisabled: true});
      this.setState({ loading: true, });
      this.props.finish();
    } else {
      this.setState({ prematureAssignAttempted: true, timesSubmitted: timesSubmitted + 1 });
    }
  }

  determineAssignButtonClass() {
    let buttonClass = 'quill-button contained primary medium';
    if (this.state.buttonDisabled || !this.props.areAnyStudentsSelected) {
      buttonClass += ' disabled';
    }
    return buttonClass;
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
    const { timesSubmitted, } = this.state
    const { errorMessage, unitName, updateUnitName, } = this.props
    return (<NameTheUnit
      unitName={unitName}
      updateUnitName={updateUnitName}
      nameError={errorMessage ? errorMessage.name : null}
      timesSubmitted={timesSubmitted}
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
      ? <button id="assign" className={`${this.determineAssignButtonClass()} pull-right`}>Assigning... <ButtonLoadingIndicator /></button>
      : <button id="assign" className={`${this.determineAssignButtonClass()} pull-right`} onClick={this.finish}>Assign pack to classes</button>;
  }

  render() {
    const { errorMessage, unitTemplateName, unitTemplateId, selectedActivities, isFromDiagnosticPath, } = this.props
    const buttonError = errorMessage ? errorMessage.students : null
    let assignName = 'Activity Pack'
    if (unitTemplateName) {
      assignName = unitTemplateName
    } else if (selectedActivities.every(act => act.activity_classification.key === 'diagnostic')) {
      assignName = 'Diagnostic'
    }
    return (
      <div>
        <ScrollToTop />
        <AssignmentFlowNavigation
          button={this.assignButton()}
          unitTemplateName={unitTemplateName}
          unitTemplateId={unitTemplateId}
          isFromDiagnosticPath={isFromDiagnosticPath}
        />
        <div className="name-and-assign-activity-pack container">
          <h1 className="assign-header">Assign {assignName}</h1>
          {this.renderNameSection()}
          {this.renderReviewActivitiesSection()}
          {this.renderAssignStudentsSection()}
        </div>
      </div>
    );
  }
}
