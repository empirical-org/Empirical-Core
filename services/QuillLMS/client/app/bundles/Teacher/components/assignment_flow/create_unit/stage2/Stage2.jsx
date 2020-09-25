import React from 'react';

import NameTheUnit from './name_the_unit';
import ReviewActivities from './review_activities'
import AssignStudents from './assign_students'

import ButtonLoadingIndicator from '../../../shared/button_loading_indicator';
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
  }

  assignButton() {
    return this.state.loading
      ? <button className={`${this.determineAssignButtonClass()} pull-right`} id="assign">Assigning... <ButtonLoadingIndicator /></button>
      : <button className={`${this.determineAssignButtonClass()} pull-right`} id="assign" onClick={this.finish}>Assign pack to classes</button>;
  }

  determineAssignButtonClass() {
    let buttonClass = 'quill-button contained primary medium';
    if (this.state.buttonDisabled || !this.props.areAnyStudentsSelected) {
      buttonClass += ' disabled';
    }
    return buttonClass;
  }

  determineErrorMessageClass() {
    if (this.state.prematureAssignAttempted) {
      return 'error-message visible-error-message';
    }
    return 'error-message hidden-error-message';
  }

  finish = () => {
    const { buttonDisabled, timesSubmitted, } = this.props
    if (!this.state.buttonDisabled && !this.props.errorMessage) {
      this.setState({ loading: true, });
      this.props.finish();
    } else {
      this.setState({ prematureAssignAttempted: true, timesSubmitted: timesSubmitted + 1 });
    }
  };

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

  renderNameSection() {
    const { timesSubmitted, } = this.state
    const { errorMessage, unitName, updateUnitName, } = this.props
    return (<NameTheUnit
      nameError={errorMessage ? errorMessage.name : null}
      nameError={errorMessage ? errorMessage.name : null}
      timesSubmitted={timesSubmitted}
      unitName={unitName}
      updateUnitName={updateUnitName}
    />)
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
          isFromDiagnosticPath={isFromDiagnosticPath}
          unitTemplateId={unitTemplateId}
          unitTemplateName={unitTemplateName}
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
