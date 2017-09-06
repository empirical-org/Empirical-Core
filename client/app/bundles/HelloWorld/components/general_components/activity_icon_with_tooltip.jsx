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
    premiumState: React.PropTypes.string,
    placement: React.PropTypes.string, // not required
    dontShowToolTip: React.PropTypes.bool, // TODO: remove this and make the tooltip show via ajax
  },

  getInitialState() {
    return { loading: true, };
  },

  getConceptResultInfo() {
    const that = this;
    request.get({
      url: `${process.env.DEFAULT_URL}/activity_sessions/${this.props.data.id}/concept_results`,
    }, (error, httpStatus, body) => {
      const conceptResults = JSON.parse(body);
      that.setState({ loaded: true, }, () => that.loadTooltipTitle(conceptResults));
    });
  },

  loadTooltipTitle(conceptResults) {
    let data;
    if (this.props.context == 'scorebook') {
      data = _.merge(this.props.data, { premium_state: this.props.premium_state, });
    } else {
      data = this.props.data;
    }
    data.concept_results = conceptResults;
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

  tooltipClasses() {
    return `activate-tooltip icon-link icon-wrapper icon-${gradeColor(parseFloat(this.props.data.percentage))} icon-${activityFromClassificationId(this.getActClassId())}`;
  },

  goToReport() {
    $.get(`/teachers/progress_reports/report_from_activity_session/${this.props.data.id}`)
      .success((data) => {
        window.location = data.url;
      })
      .fail(() => alert('This report is not available.'));
  },

  checkForStudentReport() {
    if (this.props.data.state === 'finished') {
      this.goToReport();
    } else {
      alert('This activity has not been completed, so there is no report yet.');
    }
  },

  hideTooltip() {
    this.setState({ showToolTip: false, });
  },

  render() {
    const cursorType = this.props.context === 'scorebook' ? 'pointer' : 'default';
    let toolTip = null;
    if (this.state.showToolTip && this.state.toolTipHTML) {
      // TODO: this is here because the old way inserted the html into a jquery tooltip
      // as we no longer do this, rather than dangerously inserting html, we should simply
      // render it as a component
      toolTip = <div style={{ position: 'absolute', zIndex: 1000, }} dangerouslySetInnerHTML={{ __html: this.state.toolTipHTML, }} />;
    }
    return (
      <div
        style={{ cursor: cursorType, }}
        onClick={this.props.context === 'scorebook' ? this.checkForStudentReport : null}
        onMouseEnter={this.props.context === 'scorebook' ? this.showToolTipAndGetConceptResultInfo : null}
        onMouseLeave={this.props.context === 'scorebook' ? this.hideTooltip : null}
        className={this.tooltipClasses()}
      >
        {toolTip}
      </div>
    );
  },
});
