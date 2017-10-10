import _ from 'lodash';
import React from 'react';
import TooltipTitleGeneratorGenerator from '../modules/componentGenerators/tooltip_title/tooltip_title_generator_generator';
import $ from 'jquery';
import request from 'request';
import gradeColor from '../modules/grade_color.js';
import activityFromClassificationId from '../modules/activity_from_classification_id.js';

export default React.createClass({
  propTypes: {
    data: React.PropTypes.object.isRequired,
    context: React.PropTypes.string.isRequired, // studentProfile, scorebook
    premium_state: React.PropTypes.string,
    placement: React.PropTypes.string, // not required
    dontShowToolTip: React.PropTypes.bool, // TODO: remove this and make the tooltip show via ajax
  },

  getInitialState() {
    return { loading: true, };
  },

  getConceptResultInfo() {
    const that = this;
    request.get({
      url: `${process.env.DEFAULT_URL}/grades/tooltip/classroom_activity_id/${this.props.data.caId}/user_id/${this.props.data.userId}/completed/${!!this.props.data.percentage}`,
    }, (error, httpStatus, body) => {
      const parsedBody = JSON.parse(body);
      parsedBody.forEach(el => el.metadata = JSON.parse(el.metadata));
      that.setState({ loaded: true, }, () => that.loadTooltipTitle(parsedBody));
    });
  },

  loadTooltipTitle(crData) {
    let data;
    data = _.merge(this.props.data, { premium_state: this.props.premium_state, });
    data.concept_results = crData;
    this.showLoadedToolTip(data);
  },

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
  },

  showToolTipAndGetConceptResultInfo() {
    this.showToolTip();
    this.getConceptResultInfo();
  },

  showToolTip(data = this.props.data) {
    const titleGenerator = new TooltipTitleGeneratorGenerator(this.props.context).generate(data);
    this.setState({ toolTipHTML: titleGenerator.generate(data), showToolTip: true, });
  },

  showLoadedToolTip(data = this.props.data) {
    const titleGenerator = new TooltipTitleGeneratorGenerator(this.props.context).generate(data);
    this.setState({ toolTipHTML: titleGenerator.generate(data), });
  },

  iconClass() {
    if (this.props.data.completedAttempts > 0) {
      if (Number(this.props.data.activity_classification_id) === 4 || Number(this.props.data.activity_classification_id) === 6 ) {
        return  `icon-blue icon-${activityFromClassificationId(this.getActClassId())}`
      } else {
        return `icon-${gradeColor(parseFloat(this.props.data.percentage))} icon-${activityFromClassificationId(this.getActClassId())}`
      }
    } else {
      if (this.props.data.started) {
        return `icon-progress icon-${activityFromClassificationId(this.getActClassId())}-embossed`
      } else {
        return `icon-unstarted icon-${activityFromClassificationId(this.getActClassId())}-embossed`
      }
    }
  },

  tooltipClasses() {
    return `activate-tooltip icon-link icon-wrapper ${this.iconClass()}`;
  },

  goToReport() {
    $.get(`/teachers/progress_reports/report_from_classroom_activity_and_user/ca/${this.props.data.caId}/user/${this.props.data.userId}`)
      .success((data) => {
        window.location = data.url;
      })
      .fail(() => alert('This report is not available.'));
  },

  checkForStudentReport() {
    if (this.props.data.percentage) {
      this.goToReport();
    } else {
      alert('This activity has not been completed, so there is no report yet.');
    }
  },

  hideTooltip() {
    this.setState({ showToolTip: false, });
  },

  statusIndicator() {
    const {started, completedAttempts} = this.props.data
    if (started) {
      return <img className="in-progress-symbol" src="http://assets.quill.org/images/scorebook/blue-circle-sliced.svg"/>
    } else if (completedAttempts > 1) {
      const completedNumber = completedAttempts > 9 ? '+' : completedAttempts
      return <span>
        <img className="attempt-symbol" src="http://assets.quill.org/images/scorebook/blue-circle-solid.svg"/>
        <span className="attempt-count">{completedNumber}</span>
      </span>
    }
  },

  render() {
    const cursorType = this.props.context === 'scorebook' ? 'pointer' : 'default';
    let toolTip = null;
    if (this.state.showToolTip && this.state.toolTipHTML) {
      // TODO: this is here because the old way inserted the html into a jquery tooltip
      // as we no longer do this, rather than dangerously inserting html, we should simply
      // render it as a component
      toolTip = <div style={{ position: 'absolute', zIndex: 1000, top: '50px', }} dangerouslySetInnerHTML={{ __html: this.state.toolTipHTML, }} />;
    }
    return (
      <div
        style={{ cursor: cursorType, position: 'relative', }}
        onClick={this.props.context === 'scorebook' ? this.checkForStudentReport : null}
        onMouseEnter={this.props.context === 'scorebook' ? this.showToolTipAndGetConceptResultInfo : null}
        onMouseLeave={this.props.context === 'scorebook' ? this.hideTooltip : null}
        className={this.tooltipClasses()}
      >
        {this.statusIndicator()}
        {toolTip}
      </div>
    );
  },
});
