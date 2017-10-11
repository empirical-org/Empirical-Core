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

  renderFilterOptions: function () {
    return (
      <div className='calendar-prefill-options'>
        <DateRangeFilterOption
          title={'Hi I am the title'}
          onClickFunction={() => {alert('yoooo')}}
        />
        <DateRangeFilterOption
          title={'wow another title'}
          onClickFunction={() => {alert('heeeeey')}}
        />
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
