'use strict'

import React from 'react'
import $ from 'jquery'
import _ from 'underscore'

import DatePicker from 'react-datepicker';
import moment from 'moment';

export default React.createClass({

    getInitialState: function() {
      // moment comes from momentJS library
        return {startDate: null};
    },


    handleChange: function(date) {
        this.setState({startDate: date});
        // months and days are an array that start at index 0;
        var formattedDate = date.year() + '-' + (date.month() + 1) + '-' + (date.date() + 1);
        this.props.assignActivityDueDate(this.props.activity, formattedDate);
    },

    tooltipTrigger: function(e) {
        e.stopPropagation();
        this.refs.activateTooltip.getDOMNode().tooltip('show');

    },
    tooltipTriggerStop: function(e) {
        e.stopPropagation();
        this.refs.activateTooltip.getDOMNode().tooltip('hide');
    },


    removeActivity: function() {
        this.props.toggleActivitySelection(this.props.activity, false);
        this.initializeDatePicker();
    },

      render: function() {
        return (
          <tr>
            <td>
              <div ref='activateTooltip' className={'activate-tooltip ' + this.props.activity.classification.image_class } data-html='true' data-toggle='tooltip' data-placement='top' title={"<h1>" + this.props.activity.name + "</h1><p>App: " + this.props.activity.classification.alias + "</p><p>" + this.props.activity.topic.name +  "</p><p>" + this.props.activity.description + "</p>"}></div>
            </td>
            <td onMouseEnter={this.tooltipTrigger} onMouseLeave={this.tooltipTriggerStop} className='tooltip-trigger activity_name'>{this.props.activity.name}</td>
            <td>
              <DatePicker selected={this.state.startDate}  minDate={moment()} onChange={this.handleChange}   placeholderText='Optional'/>
            </td>
            <td className="icon-x-gray" onClick={this.removeActivity}></td>
          </tr>
        );
      }
    });
