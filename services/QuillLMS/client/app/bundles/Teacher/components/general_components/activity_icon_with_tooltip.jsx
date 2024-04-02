import _ from 'lodash';
import React from 'react';

import { nonRelevantActivityClassificationIds, } from '../../../../modules/activity_classifications';
import { requestGet, } from '../../../../modules/request/index';
import { closedLockIcon, scheduledIcon, } from '../../../Shared/index';
import ScorebookTooltip from './tooltip/scorebook_tooltip';
import gradeColor from '../modules/grade_color.js';

function skillDescription(grade) {
  if (grade == null) {
    return 'did not complete the activity';
  } else if (grade < 0.32) {
    return 'rarely demonstrated the activity\'s skill';
  } else if (grade < 0.83) {
    return 'sometimes demonstrated the activity\'s skill';
  } else if (grade <= 1.0) {
    return 'frequently demonstrated the activity\'s skill';
  }
  return 'did not complete the activity';
};

function activityFromClassificationId(classificationId) {
  const intClassificationId = parseInt(classificationId);
  if (intClassificationId === 1) {
    return 'proofreader';
  } else if (intClassificationId === 2) {
    return 'grammar';
  } else if (intClassificationId === 4) {
    return 'diagnostic';
  } else if (intClassificationId === 5) {
    return 'connect';
  } else if (intClassificationId === 6) {
    return 'lessons';
  } else if (intClassificationId === 9) {
    return 'evidence';
  }
};

function activityIconDescription(classificationId) {
  const intClassificationId = parseInt(classificationId);
  if (intClassificationId === 1) {
    return 'Flag representing Quill Proofreader';
  } else if (intClassificationId === 2) {
    return 'Puzzle piece representing Quill Grammar';
  } else if (intClassificationId === 4) {
    return 'Magnifying glass representing Quill Diagnostic';
  } else if (intClassificationId === 5) {
    return 'Bullseye representing Quill Connect';
  } else if (intClassificationId === 6) {
    return 'Apple representing Quill Lessons ';
  } else if (intClassificationId === 9) {
    return 'Book to represent Quill Reading for Evidence';
  }
};

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
    requestGet(
      `${process.env.DEFAULT_URL}/grades/tooltip/classroom_unit_id/${this.props.data.cuId}/user_id/${this.props.data.userId}/activity_id/${this.activityId()}/completed/${!!this.props.data.completed_attempts}`,
      (body) => {
        that.loadTooltipTitle(body);
      }
    );
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

  altText() {
    const { data, context, } = this.props

    if (data.completed_attempts > 0 || data.percentage) {
      if (context === 'scorebook' && nonRelevantActivityClassificationIds.includes(Number(data.activity_classification_id))) {
        return `${activityIconDescription(data.activity_classification_id)} in dark blue to indicate that the student completed the activity.`
      } else {
        return `${activityIconDescription(data.activity_classification_id)} in ${gradeColor(parseFloat(data.percentage))} to indicate that the student ${skillDescription(parseFloat(data.percentage))}`
      }
    } else {
      if (data.started) {
        return `${activityIconDescription(data.activity_classification_id)} in light blue to indicate that the student started the activity.`
      } else {
        return `${activityIconDescription(data.activity_classification_id)} in gray to indicate that the student has not yet started the activity.`
      }
    }

    return `${activityIconDescription(data.activity_classification_id)} in ${gradeColor(parseFloat(data.percentage))} to indicate that the student`
  }

  imageName() {
    if (this.props.data.completed_attempts > 0 || this.props.data.percentage) {
      if (this.props.context === 'scorebook' && nonRelevantActivityClassificationIds.includes(Number(this.props.data.activity_classification_id))) {
        return  `${activityFromClassificationId(this.getActClassId())}-dark-blue`
      } else {
        return `${activityFromClassificationId(this.getActClassId())}-${gradeColor(parseFloat(this.props.data.percentage))}`
      }
    } else {
      if (this.props.data.started) {
        return `${activityFromClassificationId(this.getActClassId())}-light-blue`
      } else {
        return `${activityFromClassificationId(this.getActClassId())}-grey`
      }
    }
  }

  loadTooltipTitle(crData) {
    let data;
    data = _.merge(this.props.data, { premium_state: this.props.premium_state, });
    data.sessions = crData.sessions
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
    const { started, completed_attempts, scheduled, locked, } = data
    if (locked) {
      return <img alt="" className="locked-symbol" src={closedLockIcon.src} />
    } else if (scheduled && completed_attempts < 1) {
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
    return `activate-tooltip icon-link icon-wrapper`;
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
        <img alt={this.altText()} src={`${process.env.CDN_URL}/images/pages/activity_summary/${this.imageName()}.svg`} />
        {this.missedIndicator()}
        {this.statusIndicator()}
        {toolTip}
      </div>
    );
  }
}
