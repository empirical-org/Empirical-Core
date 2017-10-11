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
      beginDate: this.props.beginDate || null,
      endDate: this.props.endDate || null
    });
  },

  selectDates: function () {
    this.props.selectDates(this.state.beginDate, this.state.endDate);
  },

  setDateFromFilter: function(beginDate) {
    this.setState({beginDate: beginDate, endDate: moment(), focusedInput: null}, this.selectDates);
  },

  renderFilterOptions: function () {
    return (
      <div className='calendar-prefill-options'>
        {this.props.filterOptions.map(filter => <DateRangeFilterOption
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
