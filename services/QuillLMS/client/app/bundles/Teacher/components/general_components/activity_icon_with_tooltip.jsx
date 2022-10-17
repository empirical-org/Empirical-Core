import _ from 'lodash';
import React from 'react';
import ScorebookTooltip from '../modules/componentGenerators/tooltip_title/scorebook_tooltip_title';
import $ from 'jquery';
import request from 'request';
import gradeColor from '../modules/grade_color.js';
import { nonRelevantActivityClassificationIds, } from '../../../../modules/activity_classifications'
import activityFromClassificationId from '../modules/activity_from_classification_id.js';
import { scheduledIcon, } from '../../../Shared/index'

export default class ActivityIconWithTooltip extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      showTooltip: false
    }
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

  getConceptResultInfo() {
    const that = this;
    request.get({
      url: `${process.env.DEFAULT_URL}/grades/tooltip/classroom_unit_id/${this.props.data.cuId}/user_id/${this.props.data.userId}/activity_id/${this.activityId()}/completed/${!!this.props.data.completed_attempts}`,
    }, (error, httpStatus, body) => {
      const parsedBody = JSON.parse(body);
      that.loadTooltipTitle(parsedBody);
    });
  }

  activityId = () => {
    const d = this.props.data;
    return d.activityId
  };



  checkForStudentReport = () => {
    if (this.props.data.completed_attempts) {
      this.goToReport();
    } else {
      alert('This activity has not been completed, so there is no report yet.');
    }
  };

  goToReport() {
    window.location = `/teachers/progress_reports/report_from_classroom_unit_and_activity_and_user/cu/${this.props.data.cuId}/user/${this.props.data.userId}/a/${this.activityId()}`
  }

  hideTooltip = () => {
    this.setState({ showToolTip: false, });
  };

  iconClass() {
    if (this.props.data.completed_attempts > 0 || this.props.data.percentage) {
      if (this.props.context === 'scorebook' && nonRelevantActivityClassificationIds.includes(Number(this.props.data.activity_classification_id))) {
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

  loadTooltipTitle(crData) {
    let data;
    data = _.merge(this.props.data, { premium_state: this.props.premium_state, });
    data.concept_results = crData.concept_results
    data.scores = crData.scores;
    setTimeout(() => {this.setState({tooltipData: data})}, 200);
  }

  missedIndicator() {
    const {marked_complete, completed_attempts} = this.props.data
    if (marked_complete && completed_attempts === 0) {
      return <img alt="" className="missed-indicator" src={`${process.env.CDN_URL}/images/scorebook/missed-lessons-cross.svg`} />
    }
  }

  showToolTip() {
    this.setState({ showToolTip: true, });
  }

  showToolTipAndGetConceptResultInfo = () => {
    this.showToolTip();
    if (!this.state.tooltipData) {
      this.getConceptResultInfo();
    }
  };

  statusIndicator() {
    const { data, } = this.props
    const { started, completed_attempts, scheduled, } = data
    if (scheduled && completed_attempts < 1) {
      return <img alt="" className="scheduled-symbol" src={scheduledIcon.src} />
    } else if (started) {
      return <img alt="" className="in-progress-symbol" src="https://assets.quill.org/images/scorebook/blue-circle-sliced.svg" />
    } else if (completed_attempts > 1) {
      const completedNumber = completed_attempts > 9 ? '+' : completed_attempts
      return (
        <span>
          <img alt="" className="attempt-symbol" src="https://assets.quill.org/images/scorebook/blue-circle-solid.svg" />
          <span className="attempt-count">{completedNumber}</span>
        </span>
      )
    }
  }

  tooltipClasses() {
    return `activate-tooltip icon-link icon-wrapper ${this.iconClass()}`;
  }



  render(){
    const cursorType = this.props.context === 'scorebook' ? 'pointer' : 'default';
    let toolTip = null;
    if (this.state.showToolTip) {
      toolTip = <ScorebookTooltip data={this.state.tooltipData ? this.state.tooltipData : this.props.data} />;
    }
    return (
      <div
        className={this.tooltipClasses()}
        onClick={this.props.context === 'scorebook' ? this.checkForStudentReport : null}
        onMouseEnter={this.props.context === 'scorebook' ? this.showToolTipAndGetConceptResultInfo : null}
        onMouseLeave={this.props.context === 'scorebook' ? this.hideTooltip : null}
        style={{ cursor: cursorType, position: 'relative', }}
      >
        {this.missedIndicator()}
        {this.statusIndicator()}
        {toolTip}
      </div>
    );
  }
}
