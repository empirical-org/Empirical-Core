import React from 'react';
import $ from 'jquery';
import request from 'request';
import LoadingSpinner from '../../shared/loading_indicator.jsx';
import _ from 'underscore';
import authToken from '../../modules/get_auth_token.js';
import Pusher from 'pusher-js';
import RecommendationsTableCell from './recommendations_table_cell';
import LessonsRecommendations from './lessons_recommendations';
import RecommendationOverview from './recommendation_overview';

export default React.createClass({

  getInitialState() {
    return {
      loading: true,
      recommendations: [],
      previouslyAssignedRecommendations: [],
      previouslyAssignedLessonsRecommendations: [],
      lessonsRecommendations: [],
      selections: [],
      students: [],
      assigning: false,
      assigned: false,
    };
  },

  componentDidMount() {
    this.getRecommendationData(this.props.params.classroomId, this.props.params.activityId);
    this.getPreviouslyAssignedRecommendationData(this.props.params.classroomId, this.props.params.activityId, false);
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      loading: true,
      assigning: false,
      assigned: false,
    });
    this.getRecommendationData(nextProps.params.classroomId, nextProps.params.activityId);
    this.getPreviouslyAssignedRecommendationData(nextProps.params.classroomId, nextProps.params.activityId, false);
  },

  setAssignedToFalseAfterFiveSeconds() {
    setTimeout(() => this.setState({ assigned: false, }), 5000);
  },

  getRecommendationData(classroomId, activityId) {
    const that = this;
    $.get(`/teachers/progress_reports/recommendations_for_classroom/${that.props.params.unitId}/${classroomId}/activity/${activityId}`, (data) => {
      that.setState({
        recommendations: JSON.parse(JSON.stringify(data.recommendations)),
        students: data.students,
        loading: false,
      }, that.getPreviouslyAssignedRecommendationData(classroomId, activityId, false));
    });
    $.get(`/teachers/progress_reports/lesson_recommendations_for_classroom/u/${that.props.params.unitId}/c/${classroomId}/a/${activityId}`, (data) => {
      that.setState({ lessonsRecommendations: data.lessonsRecommendations, });
    });
  },

  getPreviouslyAssignedRecommendationData(classroomId, activityId, assigned) {
    const that = this;
    $.get(`/teachers/progress_reports/previously_assigned_recommendations/${classroomId}/activity/${activityId}`, ((data) => {
      that.setState({
        previouslyAssignedRecommendations: data.previouslyAssignedRecommendations,
        previouslyAssignedLessonsRecommendations: data.previouslyAssignedLessonsRecommendations,
      }, that.setSelections(assigned, data.previouslyAssignedLessonsRecommendations));
    }));
  },

  setSelections(assigned, previouslyAssignedLessonsRecommendations) {
    let selections
    if (this.state.selections.length === 0) {
      selections = this.state.recommendations.map((recommendation, i) => {
        return {
          activity_pack_id: recommendation.activity_pack_id,
          name: recommendation.name,
          students: recommendation.students,
        };
      });
    } else {
      selections = this.state.selections
    }
    const lessonsRecommendations = this.state.lessonsRecommendations.map((recommendation) => {
      if (previouslyAssignedLessonsRecommendations.includes(recommendation.activity_pack_id)) {
        return Object.assign({}, recommendation, { status: 'assigned', });
      } else {
        return recommendation;
      }
    });
    if (assigned) {
      this.setState({ selections, assigned, assigning: false, }, this.setAssignedToFalseAfterFiveSeconds);
    } else {
      this.setState({ selections, lessonsRecommendations, });
    }
  },

  unselectAllRecommendations() {
    const newSelections = this.state.selections.map(selection => {
      selection.students = []
      return selection
    })
    this.setState({selections: newSelections})
  },

  selectAllRecommendations() {
    const newSelections = this.state.selections.map((selection, index) => {
      selection.students = this.state.recommendations[index].students
      return selection
    })
    this.setState({selections: newSelections})
  },

  studentWasAssigned(student, previouslyAssignedRecommendation) {
    if (previouslyAssignedRecommendation && previouslyAssignedRecommendation.students) {
      return previouslyAssignedRecommendation.students.includes(student.id);
    }
  },

  studentIsSelected(student, selection) {
    if (student && selection && selection.students && selection.students.length) {
      return selection.students.includes(student.id);
    }
  },

  studentIsRecommended(student, recommendation) {
    return (_.indexOf(recommendation.students, student.id) != -1);
  },

  toggleSelected(student, index) {
    const selections = [...this.state.selections];
    if (this.studentIsSelected(student, selections[index])) {
      selections[index].students = _.reject(selections[index].students, stud => stud === student.id);
    } else {
      selections[index].students.push(student.id);
    }
    this.setState({ selections, });
  },

  assignSelectedPacks() {
    this.setState({ assigning: true, }, () => {
      $.ajax({
		  	type: 'POST',
		  	url: '/teachers/progress_reports/assign_selected_packs/',
		  	dataType: 'json',
		  	contentType: 'application/json',
		  	data: JSON.stringify(this.formatSelectionsForAssignment()),
      })
			.done(() => { this.initializePusher(); })
			.fail(() => {
  alert('We had trouble processing your request. Please check your network connection and try again.');
  this.setState({ assigning: false, });
});
    });
  },

  formatSelectionsForAssignment() {
    const classroomId = this.props.params.classroomId;
    const selectionsArr = this.state.selections.map((activityPack, index) => {
      const students = _.uniq(activityPack.students.concat(this.state.previouslyAssignedRecommendations[index].students))
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
  },

  assignToWholeClass(unitTemplateId) {
    const that = this;
    $.ajax({
      type: 'POST',
      url: '/teachers/progress_reports/assign_selected_packs/',
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify({ authenticity_token: authToken(), whole_class: true, unit_template_id: unitTemplateId, classroom_id: this.props.params.classroomId, }),
    })
    .done(() => {
      this.initializePusher(unitTemplateId);
    })
    .fail(() => {
      alert('We had trouble processing your request. Please check your network connection and try again.');
      // this.setState({ assigning: false, });
    });
  },

  initializePusher(unitTemplateId) {
    if (process.env.RAILS_ENV === 'development') {
      Pusher.logToConsole = true;
    }
    const params = this.props.params;
    const pusher = new Pusher(process.env.PUSHER_KEY, { encrypted: true, });
    const channel = pusher.subscribe(this.props.params.classroomId);
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
  },

  renderExplanation() {
    return (
      <div className="recommendations-explanation-container">
        <p className="recommendations-explanation">
					Based on the results of the diagnostic, we created a personalized learning plan for each student.
					<br />Customize your learning plan by selecting the activity packs you would like to assign.
				</p>
      </div>
    );
  },

  renderCheckOrUncheckAllRecommendedActivityPacks() {
    const hasSelectedActivities = this.state.selections.find(sel => _.compact(sel.students).length > 0)
    if (hasSelectedActivities) {
      return <p className="uncheck-recommendations" onClick={this.unselectAllRecommendations}><img src="https://assets.quill.org/images/icons/uncheckall-diagnostic.svg"/><span>Uncheck All</span></p>
    } else {
      return <p className="check-recommendations" onClick={this.selectAllRecommendations}><img src="https://assets.quill.org/images/icons/checkall-diagnostic.svg"/><span>Check All</span></p>
    }
  },

  renderTopBar() {
    return (
      <div className="recommendations-top-bar">
        <div className="recommendations-key">
          <div className="recommendations-key-icon" />
          <span className="recommended-activity-pack-text">
            <p>Recommended Activity Packs</p>
            {this.renderCheckOrUncheckAllRecommendedActivityPacks()}
          </span>
          <div className="assigned-recommendations-key-icon"><i className="fa fa-check-circle" /></div>
          <span className="assigned-activity-pack-text">
            <p>Assigned Activity Packs</p>
            <p>Assigned activities will not be assigned again.</p>
          </span>
        </div>
        {this.renderAssignButton()}
      </div>
    );
  },

  renderAssignButton() {
    if (this.state.assigning) {
      return (
        <div className="recommendations-assign-button">
          <span>Assigning...</span>
        </div>
      );
    } else if (this.state.assigned) {
      return (
        <div className="recommendations-assign-button">
          <span>Assigned</span>
        </div>
      );
    }
    return (
      <div className="recommendations-assign-button" onClick={this.assignSelectedPacks}>
        <span>Assign Activity Packs</span>
      </div>
    );
  },

  renderTableHeader() {
    return (
      <div className="recommendations-table-header">
        <div className="recommendations-table-header-name">Name</div>
        {this.renderActivityPackHeaderItems()}
      </div>
    );
  },

  renderActivityPackHeaderItems() {
    return this.state.recommendations.map(recommendation => (
      <div className="recommendations-table-header-item" key={recommendation.activity_pack_id}>
        <p>{recommendation.name}</p>
        <a href={`/activities/packs/${recommendation.activity_pack_id}`} target="_blank">View Pack</a>
      </div>
			));
  },

  renderTableRows() {
    return this.state.students.map(student => this.renderTableRow(student));
  },

  renderTableRow(student) {
    const { activityId, classroomId, unitId } = this.props.routeParams
    const studentReportLink = `/teachers/progress_reports/diagnostic_reports#/u/${unitId}/a/${activityId}/c/${classroomId}/student_report/${student.id}`
    return (
      <div className="recommendations-table-row" key={student.id}>
        <div className="recommendations-table-row-name"><a href={studentReportLink} target="_blank"><span>{student.name}</span> <i className="fa fa-icon fa-external-link"></i></a></div>
        {this.renderActivityPackRowItems(student)}
      </div>
    );
  },

  renderActivityPackRowItems(student) {
    return this.state.recommendations.map((recommendation, i) => {
      let checkboxOnClick;
      const selection = this.state.selections[i];
      const previouslyAssignedRecommendation = this.state.previouslyAssignedRecommendations[i];
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
          key={recommendation.activity_pack_id}
          previouslyAssigned={previouslyAssigned}
          recommended={recommended}
          selected={selected}
          recommendation={recommendation}
          checkboxOnClick={this.toggleSelected.bind(null, student, i)}
        />
      );
    });
  },

  render() {
    if (this.state.loading) {
      return <LoadingSpinner />;
    }
    return (
      <div>
        <RecommendationOverview />
        <h3
          id="recommendations-scroll-to"
          style={{ width: '950px', margin: 'auto', textAlign: 'left', fontSize: '24px', fontWeight: 'bold', color: '#3b3b3b', }}
        >
          <img
            style={{
              position: 'relative',
              top: '-3px',
              marginRight: '15px',
            }}
            src="https://assets.quill.org/images/icons/independent-lesson-blue.svg" alt="independent practice logo"
          />
          Independent Activity Recommendations
          </h3>
        {this.renderExplanation()}
        <div className="recommendations-container">
          {this.renderTopBar()}
          {this.renderTableHeader()}
          <div className="recommendations-table-row-wrapper">
            {this.renderTableRows()}
          </div>
          <LessonsRecommendations assignToWholeClass={this.assignToWholeClass} recommendations={this.state.lessonsRecommendations} />
        </div>
      </div>
    );
  },

});
