import React from 'react';

import NameTheUnit from './name_the_unit';
import ReviewActivities from './review_activities'
import AssignStudents from './assign_students'
import SkipRecommendationsWarningModal from './skipRecommendationsWarningModal'
import OverrideWarningModal from './overrideWarningModal'
import GradeLevelWarningModal from './gradeLevelWarningModal'

import ButtonLoadingIndicator from '../../../shared/button_loading_indicator';
import AssignmentFlowNavigation from '../../assignment_flow_navigation.tsx'
import ScrollToTop from '../../../shared/scroll_to_top'
import { postTestClassAssignmentLockedMessages, } from '../../assignmentFlowConstants'

export class Stage2 extends React.Component {
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
    let buttonClass = 'quill-button contained primary medium';
    if (!this.buttonEnabled()) {
      buttonClass += ' disabled';
    }
    return buttonClass;
  }

  buttonEnabled() {
    const { areAnyStudentsSelected, selectedActivities, errorMessage } = this.props
    return areAnyStudentsSelected && selectedActivities.length && !errorMessage
  }

  selectedClassrooms() {
    const { classrooms, } = this.props

    return classrooms.filter(c => c.students.find(s => s.isSelected) || c.classroom.emptyClassroomSelected)
  }

  handleClickAssign = () => {
    const { timesSubmitted, } = this.state
    const { errorMessage, finish, alreadyCompletedDiagnosticStudentNames, notYetCompletedPreTestStudentNames, showGradeLevelWarning, classrooms, selectedActivities, } = this.props

    const selectedClassrooms = this.selectedClassrooms()
    const lowestSelectedClassroomGrade = Math.min(...selectedClassrooms.map(c => Number(c.classroom.grade) || 12))
    const aboveGradeLevelContentBeingAssigned = selectedActivities.find(a => {
      if (!a.minimum_grade_level) { return }

      return a.minimum_grade_level > lowestSelectedClassroomGrade
    })

    if (alreadyCompletedDiagnosticStudentNames.length) {
      this.setState({ showOverrideWarningModal: true })
    } else if (notYetCompletedPreTestStudentNames.length) {
      this.setState({ showSkipRecommendationsWarningModal: true, })
    } else if (showGradeLevelWarning && aboveGradeLevelContentBeingAssigned) {
      this.setState({ showGradeLevelWarningModal: true, })
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

  closeGradeLevelWarningModal = () => {
    this.setState({ showGradeLevelWarningModal: false, })
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

  renderGradeLevelWarningModal() {
    const { showGradeLevelWarningModal, } = this.state
    const { selectedActivities, } = this.props

    if (!showGradeLevelWarningModal) { return }

    return (
      <GradeLevelWarningModal
        handleClickAssign={this.onAssignDespiteWarning}
        handleCloseModal={this.closeGradeLevelWarningModal}
        selectedActivities={selectedActivities}
        selectedClassrooms={this.selectedClassrooms()}
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
      assignActivityDate,
      dueDates,
      publishDates,
      unitTemplateId
    } = this.props
    return (
      <ReviewActivities
        activities={selectedActivities}
        assignActivityDate={assignActivityDate}
        dueDates={dueDates}
        publishDates={publishDates}
        toggleActivitySelection={toggleActivitySelection}
        unitTemplateId={unitTemplateId}
      />
    )
  }

  render() {
    const { unitTemplateName, unitTemplateId, selectedActivities, isFromDiagnosticPath, } = this.props
    return (
      <div>
        {this.renderGradeLevelWarningModal()}
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

export default Stage2
