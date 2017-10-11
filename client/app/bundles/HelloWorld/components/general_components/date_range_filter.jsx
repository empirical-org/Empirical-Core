'use strict';
import React from 'react';
import moment from 'moment';
import { DateRangePicker } from 'react-dates';
import DateRangeFilterOption from './date_range_filter_option.jsx'

export default React.createClass({
  propTypes: {
    selectDates: React.PropTypes.func.isRequired
  },

  getInitialState: function () {
    return ({
      beginDate: null,
      endDate: null
    });
  },

  setBeginDate: function (date) {
    this.setState({beginDate: date}, this.selectDates);
  },

  setEndDate: function (date) {
    this.setState({endDate: date}, this.selectDates);
  },

  selectDates: function () {
    this.props.selectDates(this.state.beginDate, this.state.endDate);
  },

  FILTER_OPTIONS: [
    {
      title: 'Today',
      beginDate: moment()
    },
    {
      title: 'This Week',
      beginDate: moment().startOf('week')
    },
    {
      title: 'This Month',
      beginDate: moment().startOf('month')
    },
    {
      title: 'Last 7 days',
      beginDate: moment().subtract(7, 'days')
    },
    {
      title: 'Last 30 days',
      beginDate: moment().subtract(1, 'months')
    },
    {
      title: 'All Time',
      beginDate: null
    },
  ],

  setDateFromFilter: function(beginDate) {
    this.setState({beginDate: beginDate, endDate: moment(), focusedInput: null}, this.selectDates);
  },

  renderFilterOptions: function () {
    return (
      <div className='calendar-prefill-options'>
        {this.FILTER_OPTIONS.map(filter => <DateRangeFilterOption
          key={filter.title}
          title={filter.title}
          onClickFunction={() => { this.setDateFromFilter(filter.beginDate) }}
        />)}
      </div>

    )
  },

  render: function() {
    return (
      <DateRangePicker
        startDate={this.state.beginDate}
        endDate={this.state.endDate}
        onDatesChange={({ startDate, endDate }) => this.setState({ beginDate: startDate, endDate }, this.selectDates)}
        focusedInput={this.state.focusedInput}
        onFocusChange={focusedInput => this.setState({ focusedInput })}
        numberOfMonths={1}
        isOutsideRange={day => {return false}}
        renderCalendarInfo={this.renderFilterOptions}
        daySize={40}
      />
    );
  }
});
