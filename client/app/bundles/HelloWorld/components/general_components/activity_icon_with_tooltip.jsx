'use strict';
import _ from 'lodash'
import React from 'react'
import TooltipTitleGeneratorGenerator from '../modules/componentGenerators/tooltip_title/tooltip_title_generator_generator'
import $ from 'jquery'

export default React.createClass({
  propTypes: {
    data: React.PropTypes.object.isRequired,
    context: React.PropTypes.string.isRequired, // studentProfile, scorebook
    premiumState: React.PropTypes.string,
    placement: React.PropTypes.string // not required
  },

  getDefaultProps: function () {
    return {
      context: 'scorebook',
      placement: 'bottom'
    }
  },

  percentage_color: function () {
    var y;
    var x = this.props.data.percentage;
    if (x == null) {
      y = 'gray'
    } else if (x < 0.5) {
      y = 'red';
    } else if (x <= 0.75) {
      y = 'orange';
    } else if (x <= 1.0) {
      y = 'green';
    } else {
      y = 'gray';
    }
    return y;
  },

  loadTooltipTitle: function () {
    var data;
    if (this.props.context == 'scorebook') {
      data = _.merge(this.props.data, {premium_state: this.props.premium_state})
    } else {
      data = this.props.data;
    }
    this.modules = {
      titleGenerator: new TooltipTitleGeneratorGenerator(this.props.context).generate(data)
    }
    $(this.refs.activateTooltip).tooltip({
      html: true,
      placement: this.props.placement,
      title: this.modules.titleGenerator.generate(this.props.data)
    });
  },

  icon_for_classification: function () {
      var y;
      var x = this.props.data.activity.classification.id;
      if (x === 1) {
        y = 'flag';
      } else if (x === 2) {
        y = 'puzzle'
      } else if (x === 4) {
        y = 'diagnostic'
      } else if (x === 5) {
        y = 'connect';
      }
      return y;
  },

  tooltipClasses: function () {
    return 'activate-tooltip icon-link icon-wrapper icon-' + this.percentage_color() + ' icon-' + this.icon_for_classification();
  },

  goToReport: function() {
    $.get(`/teachers/progress_reports/report_from_activity_session/${this.props.data.id}`)
      .success(data => {
        window.location = data.url;
      })
      .fail(() => alert('This report is not available.'))
  },



  checkForStudentReport: function() {
    if (this.props.data.state === 'finished') {
      this.goToReport();
    } else {
      alert('This activity has not been completed, so there is no report yet.')
    }
  },

  render: function () {
    return (
      <div
        onClick={this.props.context === 'scorebook' ? this.checkForStudentReport : null}
        onMouseEnter={this.loadTooltipTitle}
        ref='activateTooltip'
        className={this.tooltipClasses()}>
      </div>
    );
  }
});
