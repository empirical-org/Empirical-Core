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

  componentWillMount: function() {
    if (this.props.dateFilterName) {
      const filter = this.props.filterOptions.find(filter => filter.title === this.props.dateFilterName)
      this.setDateFromFilter(filter)
    }
  },

  componentWillReceiveProps: function(nextProps) {
    if (this.props.dateFilterName !== nextProps.dateFilterName) {
      const filter = nextProps.filterOptions.find(filter => filter.title === nextProps.dateFilterName)
      this.setDateFromFilter(filter)
    }
  },

  setDateFromFilter: function(filter) {
    this.setState({focusedInput: null});
    this.props.selectDates(filter.beginDate, moment(), filter.title);
  },

  renderFilterOptions: function () {
    return (
      <div className='calendar-prefill-options'>
        {this.props.filterOptions.map(filter =>
          <DateRangeFilterOption
            key={filter.title}
            title={filter.title}
            onClickFunction={() => { this.setDateFromFilter(filter) }}
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
        onDatesChange={({ startDate, endDate }) => this.props.selectDates(startDate, endDate, null)}
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
