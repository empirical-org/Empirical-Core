import React from 'react';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import Pluralize from 'pluralize';
import activityFromClassificationId from '../../modules/activity_from_classification_id.js';

import PreviewOrLaunchModal from '../../shared/preview_or_launch_modal';

const styles = {
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  endRow:{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '240px',
  },
  lessonEndRow:{
    display: 'flex',
    width: '100%',
    maxWidth: '390px',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  reportEndRow:{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginRight: '15px',
  }
}

export default class ClassroomActivity extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      startDate: this.dueDate() ? moment(this.dueDate()) : undefined,
      showModal: false,
      showCustomizeTooltip: false,
      showLessonPlanTooltip: false,
    }
  }

  componentWillReceiveProps = (nextProps) => {
    const newDueDate = nextProps.data ? nextProps.data.dueDate : null
    const formattedNewDueDate = newDueDate ? moment(newDueDate) : undefined;
    if (formattedNewDueDate !== this.state.startDate) {
      this.setState({ startDate: formattedNewDueDate, });
    }
  }

  hideUnitActivity = () => {
    const x = confirm('Are you sure you want to delete this assignment?');
    if (x) {
      this.props.hideUnitActivity(this.uaId(), this.unitId());
    }
  }

  handleChange = (date) => {
    const formattedDate = date ? date.format() : null
    this.setState({ startDate: date, });
    this.props.updateDueDate(this.uaId(), formattedDate);
  }

  toggleCustomizeTooltip = () => {
    this.setState({ showCustomizeTooltip: !this.state.showCustomizeTooltip, });
  }

  toggleLessonPlanTooltip = () => {
    this.setState({ showLessonPlanTooltip: !this.state.showLessonPlanTooltip, });
  }

  renderCustomizedEditionsTag = () => {
    if (window.location.pathname.includes('lessons')) {
      if (this.props.data.hasEditions) {
        return <div className="customized-editions-tag">Customized</div>;
      }
    }
  }

  renderCustomizeTooltip = () => {
    if (this.state.showCustomizeTooltip) {
      return (<div className="customize-tooltip">
        <i className="fas fa-caret-up" />
        Customize
      </div>);
    }
  }

  renderLessonPlanTooltip = () => {
    if (this.state.showLessonPlanTooltip) {
      return (<div className="lesson-plan-tooltip">
        <i className="fas fa-caret-up" />
        Download Lesson Plan
      </div>);
    }
  }

  goToRecommendations = () => {
    const link = `/teachers/progress_reports/diagnostic_reports#/u/${this.unitId()}/a/${this.activityId()}/c/${this.classroomId()}/recommendations`;
    window.location = link;
  }

  buttonForRecommendations = () => {
    const activityWithRecommendationIds = this.props.activityWithRecommendationsIds;
    if (activityWithRecommendationIds && activityWithRecommendationIds.includes(this.activityId()) && window.location.pathname.includes('diagnostic_reports')) {
      return (
        <div className="recommendations-button" onClick={this.goToRecommendations}>
          Recommendations
        </div>
      );
    }
  }

  renderLessonsAction = () => {
    if (window.location.pathname.includes('lessons')) {
      if (this.props.data.completed === 't') {
        return <p className="lesson-completed"><i className="fas fa-icon fa-check-circle" />Lesson Complete</p>;
      } else if (this.props.data.started) {
        const href = `/teachers/classroom_units/${this.classroomUnitId()}/mark_lesson_as_completed/${this.activityId()}`;

        return <a className="mark-completed" href={href} target="_blank">Mark As Complete</a>;
      }
    }
  }

  lessonFinalCell = () => {
    return (<div className="lessons-end-row">
      {this.lessonCompletedOrLaunch()}
      <a
        className="customize-lesson"
        href={`/customize/${this.props.data.activityUid}`}
        onMouseEnter={this.toggleCustomizeTooltip}
        onMouseLeave={this.toggleCustomizeTooltip}
      >
        <i className="fas fa-icon fa-magic" />
        {this.renderCustomizeTooltip()}
      </a>
      <a
        className="supporting-info"
        href={`/activities/${this.activityId()}/supporting_info`}
        onMouseEnter={this.toggleLessonPlanTooltip}
        onMouseLeave={this.toggleLessonPlanTooltip}
        target="_blank"
      >
        <img src="https://assets.quill.org/images/icons/download-lesson-plan-green-icon.svg" />
        {this.renderLessonPlanTooltip()}
      </a>
    </div>);
  }

  urlForReport = () => {
    $.get(`/teachers/progress_reports/report_from_unit_and_activity/u/${this.unitId()}/a/${this.activityId()}`)
      .success(data => window.location = data.url)
      .fail(() => alert('This report is not yet available. Please check back when at least one of your students has completed this activity.'));
  }

  anonymousPath = () => {
    return "https://quill-lms-sprint-docker.herokuapp.com/activity_sessions/anonymous?activity_id=${this.activityId()}";
  }

  calculateAverageScore = () => {
    const averageScore = this.props.data.cumulativeScore / this.props.data.completedCount;
    if (isNaN(averageScore)) {
      return '—';
    } else if (Math.round(averageScore).toString().length === 2) {
      return `${averageScore.toPrecision(2)}%`;
    }
    return `${averageScore}%`;
  }

  finalCell = () => {
    if (this.props.activityReport) {
      return [
        <span className="number-of-students" key="number-of-students">{this.renderPieChart()} {this.props.data.completedCount} of {this.props.numberOfStudentsAssignedToUnit} {Pluralize('student', this.props.numberOfStudentsAssignedToUnit)}</span>,
        <span className="average-score" key="average-score">{this.calculateAverageScore()}</span>,
        <img className="chevron-right" key="chevron-right" src="https://assets.quill.org/images/icons/chevron-dark-green.svg" />
      ];
    } else if (this.props.report) {
      return [<a href={this.anonymousPath()} key="this.props.data.activity.anonymous_path" target="_blank">Preview</a>, <a key={`report-url-${this.classroomUnitId()}`} onClick={this.urlForReport}>View Report</a>];
    } else if (this.isLesson()) {
      return this.lessonFinalCell();
    }
    if (this.props.data.ownedByCurrentUser) {
      const startDate = this.state.startDate;
      return (<span className="due-date-field">
        <DatePicker className="due-date-input" onChange={this.handleChange} placeholderText={startDate ? startDate.format('l') : 'Due Date (Optional)'} selected={startDate} />
        {startDate && this.props.isFirst ? <span className="apply-to-all" onClick={() => this.props.updateAllDueDates(startDate)}>Apply to All</span> : null}
      </span>);
    }
    return this.state.startDate ? <div className="due-date-input">{this.state.startDate.format('l')}</div> : null;
  }

  renderPieChart = () => {
    const rawPercent = this.props.data.completedCount / this.props.numberOfStudentsAssignedToUnit;
    const percent = rawPercent > 100 ? 100 : Math.round(rawPercent * 100) / 100;
    const largeArcFlag = percent > 0.5 ? 1 : 0;
    const pathData = `M 1 0 A 1 1 0 ${largeArcFlag} 1 ${Math.cos(2 * Math.PI * percent)} ${Math.sin(2 * Math.PI * percent)} L 0 0`;
    return (
      <svg className="activity-analysis-pie-chart" viewBox="-1 -1 2 2">
        <path d={pathData} fill="#348fdf" />
      </svg>
    );
  }

  classroomUnitId = () => {
    return this.props.data.cuId || this.props.data.classroom_unit_id;
  }

  uaId = () => {
    return this.props.data.uaId || this.props.data.ua_id;
  }

  unitId = () => {
    return this.props.unitId || this.props.data.unit_id;
  }

  dueDate = () => {
    return this.props.data.due_date || this.props.data.dueDate;
  }

  activityId = () => {
    return this.props.data.activityId || this.props.data.activityUid || this.props.data.activity.uid;
  }

  activityName = () => {
    return this.props.data.name || this.props.data.activity.name;
  }

  classification = () => {
    return this.props.data.activityClassificationId;
  }

  classroomId = () => {
    return this.props.data.classroomId || this.props.data.classroom_id;
  }

  icon = () => {
    const classification = this.classification();
    if (classification) {
      // then we're coming from the index and have an id
      return `icon-${activityFromClassificationId(classification)}-green-no-border`;
    }
    // it is stupid that we are passing this in some of this components use create_activity_sessions
    //  but don't have time to deprecate it right now
    return this.props.data.activity && this.props.data.activity.classification ? this.props.data.activity.classification.green_image_class : '';
  }

  lessonCompletedOrLaunch = () => {
    if (this.props.data.completed === 't') {
      return <a className="report-link" href={`/teachers/progress_reports/report_from_classroom_unit_and_activity/${this.classroomUnitId()}/a/${this.activityId()}`} target="_blank">View Report</a>;
    }
    if (this.props.data.studentCount === 0) {
      return <a id="launch-lesson" onClick={this.noStudentsWarning}>{this.props.data.started ? 'Resume Lesson' : 'Launch Lesson'}</a>;
    }
    if (this.props.data.started) {
      return <a className="resume-lesson" href={"https://quill-lms-sprint-docker.herokuapp.com/teachers/classroom_units/${this.classroomUnitId()}/launch_lesson/${this.activityId()}"}>Resume Lesson</a>;
    }
    return <a href={"https://quill-lms-sprint-docker.herokuapp.com/teachers/classroom_units/${this.classroomUnitId()}/launch_lesson/${this.activityId()}"} id="launch-lesson">Launch Lesson</a>;
  }

  noStudentsWarning = () => {
    if (window.confirm("You have no students in this class. Quill Lessons is a collaborative tool for teachers and students to work together. If you'd like to launch this lesson anyway, click OK below. Otherwise, click Cancel.")) {
      window.location.href = "https://quill-lms-sprint-docker.herokuapp.com/teachers/classroom_units/${this.classroomUnitId()}/launch_lesson/${this.activityId()}";
    }
  }

  isLesson = () => {
    return this.props.lesson || this.classification() === 6;
  }

  deleteRow = () => {
    if (!this.props.report && !(this.isLesson())) {
      const style = !this.props.data.ownedByCurrentUser ? { visibility: 'hidden', } : null;
      return <div className="pull-right" style={style}><img className="delete-classroom-activity h-pointer" onClick={this.hideUnitActivity} src="/images/x.svg" /></div>;
    }
  }

  openModal = () => {
    this.setState({ showModal: true, });
  }

  closeModal = () => {
    this.setState({ showModal: false, });
  }

  renderModal = () => {
    if (this.state.showModal) {
      return (<PreviewOrLaunchModal
        classroomUnitId={this.classroomUnitId()}
        closeModal={this.closeModal}
        completed={this.props.data.completed}
        lessonID={this.activityId()}
      />);
    }
  }

  render = () => {
    let link,
      endRow;
    if (this.props.report) {
      link = <a onClick={this.urlForReport} target="_new">{this.activityName()}</a>;
      endRow = Object.assign({}, styles.reportEndRow, { width: this.props.activityReport ? '350px' : '150px', });
    } else if (this.isLesson()) {
      link = <span onClick={this.openModal}>{this.activityName()}</span>;
      endRow = styles.lessonEndRow;
    } else {
      link = <a href={this.anonymousPath()} target="_new">{this.activityName()}</a>;
      endRow = styles.endRow;
    }
    return (
      <div className="row activity" onClick={this.props.activityReport ? this.urlForReport : null} style={this.props.activityReport ? Object.assign({}, styles.row, { cursor: 'pointer', }) : styles.row}>
        <div className="starting-row">
          <div className="cell">
            <div className={`pull-left icon-wrapper ${this.icon()}`} />
          </div>
          <div className="cell" id="activity-analysis-activity-name">
            {link}
            {this.renderCustomizedEditionsTag()}
            {this.buttonForRecommendations()}
          </div>
        </div>
        {this.renderModal()}
        <div className={this.props.activityReport ? 'cell activity-analysis-row-right' : 'cell'} style={endRow}>
          {this.renderLessonsAction()}
          {this.finalCell()}
          {this.deleteRow()}
        </div>
      </div>
    );
  }
};
