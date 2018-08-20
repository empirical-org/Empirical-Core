import _ from 'lodash';
import React from 'react';
import ScorebookTooltip from '../modules/componentGenerators/tooltip_title/scorebook_tooltip_title';
import $ from 'jquery';
import request from 'request';
import gradeColor from '../modules/grade_color.js';
import activityFromClassificationId from '../modules/activity_from_classification_id.js';

export default class ActivityIconWithTooltip extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      showTooltip: false
    }

    this.checkForStudentReport = this.checkForStudentReport.bind(this)
    this.showToolTipAndGetConceptResultInfo = this.showToolTipAndGetConceptResultInfo.bind(this)
    this.hideTooltip = this.hideTooltip.bind(this)
    this.activityId = this.activityId.bind(this)
  }

  getConceptResultInfo() {
    const that = this;
    request.get({
      url: `${process.env.DEFAULT_URL}/grades/tooltip/classroom_unit_id/${this.props.data.cuId}/user_id/${this.props.data.userId}/activity_id/${this.activityId()}/completed/${!!this.props.data.percentage}`,
    }, (error, httpStatus, body) => {
      const parsedBody = JSON.parse(body);
      that.loadTooltipTitle(parsedBody);
    });
  }

  goToReport() {
      window.location = `/teachers/progress_reports/report_from_classroom_unit_activity_and_user/cu/${this.props.data.cuId}/user/${this.props.data.userId}/a/${this.activityId()}`
  }

  loadTooltipTitle(crData) {
    let data;
    data = _.merge(this.props.data, { premium_state: this.props.premium_state, });
    data.concept_results = crData.concept_results.map(cr => {
      if (cr.metadata) {
        cr.metadata = JSON.parse(cr.metadata)
      }
      return cr
    })
    data.scores = crData.scores;
    setTimeout(() => {this.setState({tooltipData: data})}, 200);
  }

  getActClassId() {
    const d = this.props.data;
    if (d.activity_classification_id) {
      return d.activity_classification_id;
    } else if (d.classification && d.classification.id) {
      return d.classification.id;
    } else if (d.activity && d.activity.classification && d.activity.classification.id) {
      return d.activity.classification.id;
    }
    return null;
  }

  activityId() {
    const d = this.props.data;
    return d.activityId
  }

  showToolTipAndGetConceptResultInfo() {
    this.showToolTip();
    if (!this.state.tooltipData) {
      this.getConceptResultInfo();
    }
  }

  showToolTip() {
    this.setState({ showToolTip: true, });
  }

  iconClass() {
    if (this.props.data.completed_attempts > 0 || this.props.data.percentage) {
      if (this.props.context === 'scorebook' && (Number(this.props.data.activity_classification_id) === 4 || Number(this.props.data.activity_classification_id) === 6)) {
        return  `icon-blue icon-${activityFromClassificationId(this.getActClassId())}`
      } else {
        return `icon-${gradeColor(parseFloat(this.props.data.percentage))} icon-${activityFromClassificationId(this.getActClassId())}`
      }
    } else {
      if (this.props.data.started) {
        return `icon-progress icon-${activityFromClassificationId(this.getActClassId())}-lightgray`
      } else {
        return `icon-unstarted icon-${activityFromClassificationId(this.getActClassId())}-lightgray`
      }
    }
  }

  tooltipClasses() {
    return `activate-tooltip icon-link icon-wrapper ${this.iconClass()}`;
  }



  checkForStudentReport() {
    if (this.props.data.percentage) {
      this.goToReport();
    } else {
      alert('This activity has not been completed, so there is no report yet.');
    }
  }

  hideTooltip() {
    this.setState({ showToolTip: false, });
  }

  statusIndicator() {
    const {started, completed_attempts} = this.props.data
    if (started) {
      return <img className="in-progress-symbol" src="http://assets.quill.org/images/scorebook/blue-circle-sliced.svg"/>
    } else if (completed_attempts > 1) {
      const completedNumber = completed_attempts > 9 ? '+' : completed_attempts
      return <span>
        <img className="attempt-symbol" src="http://assets.quill.org/images/scorebook/blue-circle-solid.svg"/>
        <span className="attempt-count">{completedNumber}</span>
      </span>
    }
  }

  missedIndicator() {
    const {marked_complete, completed_attempts} = this.props.data
    if (marked_complete === 't' && completed_attempts === 0) {
      return <img className="missed-indicator" src={`${process.env.CDN_URL}/images/scorebook/missed-lessons-cross.svg`}/>
    }
  }

  render(){
    const cursorType = this.props.context === 'scorebook' ? 'pointer' : 'default';
    let toolTip = null;
    if (this.state.showToolTip) {
      toolTip = <ScorebookTooltip data={this.state.tooltipData ? this.state.tooltipData : this.props.data} />;
    }
    return (
      <div
        style={{ cursor: cursorType, position: 'relative', }}
        onClick={this.props.context === 'scorebook' ? this.checkForStudentReport : null}
        onMouseEnter={this.props.context === 'scorebook' ? this.showToolTipAndGetConceptResultInfo : null}
        onMouseLeave={this.props.context === 'scorebook' ? this.hideTooltip : null}
        className={this.tooltipClasses()}
      >
        {this.missedIndicator()}
        {this.statusIndicator()}
        {toolTip}
      </div>
    );
  }
}
