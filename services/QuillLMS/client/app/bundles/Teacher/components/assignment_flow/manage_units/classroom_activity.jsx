import React from 'react';
import moment from 'moment';
import Pluralize from 'pluralize';
import activityFromClassificationId from '../../modules/activity_from_classification_id.js';
import { Tooltip } from '../../../../Shared/index'

import PreviewOrLaunchModal from '../../shared/preview_or_launch_modal';
import { nonRelevantActivityClassificationIds, } from '../../../../../modules/activity_classifications'

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
    maxWidth: '242px',
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
      startDate: this.dueDate() ? moment(this.dueDate()) : null,
      showModal: false,
      showCustomizeTooltip: false,
      showLessonPlanTooltip: false,
      focused: false
    }
  }

  UNSAFE_componentWillReceiveProps = (nextProps) => {
    const { startDate, } = this.state
    const newDueDate = nextProps.data ? nextProps.data.dueDate : null
    const formattedNewDueDate = newDueDate ? moment(newDueDate) : null;
    if (formattedNewDueDate !== startDate) {
      this.setState({ startDate: formattedNewDueDate, });
    }
  }

  activityId = () => {
    const { data, } = this.props
    return data.activityId || data.activityUid || data.activity.uid;
  }

  activityName = () => {
    const { data, } = this.props
    return data.name || data.activity.name;
  }

  anonymousPath = () => {
    return `${process.env.DEFAULT_URL}/activity_sessions/anonymous?activity_id=${this.activityId()}`;
  }

  calculateAverageScore = () => {
    const { data, } = this.props
    const averageScore = data.cumulativeScore / data.completedCount;
    if (isNaN(averageScore)) {
      return '—';
    } else if (nonRelevantActivityClassificationIds.includes(data.activityClassificationId)) {
      return (
        <Tooltip
          tooltipText="This type of activity is not graded."
          tooltipTriggerText="N/A"
        />
      )
    } else if (Math.round(averageScore).toString().length === 2) {
      return `${averageScore.toPrecision(2)}%`;
    }
    return `${averageScore}%`;
  }

  classification = () => {
    const { data, } = this.props
    return data.activityClassificationId;
  }

  classroomId = () => {
    const { data, } = this.props
    return data.classroomId || data.classroom_id;
  }

  classroomUnitId = () => {
    const { data, } = this.props
    return data.cuId || data.classroom_unit_id;
  }

  closeModal = () => {
    this.setState({ showModal: false, });
  }

  deleteRow = () => {
    const { report, data, } = this.props
    if (!report && !(this.isLesson())) {
      const style = !data.ownedByCurrentUser ? { visibility: 'hidden', } : null;
      return <button className="pull-right interactive-wrapper focus-on-light" onClick={this.handleHideUnitActivityClick} style={style} type="button"><img alt="" className="delete-classroom-activity h-pointer" src="/images/x.svg" /></button>;
    }
  }

  dueDate = () => {
    const { data, } = this.props
    return data.due_date || data.dueDate;
  }

  finalCell = () => {
    const { activityReport, data, report, numberOfStudentsAssignedToUnit, isFirst, updateAllDueDates, } = this.props
    const { focused, startDate, } = this.state
    const dropdownIconStyle = focused ? { transform: 'rotate(180deg)', } : null;
    if (activityReport) {
      return [
        <span className="number-of-students" key="number-of-students">{this.renderPieChart()} {data.completedCount} of {numberOfStudentsAssignedToUnit} {Pluralize('student', numberOfStudentsAssignedToUnit)}</span>,
        <span className="average-score" key="average-score">{this.calculateAverageScore()}</span>,
        <img alt="" className="chevron-right" key="chevron-right" src="https://assets.quill.org/images/icons/chevron-dark-green.svg" />
      ];
    } else if (report) {
      /* eslint-disable react/jsx-no-target-blank */
      return [<a href={this.anonymousPath()} key={this.anonymousPath()} rel="noopener noreferrer" target="_blank">Preview</a>, <a key={`report-url-${this.classroomUnitId()}`} onClick={this.handleReportLinkClick}>View Report</a>];
      /* eslint-enable react/jsx-no-target-blank */
    } else if (this.isLesson()) {
      return this.lessonFinalCell();
    }
  }

  handleChange = (date) => {
    const { updateDueDate, } = this.props
    const formattedDate = date ? date : null
    this.setState({ startDate: date, });
    updateDueDate(this.uaId(), formattedDate);
  }

  handleHideUnitActivityClick = () => {
    const { hideUnitActivity } = this.props
    const x = confirm('Are you sure you want to delete this assignment?');
    if (x) {
      hideUnitActivity(this.uaId(), this.unitId());
    }
  }

  handleLaunchLessonWithNoStudents = () => {
    if (window.confirm("You have no students in this class. Quill Lessons is a collaborative tool for teachers and students to work together. If you'd like to launch this lesson anyway, click OK below. Otherwise, click Cancel.")) {
      window.location.href = `${process.env.DEFAULT_URL}/teachers/classroom_units/${this.classroomUnitId()}/launch_lesson/${this.activityId()}`;
    }
  }

  handleLessonActivityNameClick = () => {
    this.setState({ showModal: true, });
  }

  handleMouseActionOnCustomize = () => {
    this.setState(prevState => ({ showCustomizeTooltip: !prevState.showCustomizeTooltip }));
  }

  handleMouseActionOnSupportingInfo = () => {
    this.setState(prevState => ({ showLessonPlanTooltip: !prevState.showLessonPlanTooltip }));
  }

  handleReportLinkClick = () => {
    $.get(`/teachers/progress_reports/report_from_unit_and_activity/u/${this.unitId()}/a/${this.activityId()}`)
      .success(data => window.location = data.url)
      .fail(() => alert('This report is not yet available. Please check back when at least one of your students has completed this activity.'));
  }

  icon = () => {
    const { data, } = this.props
    const classification = this.classification();
    if (classification) {
      // then we're coming from the index and have an id
      return `icon-${activityFromClassificationId(classification)}-green-no-border`;
    }
    // it is stupid that we are passing this in some of this components use create_activity_sessions
    //  but don't have time to deprecate it right now
    return data.activity && data.activity.classification ? data.activity.classification.green_image_class : '';
  }

  isLesson = () => {
    const { lesson, } = this.props
    return lesson || this.classification() === 6;
  }

  lessonCompletedOrLaunch = () => {
    const { data, } = this.props
    if (data.completed) {
      /* eslint-disable react/jsx-no-target-blank */
      return <a className="report-link" href={`/teachers/progress_reports/report_from_classroom_unit_and_activity/${this.classroomUnitId()}/a/${this.activityId()}`} target="_blank">View Report</a>;
      /* eslint-enable react/jsx-no-target-blank */
    }
    if (data.studentCount === 0) {
      return <a id="launch-lesson" onClick={this.handleLaunchLessonWithNoStudents}>{data.started ? 'Resume Lesson' : 'Launch Lesson'}</a>;
    }
    if (data.started) {
      return <a className="resume-lesson" href={`${process.env.DEFAULT_URL}/teachers/classroom_units/${this.classroomUnitId()}/launch_lesson/${this.activityId()}`}>Resume Lesson</a>;
    }
    return <a href={`${process.env.DEFAULT_URL}/teachers/classroom_units/${this.classroomUnitId()}/launch_lesson/${this.activityId()}`} id="launch-lesson">Launch Lesson</a>;
  }

  lessonFinalCell = () => {
    const { data, } = this.props
    /* eslint-disable react/jsx-no-target-blank */
    const supportingInfoLink = (<a
      className="supporting-info"
      href={`/activities/${this.activityId()}/supporting_info`}
      onMouseEnter={this.handleMouseActionOnSupportingInfo}
      onMouseLeave={this.handleMouseActionOnSupportingInfo}
      target="_blank"
    >
      <img alt="" src="https://assets.quill.org/images/icons/download-lesson-plan-green-icon.svg" />
      {this.renderLessonPlanTooltip()}
    </a>)
    /* eslint-enable react/jsx-no-target-blank */
    return (
      <div className="lessons-end-row">
        {this.lessonCompletedOrLaunch()}
        <a
          className="customize-lesson"
          href={`/customize/${data.activityUid}`}
          onMouseEnter={this.handleMouseActionOnCustomize}
          onMouseLeave={this.handleMouseActionOnCustomize}
        >
          <i className="fas fa-icon fa-magic" />
          {this.renderCustomizeTooltip()}
        </a>
        {supportingInfoLink}
      </div>
    );
  }

  uaId = () => {
    const { data, } = this.props
    return data.uaId || data.ua_id;
  }

  unitId = () => {
    const { unitId, data, } = this.props
    return unitId || data.unit_id;
  }

  renderCustomizeTooltip = () => {
    const { showCustomizeTooltip, } = this.state
    if (!showCustomizeTooltip) { return }

    return (
      <div className="customize-tooltip">
        <i className="fas fa-caret-up" />
      Customize
      </div>
    );
  }

  renderCustomizedEditionsTag = () => {
    const { data, } = this.props
    if (!(window.location.pathname.includes('lessons') && data.hasEditions)) { return }
    return <div className="customized-editions-tag">Customized</div>;
  }

  renderLessonPlanTooltip = () => {
    const { showLessonPlanTooltip, } = this.state
    if (!showLessonPlanTooltip) { return }

    return (
      <div className="lesson-plan-tooltip">
        <i className="fas fa-caret-up" />
      Download Lesson Plan
      </div>
    );
  }

  renderLessonsAction = () => {
    const { data, } = this.props
    if (window.location.pathname.includes('lessons')) {
      if (data.completed) {
        return <p className="lesson-completed"><i className="fas fa-icon fa-check-circle" />Lesson Complete</p>;
      } else if (data.started) {
        const href = `/teachers/classroom_units/${this.classroomUnitId()}/mark_lesson_as_completed/${this.activityId()}`;

        return <a className="mark-completed" href={href} target="_blank">Mark As Complete</a>; //eslint-disable-line react/jsx-no-target-blank
      }
    }
  }

  renderModal = () => {
    const { showModal, } = this.state
    const { data, } = this.props
    if (!showModal) { return }
    return (
      <PreviewOrLaunchModal
        classroomUnitId={this.classroomUnitId()}
        closeModal={this.closeModal}
        completed={data.completed}
        lessonID={this.activityId()}
      />
    );
  }

  renderPieChart = () => {
    const { data, numberOfStudentsAssignedToUnit, } = this.props
    const rawPercent = data.completedCount / numberOfStudentsAssignedToUnit;
    const percent = rawPercent > 100 ? 100 : Math.round(rawPercent * 100) / 100;
    const largeArcFlag = percent > 0.5 ? 1 : 0;
    const pathData = `M 1 0 A 1 1 0 ${largeArcFlag} 1 ${Math.cos(2 * Math.PI * percent)} ${Math.sin(2 * Math.PI * percent)} L 0 0`;
    return (
      <svg className="activity-analysis-pie-chart" viewBox="-1 -1 2 2">
        <path d={pathData} fill="#348fdf" />
      </svg>
    );
  }

  render = () => {
    const { activityReport, report, } = this.props
    let link,
      endRow;
    if (report) {
      link = <a onClick={this.handleReportLinkClick} target="_new">{this.activityName()}</a>; // eslint-disable-line react/jsx-no-target-blank
      endRow = Object.assign({}, styles.reportEndRow, { width: activityReport ? '350px' : '150px', });
    } else if (this.isLesson()) {
      link = <span onClick={this.handleLessonActivityNameClick}>{this.activityName()}</span>;
      endRow = styles.lessonEndRow;
    } else {
      link = <a href={this.anonymousPath()} target="_new">{this.activityName()}</a>;  // eslint-disable-line react/jsx-no-target-blank
      endRow = styles.endRow;
    }
    return (
      <div className="row activity" onClick={activityReport ? this.handleReportLinkClick : null} style={activityReport ? Object.assign({}, styles.row, { cursor: 'pointer', }) : styles.row}>
        <div className="starting-row">
          <div className="cell">
            <div className={`pull-left icon-wrapper ${this.icon()}`} />
          </div>
          <div className="cell" id="activity-analysis-activity-name">
            {link}
            {this.renderCustomizedEditionsTag()}
          </div>
        </div>
        {this.renderModal()}
        <div className={activityReport ? 'cell activity-analysis-row-right' : 'cell'} style={endRow}>
          {this.renderLessonsAction()}
          {this.finalCell()}
          {this.deleteRow()}
        </div>
      </div>
    );
  }
};
