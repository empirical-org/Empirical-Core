import React from 'react';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import activityFromClassificationId from '../../modules/activity_from_classification_id.js';

import PreviewOrLaunchModal from '../../shared/preview_or_launch_modal';

const styles = {
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  endRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '220px',
  },
  lessonEndRow: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    maxWidth: '220px',
  },
  reportEndRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '150px',
    marginRight: '15px',
  },
};

export default React.createClass({

  getInitialState() {
    return {
      startDate: this.dueDate() ? moment(this.dueDate()) : undefined,
      showModal: false,
    };
  },

  hideClassroomActivity() {
    const x = confirm('Are you sure you want to delete this assignment?');
    if (x) {
      this.props.hideClassroomActivity(this.caId(), this.unitId());
    }
  },

  handleChange(date) {
    this.setState({ startDate: date, });
    this.props.updateDueDate(this.caId(), date.format());
  },

  goToRecommendations() {
    const unitId = this.unitId();
    const classroomId = this.props.data.classroom_id;
    const link = `/teachers/progress_reports/diagnostic_reports#/u/${unitId}/a/${this.activityId()}/c/${classroomId}/recommendations`;
    window.location = link;
  },

  buttonForRecommendations() {
    const diagnosticIds = [413, 447];
    if (diagnosticIds.includes(this.props.data.activity_id) && window.location.pathname.includes('diagnostic_reports')) {
      return (
        <div onClick={this.goToRecommendations} className="recommendations-button">
					Recommendations
				</div>
      );
    }
  },

  urlForReport() {
    const d = this.props.data;
    return `/teachers/progress_reports/diagnostic_reports#/u/${d.unit_id}/a/${d.activity_id}/c/${d.classroom_id}/students`;
  },

  anonymousPath() {
    return `${process.env.DEFAULT_URL}/activity_sessions/anonymous?activity_id=${this.caId()}`;
  },

  finalCell() {
    const startDate = this.state.startDate;
    if (this.props.report) {
      return [<a key="this.props.data.activity.anonymous_path" href={this.anonymousPath()} target="_blank">Preview</a>, <a key={this.urlForReport()} href={this.urlForReport()}>View Report</a>];
    } else if (this.isLesson()) {
      return this.lessonCompletedOrLaunch();
    }
    return <DatePicker className="due-date-input" onChange={this.handleChange} selected={startDate} placeholderText={startDate ? startDate.format('l') : 'Optional'} />;
  },

  caId() {
    return this.props.data.caId || this.props.data.id;
  },

  unitId() {
    return this.props.unitId || this.props.data.unit_id;
  },

  dueDate() {
    return this.props.data.due_date || this.props.data.dueDate;
  },

  activityId() {
    // uid is just for lessons, in case we don't have the id
    console.log(this.props.data);
    return this.props.data.activityId || this.props.data.activity.uid;
  },

  activityName() {
    return this.props.data.name || this.props.data.activity.name;
  },

  classification() {
    return this.props.data.activityClassificationId;
  },

  icon() {
    const classification = this.classification();
    if (classification) {
      // then we're coming from the index and have an id
      return `icon-${activityFromClassificationId(classification)}-green`;
    }
    // it is stupid that we are passing this in some of this components use create_activity_sessions
    //  but don't have time to deprecate it right now
    return this.props.data.activity.classification.green_image_class;
  },

  lessonCompletedOrLaunch() {
    if (this.props.data.completed) {
      return <p className="lesson-completed">Lesson Completed</p>;
    }
    const text = this.props.data.started ? 'Resume Lesson' : 'Launch Lesson';
    return <a href={`${process.env.DEFAULT_URL}/teachers/classroom_activities/${this.caId()}/launch_lesson/${this.activityId()}`} className="q-button bg-quillgreen" id="launch-lesson">{text}</a>;
  },

  isLesson() {
    return this.props.lesson || this.classification() === 6;
  },

  deleteRow() {
    if (!this.props.report && !(this.isLesson())) {
      return <div className="pull-right"><img className="delete-classroom-activity h-pointer" onClick={this.hideClassroomActivity} src="/images/x.svg" /></div>;
    }
  },

  openModal() {
    this.setState({ showModal: true, });
  },

  closeModal() {
    this.setState({ showModal: false, });
  },

  renderModal() {
    if (this.state.showModal) {
      return (<PreviewOrLaunchModal
        lessonID={this.activityId()}
        classroomActivityID={this.props.data.id}
        closeModal={this.closeModal}
        completed={this.props.data.completed}
      />);
    }
  },

  render() {
    let link,
      endRow;
    if (this.props.report) {
      link = <a href={this.urlForReport()} target="_new">{this.activityName()}</a>;
      endRow = styles.reportEndRow;
    } else if (this.isLesson()) {
      link = <span onClick={this.openModal}>{this.activityName()}</span>;
      endRow = styles.lessonEndRow;
    } else {
      link = <a href={this.anonymousPath()} target="_new">{this.activityName()}</a>;
      endRow = styles.endRow;
    }
    return (
      <div className="row" style={styles.row}>
        {this.renderModal()}
        <div className="starting-row">
          <div className="cell">
            <div className={`pull-left icon-wrapper ${this.icon()}`} />
          </div>
          <div className="cell" id="activity-analysis-activity-name">
            {link}
            {this.buttonForRecommendations()}
          </div>
        </div>
        <div className="cell" style={endRow}>
          {this.finalCell()}
          {this.deleteRow()}
        </div>
      </div>
    );
  },
});
