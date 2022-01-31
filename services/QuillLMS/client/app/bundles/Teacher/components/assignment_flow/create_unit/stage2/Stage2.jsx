import React from 'react';

import NameTheUnit from './name_the_unit';
import ReviewActivities from './review_activities'
import AssignStudents from './assign_students'
import SkipRecommendationsWarningModal from './skipRecommendationsWarningModal'
import OverrideWarningModal from './overrideWarningModal'

import ButtonLoadingIndicator from '../../../shared/button_loading_indicator';
import AssignmentFlowNavigation from '../../assignment_flow_navigation.tsx'
import ScrollToTop from '../../../shared/scroll_to_top'
import { postTestClassAssignmentLockedMessages } from '../../assignmentFlowConstants'

export default class Stage2 extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      prematureAssignAttempted: false,
      loading: false,
      timesSubmitted: 0
    }
  }

  assignButton() {
    const { loading, } = this.state
    return loading
      ? <button className={`${this.determineAssignButtonClass()} pull-right`} id="assign" type="button">Assigning... <ButtonLoadingIndicator /></button>
      : <button className={`${this.determineAssignButtonClass()} pull-right`} id="assign" onClick={this.handleClickAssign} type="button">Assign pack to classes</button>;
  }

  determineAssignButtonClass() {
    const { areAnyStudentsSelected, selectedActivities, } = this.props
    let buttonClass = 'quill-button contained primary medium';
    if (!this.buttonEnabled()) {
      buttonClass += ' disabled';
    }
    return buttonClass;
  }

  buttonEnabled() {
    const { areAnyStudentsSelected, selectedActivities, } = this.props
    return areAnyStudentsSelected && selectedActivities.length
  }

  handleClickAssign = () => {
    const { timesSubmitted, } = this.state
    const { errorMessage, finish, alreadyCompletedDiagnosticStudentNames, notYetCompletedPreTestStudentNames, } = this.props
    if (alreadyCompletedDiagnosticStudentNames.length) {
      this.setState({ showOverrideWarningModal: true })
    } else if (notYetCompletedPreTestStudentNames.length) {
      this.setState({ showSkipRecommendationsWarningModal: true, })
    } else if (this.buttonEnabled() && !errorMessage) {
      this.setState({ loading: true, });
      finish();
    } else {
      this.setState({ prematureAssignAttempted: true, timesSubmitted: timesSubmitted + 1 });
    }
  };

  onAssignDespiteWarning = () => {
    const { finish, } = this.props
    this.setState({ loading: true, });
    finish();
  }

  closeSkipRecommendationsWarningModal = () => {
    this.setState({ showSkipRecommendationsWarningModal: false, })
  }

  closeOverrideWarningModal = () => {
    this.setState({ showOverrideWarningModal: false, })
  }

  renderOverrideWarningModal() {
    const { showOverrideWarningModal, } = this.state
    const { alreadyCompletedDiagnosticStudentNames, unitTemplateName, } = this.props

    if (!showOverrideWarningModal) { return }

    return (
      <OverrideWarningModal
        activityName={unitTemplateName}
        handleClickAssign={this.onAssignDespiteWarning}
        handleCloseModal={this.closeOverrideWarningModal}
        studentNames={alreadyCompletedDiagnosticStudentNames}
      />
    )
  }

  renderSkipRecommendationsWarningModal() {
    const { showSkipRecommendationsWarningModal, } = this.state
    const { notYetCompletedPreTestStudentNames, restrictedActivity, } = this.props

    if (!showSkipRecommendationsWarningModal) { return }

    return (
      <SkipRecommendationsWarningModal
        handleClickAssign={this.onAssignDespiteWarning}
        handleCloseModal={this.closeSkipRecommendationsWarningModal}
        restrictedActivityId={restrictedActivity.id}
        studentNames={notYetCompletedPreTestStudentNames}
      />
    )
  }

  renderAssignStudentsSection() {
    const {
      toggleClassroomSelection,
      toggleStudentSelection,
      user,
      classrooms,
      fetchClassrooms,
      lockedClassroomIds,
      restrictedActivity,
      cleverLink,
    } = this.props

    return (
      <AssignStudents
        classrooms={classrooms}
        cleverLink={cleverLink}
        fetchClassrooms={fetchClassrooms}
        lockedClassroomIds={lockedClassroomIds}
        lockedMessage={restrictedActivity ? postTestClassAssignmentLockedMessages[restrictedActivity.id] : ''}
        toggleClassroomSelection={toggleClassroomSelection}
        toggleStudentSelection={toggleStudentSelection}
        user={user}
      />
    )
  }

  renderNameSection() {
    const { timesSubmitted, } = this.state
    const { errorMessage, unitName, updateUnitName, } = this.props
    return (
      <NameTheUnit
        nameError={errorMessage ? errorMessage.name : null}
        timesSubmitted={timesSubmitted}
        unitName={unitName}
        updateUnitName={updateUnitName}
      />
    )
  }

  renderReviewActivitiesSection() {
    const {
      selectedActivities,
      toggleActivitySelection,
      assignActivityDueDate,
      dueDates,
    } = this.props
    return (
      <ReviewActivities
        activities={selectedActivities}
        assignActivityDueDate={assignActivityDueDate}
        dueDates={dueDates}
        toggleActivitySelection={toggleActivitySelection}
      />
    )
  }

  render() {
    const { unitTemplateName, unitTemplateId, selectedActivities, isFromDiagnosticPath, } = this.props
    return (
      <div>
        {this.renderOverrideWarningModal()}
        {this.renderSkipRecommendationsWarningModal()}
        <ScrollToTop />
        <AssignmentFlowNavigation
          button={this.assignButton()}
          isFromDiagnosticPath={isFromDiagnosticPath}
          unitTemplateId={unitTemplateId}
          unitTemplateName={unitTemplateName}
        />
        <div className="name-and-assign-activity-pack container">
          <h1 className="assign-header">Review and assign</h1>
          {this.renderNameSection()}
          {this.renderReviewActivitiesSection()}
          {this.renderAssignStudentsSection()}
        </div>
      </div>
    );
  }
}
