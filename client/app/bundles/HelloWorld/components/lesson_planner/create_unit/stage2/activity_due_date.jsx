import React from 'react';
import $ from 'jquery';
import _ from 'underscore';

import DatePicker from 'react-datepicker';
import moment from 'moment';

export default React.createClass({

  getInitialState() {
      // moment comes from momentJS library
    return { startDate: null, };
  },

  handleChange(date) {
    this.setState({ startDate: date, });
        // months and days are an array that start at index 0;
    const formattedDate = `${date.year()}-${date.month() + 1}-${date.date() + 1}`;
    this.props.assignActivityDueDate(this.props.activity, formattedDate);
  },

  tooltipTrigger(e) {
    e.stopPropagation();
    this.refs.activateTooltip.getDOMNode().tooltip('show');
  },

  tooltipTriggerStop(e) {
    e.stopPropagation();
    this.refs.activateTooltip.getDOMNode().tooltip('hide');
  },

  removeActivity() {
    this.props.toggleActivitySelection(this.props.activity, false);
    this.initializeDatePicker();
  },

  render() {
    return (
      <tr>
        <td style={{paddingLeft: '45px'}} className={this.props.activity.activity_classification ? `icon-${this.props.activity.activity_classification.id}-green-no-border` : ''}>
          <div ref="activateTooltip" className='activate-tooltip' data-html="true" data-toggle="tooltip" data-placement="top" title={`<h1>${this.props.activity.name}</h1><p>App: ${this.props.activity.activity_classification.alias}</p><p>${this.props.activity.section.name}</p><p>${this.props.activity.description}</p>`} />
        </td>
        <td onMouseEnter={this.tooltipTrigger} onMouseLeave={this.tooltipTriggerStop} className="tooltip-trigger activity_name">{this.props.activity.name}</td>
        <td>
          <DatePicker selected={this.state.startDate} minDate={moment()} onChange={this.handleChange} placeholderText="Optional" />
        </td>
        <td style={{paddingRight: '20px'}} onClick={this.removeActivity}><img src="/images/x.svg"/></td>
      </tr>
    );
  },
});
