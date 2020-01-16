import React from 'react';
import LoadingSpinner from '../../shared/loading_indicator.jsx';
import _ from 'underscore';
import { requestGet, requestPost } from '../../../../../modules/request';
import Pusher from 'pusher-js';
import RecommendationsTableCell from './recommendations_table_cell';
import LessonsRecommendations from './lessons_recommendations';
import RecommendationOverview from './recommendation_overview';

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
    }
  }

  componentDidMount() {
    const { params, } = this.props
    this.getRecommendationData(params.classroomId, params.activityId);
    this.getPreviouslyAssignedRecommendationData(params.classroomId, params.activityId, false);
    this.assignToWholeClass(params.unitTemplateId);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      loading: true,
      assigning: false,
      assigned: false,
    });
    this.getRecommendationData(nextProps.params.classroomId, nextProps.params.activityId);
    this.getPreviouslyAssignedRecommendationData(nextProps.params.classroomId, nextProps.params.activityId, false);
    this.assignToWholeClass(nextProps.params.unitTemplateId);
  }

  setAssignedToFalseAfterFiveSeconds = () => {
    setTimeout(() => this.setState({ assigned: false, }), 5000);
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

  getPreviouslyAssignedRecommendationData = (classroomId, activityId, assigned) => {
    const that = this;
    requestGet(`/teachers/progress_reports/previously_assigned_recommendations/${classroomId}/activity/${activityId}`, ((data) => {
      that.setState({
        previouslyAssignedRecommendations: data.previouslyAssignedRecommendations,
        previouslyAssignedLessonsRecommendations: data.previouslyAssignedLessonsRecommendations,
      }, that.setSelections(assigned, data.previouslyAssignedLessonsRecommendations));
    }));
  }

  setSelections = (assigned, previouslyAssignedLessonsRecommendations) => {
    const { selections, recommendations, lessonsRecommendations, } = this.state
    let newSelections = selections
    if (selections.length === 0) {
      newSelections = recommendations.map((recommendation, i) => {
        return {
          activity_pack_id: recommendation.activity_pack_id,
          name: recommendation.name,
          students: recommendation.students,
        };
      });
    }
    const newLessonsRecommendations = lessonsRecommendations.map((recommendation) => {
      if (previouslyAssignedLessonsRecommendations.includes(recommendation.activity_pack_id)) {
        return Object.assign({}, recommendation, { status: 'assigned', });
      } else {
        return recommendation;
      }
    });
    if (assigned) {
      this.setState({ selections: newSelections, assigned, assigning: false, }, this.setAssignedToFalseAfterFiveSeconds);
    } else {
      this.setState({ selections: newSelections, newLessonsRecommendations, });
    }
  }

  handleUnselectAllRecommendationsClick = () => {
    const { selections, } = this.state

    const newSelections = selections.map(selection => {
      selection.students = []
      return selection
    })
    this.setState({selections: newSelections})
  }

  handleSelectAllRecommendationsClick = () => {
    const { selections, recommendations, } = this.state
    const newSelections = selections.map((selection, index) => {
      selection.students = recommendations[index].students
      return selection
    })
    this.setState({selections: newSelections})
  }

  studentWasAssigned(student, previouslyAssignedRecommendation) {
    if (previouslyAssignedRecommendation && previouslyAssignedRecommendation.students) {
      return previouslyAssignedRecommendation.students.includes(student.id);
    }
  }

  studentIsSelected(student, selection) {
    if (student && selection && selection.students && selection.students.length) {
      return selection.students.includes(student.id);
    }
  }

  studentIsRecommended(student, recommendation) {
    return (_.indexOf(recommendation.students, student.id) != -1);
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

  assignToWholeClass  = (unitTemplateId) => {
    const { params, } = this.props
    const that = this;
    requestPost('/teachers/progress_reports/assign_selected_packs/', { whole_class: true, unit_template_id: unitTemplateId, classroom_id: params.classroomId }, (data) => {
      this.initializePusher(unitTemplateId)
    }, (data) => {
      alert('We had trouble processing your request. Please check your network connection and try again.');
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
        that.setState(newObj);
      });
    } else {
      channel.bind('personalized-recommendations-assigned', (data) => {
        that.getPreviouslyAssignedRecommendationData(params.classroomId, params.activityId, true);
      });
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

  renderCheckOrUncheckAllRecommendedActivityPacks() {
    const { selections, } = this.state
    const hasSelectedActivities = selections.find(sel => _.compact(sel.students).length > 0)
    if (hasSelectedActivities) {
      return <p className="uncheck-recommendations" onClick={this.handleUnselectAllRecommendationsClick}><img src="https://assets.quill.org/images/icons/uncheckall-diagnostic.svg" /><span>Uncheck All</span></p>
    } else {
      return <p className="check-recommendations" onClick={this.handleSelectAllRecommendationsClick}><img src="https://assets.quill.org/images/icons/checkall-diagnostic.svg" /><span>Check All</span></p>
    }
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

  renderAssignButton() {
    const { assigning, assigned, } = this.state
    if (assigning) {
      return (
        <div className="recommendations-assign-button">
          <span>Assigning...</span>
        </div>
      );
    } else if (assigned) {
      return (
        <div className="recommendations-assign-button">
          <span>Assigned</span>
        </div>
      );
    }
    return (
      <div className="recommendations-assign-button" onClick={this.handleAssignClick}>
        <span>Assign Activity Packs</span>
      </div>
    );
  }

  renderTableHeader() {
    return (
      <div className="recommendations-table-header">
        <div className="recommendations-table-header-name">Name</div>
        {this.renderActivityPackHeaderItems()}
      </div>
    );
  }

  renderActivityPackHeaderItems() {
    const { recommendations, } = this.state
    return recommendations.map(recommendation => {
      /* eslint-disable react/jsx-no-target-blank */
      const link = <a href={`/activities/packs/${recommendation.activity_pack_id}`} target="_blank">View Pack</a>
      /* eslint-enable react/jsx-no-target-blank */
      return (<div className="recommendations-table-header-item" key={recommendation.activity_pack_id}>
        <p>{recommendation.name}</p>
        {link}
      </div>)
    });
  }

  renderTableRows() {
    const { students, } = this.state
    return students.map(student => this.renderTableRow(student));
  }

  renderTableRow(student) {
    const { routeParams, } = this.props
    const { activityId, classroomId, unitId } = routeParams
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

  renderIndependentActivityRecommendations() {
    const { recommendations, } = this.state

    if (!recommendations.length) { return }

    return (
      <div>
        <h3
          id="recommendations-scroll-to"
          style={{ width: '950px', margin: 'auto', textAlign: 'left', fontSize: '24px', fontWeight: 'bold', color: '#3b3b3b', }}
        >
          <img
            alt="independent practice logo"
            src="https://assets.quill.org/images/icons/independent-lesson-blue.svg"
            style={{
              position: 'relative',
              top: '-3px',
              marginRight: '15px',
            }}
          />
          Independent Activity Recommendations
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
        <p style={{ fontSize: '24px', }}>We do not yet have recommendations for this diagnostic. Please check back soon.</p>
      </div>)
    }
  }

  render() {
    const { loading, } = this.state

    if (loading) {
      return <LoadingSpinner />;
    }

    return (
      <div>
        <RecommendationOverview />
        {this.renderRecommendations()}
      </div>
    );
  }

}
