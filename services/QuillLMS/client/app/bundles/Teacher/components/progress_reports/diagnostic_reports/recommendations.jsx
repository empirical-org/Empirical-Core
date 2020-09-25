import React from 'react';
import { Snackbar, defaultSnackbarTimeout, } from 'quill-component-library/dist/componentLibrary'
import _ from 'underscore';
import Pusher from 'pusher-js';

import RecommendationsTableCell from './recommendations_table_cell';
import LessonsRecommendations from './lessons_recommendations';

import { requestGet, requestPost } from '../../../../../modules/request';
import LoadingSpinner from '../../shared/loading_indicator.jsx';

export default class Recommendations extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      loading: true,
      recommendations: [],
      previouslyAssignedRecommendations: [],
      previouslyAssignedLessonsRecommendations: [],
      lessonsRecommendations: [],
      selections: [],
      students: [],
      assigning: false,
      assigned: false,
      snackbarVisible: false
    }
  }

  componentDidMount() {
    const { params, } = this.props
    this.getRecommendationData(params.classroomId, params.activityId);
    this.getPreviouslyAssignedRecommendationData(params.classroomId, params.activityId, false);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({
      loading: true,
      assigning: false,
      assigned: false,
    });
    this.getRecommendationData(nextProps.params.classroomId, nextProps.params.activityId);
    this.getPreviouslyAssignedRecommendationData(nextProps.params.classroomId, nextProps.params.activityId, false);
  }

  getPreviouslyAssignedRecommendationData = (classroomId, activityId, assigned) => {
    const that = this;
    requestGet(`/teachers/progress_reports/previously_assigned_recommendations/${classroomId}/activity/${activityId}`, ((data) => {
      that.setState({
        previouslyAssignedRecommendations: data.previouslyAssignedRecommendations,
        previouslyAssignedLessonsRecommendations: data.previouslyAssignedLessonsRecommendations,
      }, that.setSelections(assigned, data.previouslyAssignedLessonsRecommendations));
    }));
  }

  getRecommendationData = (classroomId, activityId) => {
    const { params, } = this.props
    const that = this;
    requestGet(`/teachers/progress_reports/recommendations_for_classroom/${params.unitId}/${classroomId}/activity/${activityId}`, (data) => {
      that.setState({
        recommendations: JSON.parse(JSON.stringify(data.recommendations)),
        students: data.students,
        loading: false,
      }, that.getPreviouslyAssignedRecommendationData(classroomId, activityId, false));
    });
    requestGet(`/teachers/progress_reports/lesson_recommendations_for_classroom/u/${params.unitId}/c/${classroomId}/a/${activityId}`, (data) => {
      that.setState({ lessonsRecommendations: data.lessonsRecommendations, });
    });
  }

  setAssignedToFalseAfterFiveSeconds = () => {
    setTimeout(() => this.setState({ assigned: false, }), 5000);
  }

  setSelections = (assigned, previouslyAssignedLessonsRecommendations) => {
    const { selections, recommendations, lessonsRecommendations, } = this.state
    let newSelections = selections
    if (selections.length === 0) {
      newSelections = recommendations.map((recommendation, i) => {
        return {
          activity_pack_id: recommendation.activity_pack_id,
          name: recommendation.name,
          students: [...recommendation.students],
        };
      });
    }
    const newLessonsRecommendations = lessonsRecommendations.map((recommendation) => {
      if (previouslyAssignedLessonsRecommendations.includes(recommendation.activity_pack_id)) {
        return Object.assign({}, recommendation, { status: 'assigned', previously_assigned: true, });
      } else {
        return recommendation;
      }
    });
    if (assigned) {
      this.setState({ selections: newSelections, assigned, assigning: false, }, this.setAssignedToFalseAfterFiveSeconds);
    } else {
      this.setState({ selections: newSelections, lessonsRecommendations: newLessonsRecommendations, });
    }
  }

  assignToWholeClass  = (unitTemplateId) => {
    const { params, } = this.props
    const that = this;
    requestPost('/teachers/progress_reports/assign_selected_packs/', { whole_class: true, unit_template_id: unitTemplateId, classroom_id: params.classroomId }, (data) => {
      this.initializePusher(unitTemplateId)
    }, (data) => {
      alert('We had trouble processing your request. Please check your network connection and try again.');
    })
  }

  formatSelectionsForAssignment() {
    const { selections, previouslyAssignedRecommendations, } = this.state
    const { params, } = this.props
    const { classroomId } = params

    const selectionsArr = selections.map((activityPack, index) => {
      const students = _.uniq(activityPack.students.concat(previouslyAssignedRecommendations[index].students))
      return {
        id: activityPack.activity_pack_id,
        classrooms: [
          {
            id: classroomId,
            student_ids: students,
          }
        ],
      }
    });
    return { selections: selectionsArr ,};
  }

  handleAssignClick = () => {
    this.setState({ assigning: true, }, () => {
      requestPost('/teachers/progress_reports/assign_selected_packs/', this.formatSelectionsForAssignment(), (data) => {
        this.initializePusher()
      }, (data) => {
        alert('We had trouble processing your request. Please check your network connection and try again.');
        this.setState({ assigning: false, });
      })
    });
  }

  handleSelectAllRecommendationsClick = () => {
    const { selections, recommendations, } = this.state
    const newSelections = selections.map((selection, index) => {
      selection.students = recommendations[index].students
      return selection
    })
    this.setState({selections: newSelections})
  }

  handleUnselectAllRecommendationsClick = () => {
    const { selections, } = this.state

    const newSelections = selections.map(selection => {
      selection.students = []
      return selection
    })
    this.setState({selections: newSelections})
  }

  triggerSnackbar = (snackbarText) => {
    this.setState({snackbarVisible: true, snackbarText, }, () => {
      setTimeout(() => this.setState({ snackbarVisible: false, }), defaultSnackbarTimeout)
    })
  }

  initializePusher(unitTemplateId) {
    if (process.env.RAILS_ENV === 'development') {
      Pusher.logToConsole = true;
    }
    const { params } = this.props
    const pusher = new Pusher(process.env.PUSHER_KEY, { encrypted: true, });
    const channel = pusher.subscribe(params.classroomId);
    const that = this;
    if (unitTemplateId) {
      channel.bind(`${unitTemplateId}-lesson-assigned`, (data) => {
        const newObj = Object.assign({}, that.state);
        newObj.lessonsRecommendations.find(rec => rec.activity_pack_id === unitTemplateId).status = 'assigned';
        that.setState(newObj, () => that.triggerSnackbar('Activity pack assigned'));
      });
    } else {
      channel.bind('personalized-recommendations-assigned', (data) => {
        this.triggerSnackbar('Activity packs assigned')
        that.getPreviouslyAssignedRecommendationData(params.classroomId, params.activityId, true);
      });
    }
  }

  studentIsRecommended(student, recommendation) {
    return (_.indexOf(recommendation.students, student.id) != -1);
  }

  studentIsSelected(student, selection) {
    if (student && selection && selection.students && selection.students.length) {
      return selection.students.includes(student.id);
    }
  }

  studentWasAssigned(student, previouslyAssignedRecommendation) {
    if (previouslyAssignedRecommendation && previouslyAssignedRecommendation.students) {
      return previouslyAssignedRecommendation.students.includes(student.id);
    }
  }

  toggleSelected = (student, index) => {
    const { selections, } = this.state
    const newSelections = [...selections];
    if (this.studentIsSelected(student, newSelections[index])) {
      newSelections[index].students = _.reject(newSelections[index].students, stud => stud === student.id);
    } else {
      newSelections[index].students.push(student.id);
    }
    this.setState({ selections: newSelections, });
  }

  renderActivityPackHeaderItems() {
    const { recommendations, } = this.state
    return recommendations.map(recommendation => {
      /* eslint-disable react/jsx-no-target-blank */
      const link = <a className="focus-on-light view-pack-link" href={`/activities/packs/${recommendation.activity_pack_id}`} target="_blank">View Pack</a>
      /* eslint-enable react/jsx-no-target-blank */
      return (<div className="recommendations-table-header-item" key={recommendation.activity_pack_id}>
        <p>{recommendation.name}</p>
        {link}
      </div>)
    });
  }

  renderActivityPackRowItems(student) {
    const { recommendations, selections, previouslyAssignedRecommendations, } = this.state
    return recommendations.map((recommendation, i) => {
      let checkboxOnClick;
      const selection = selections[i];
      const previouslyAssignedRecommendation = previouslyAssignedRecommendations[i];
      const previouslyAssigned = this.studentWasAssigned(student, previouslyAssignedRecommendation)
				? ' previously-assigned '
				: '';
      const recommended = this.studentIsRecommended(student, recommendation)
				? ' recommended '
				: '';
      const selected = this.studentIsSelected(student, selection)
				? ' selected '
				: '';

      return (
        <RecommendationsTableCell
          checkboxOnClick={this.toggleSelected}
          index={i}
          key={recommendation.activity_pack_id}
          previouslyAssigned={previouslyAssigned}
          recommendation={recommendation}
          recommended={recommended}
          selected={selected}
          student={student}
        />
      );
    });
  }

  renderAssignButton() {
    const { assigning, assigned, selections, previouslyAssignedRecommendations, } = this.state
    const className = "focus-on-light quill-button medium primary contained"
    if (assigning) {
      return (
        <div className={className}>
          <span>Assigning...</span>
        </div>
      );
    } else if (assigned) {
      return (
        <div className={className}>
          <span>Assigned</span>
        </div>
      );
    }

    const thereAreSelectionsThatHaveYetToBeAssigned = selections && selections.find(sel => {
      if (!sel.students.length) { return false }
      const matchingPreviouslyAssignedRecommendation = previouslyAssignedRecommendations.find(r => r.activity_pack_id === sel.activity_pack_id)
      if (!matchingPreviouslyAssignedRecommendation) { return true }
      return sel.students.find(s => !matchingPreviouslyAssignedRecommendation.students.includes(s))
    })

    const disabled = thereAreSelectionsThatHaveYetToBeAssigned ? '' : 'disabled'

    return (
      <button className={`${className} ${disabled}`} onClick={!disabled && this.handleAssignClick} type="submit">
        <span>Assign Activity Packs</span>
      </button>
    );
  }

  renderCheckOrUncheckAllRecommendedActivityPacks() {
    const { selections, } = this.state
    const hasSelectedActivities = selections.find(sel => _.compact(sel.students).length > 0)
    if (hasSelectedActivities) {
      return(
        <button className="quill-button focus-on-light uncheck-recommendations" onClick={this.handleUnselectAllRecommendationsClick} type="reset">
          <img alt="uncheck-all-logo" src="https://assets.quill.org/images/icons/uncheckall-diagnostic.svg" />
          <span>Uncheck All</span>
        </button>
      );
    } else {
      return(
        <button className="quill-button focus-on-light check-recommendations" onClick={this.handleSelectAllRecommendationsClick} type="submit">
          <img alt="check-all-logo" src="https://assets.quill.org/images/icons/checkall-diagnostic.svg" />
          <span>Check All</span>
        </button>
      );
    }
  }

  renderExplanation() {
    return (
      <div className="recommendations-explanation-container">
        <p className="recommendations-explanation">
					Based on the results of the diagnostic, we created a personalized learning plan for each student.
          <br />Customize your learning plan by selecting the activity packs you would like to assign.
        </p>
      </div>
    );
  }

  renderGroupActivityRecommendations() {
    const { lessonsRecommendations, } = this.state

    if (!lessonsRecommendations.length) { return }

    return (
      <LessonsRecommendations
        assignToWholeClass={this.assignToWholeClass}
        recommendations={lessonsRecommendations}
      />
    );
  }

  renderIndependentActivityRecommendations() {
    const { recommendations, } = this.state

    if (!recommendations.length) { return }

    return (
      <div className="independent-practice-container">
        <h3 className="independent-practice-header" id="recommendations-scroll-to" >
          <img
            alt="independent practice logo"
            className="independent-practice-logo"
            src="https://assets.quill.org/images/icons/independent-lesson-blue.svg"
          />
          <span>Independent Activity Recommendations</span>
        </h3>
        {this.renderExplanation()}
        <div>
          {this.renderTopBar()}
          {this.renderTableHeader()}
          <div className="recommendations-table-row-wrapper">
            {this.renderTableRows()}
          </div>
        </div>
      </div>
    );
  }

  renderRecommendations() {
    const { recommendations, lessonsRecommendations, } = this.state
    if (recommendations.length || lessonsRecommendations.length) {
      return (
        <div className="recommendations-container">
          {this.renderIndependentActivityRecommendations()}
          {this.renderGroupActivityRecommendations()}
        </div>
      );
    } else {
      return (<div className="recommendations-container">
        <p className="no-recommendations">We do not yet have recommendations for this diagnostic. Please check back soon.</p>
      </div>)
    }
  }

  renderTableHeader() {
    return (
      <div className="recommendations-table-header">
        <div className="recommendations-table-header-name">Name</div>
        {this.renderActivityPackHeaderItems()}
      </div>
    );
  }

  renderTableRow(student) {
    const { params, } = this.props
    const { activityId, classroomId, unitId } = params
    if (student.completed) {
      /* eslint-disable react/jsx-no-target-blank */
      const studentReportLink = <a href={`/teachers/progress_reports/diagnostic_reports#/u/${unitId}/a/${activityId}/c/${classroomId}/student_report/${student.id}`} target="_blank"><span>{student.name}</span> <i className="fas fa-icon fa-external-link" /></a>
      /* eslint-enable react/jsx-no-target-blank */
      return (
        <div className="recommendations-table-row" key={student.id}>
          <div className="recommendations-table-row-name">{studentReportLink}</div>
          {this.renderActivityPackRowItems(student)}
        </div>
      );
    }

    return (<div className="recommendations-table-row not-completed-row" key={student.id}>
      <div className="recommendations-table-row-name">{student.name}</div>
      <div className="not-completed-cell">Diagnostic not completed</div>
    </div>)
  }

  renderTableRows() {
    const { students, } = this.state
    return students.map(student => this.renderTableRow(student));
  }

  renderTopBar() {
    return (
      <div className="recommendations-top-bar">
        <div className="recommendations-key">
          <div className="recommendations-key-icon" />
          <span className="recommended-activity-pack-text">
            <p>Recommended Activity Packs</p>
            {this.renderCheckOrUncheckAllRecommendedActivityPacks()}
          </span>
          <div className="assigned-recommendations-key-icon"><i className="fas fa-check-circle" /></div>
          <span className="assigned-activity-pack-text">
            <p>Assigned Activity Packs</p>
            <p>Assigned activities will not be assigned again.</p>
          </span>
        </div>
        {this.renderAssignButton()}
      </div>
    );
  }

  render() {
    const { loading, snackbarVisible, snackbarText, } = this.state

    if (loading) {
      return <LoadingSpinner />;
    }

    return (
      <div>
        <Snackbar text={snackbarText} visible={snackbarVisible} />
        {this.renderRecommendations()}
      </div>
    );
  }
}
