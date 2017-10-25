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
    return {};
  },

  setDateFromFilter: function(beginDate) {
    this.setState({focusedInput: null});
    this.props.selectDates(beginDate, moment().add(1, 'days'));
  },

  renderFilterOptions: function () {
    return (
      <div className='calendar-prefill-options'>
        {this.props.filterOptions.map(filter =>
          <DateRangeFilterOption
            key={filter.title}
            title={filter.title}
            onClickFunction={() => { this.setDateFromFilter(filter.beginDate) }}
          />
        )}
      </div>
    );
  },

  render: function() {
    return (
      <DateRangePicker
        startDate={this.props.beginDate}
        endDate={this.props.endDate}
        onDatesChange={({ startDate, endDate }) => this.props.selectDates(startDate, endDate)}
        focusedInput={this.state.focusedInput}
        onFocusChange={focusedInput => this.setState({ focusedInput })}
        numberOfMonths={1}
        isOutsideRange={day => {return false}}
        renderCalendarInfo={this.renderFilterOptions}
        daySize={30}
        navPrev={'‹'}
        navNext={'›'}
      />
    );
  }
});
