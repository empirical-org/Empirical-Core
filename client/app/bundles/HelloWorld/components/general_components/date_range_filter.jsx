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

  setDateFromFilter: function(filter) {
    this.setState({focusedInput: null});
    this.props.selectDates(filter.beginDate, null, filter.title);
  },

  renderFilterOptions: function () {
    return (
      <div className='calendar-prefill-options'>
        {this.props.filterOptions.map(filter => {
          const selected = this.props.dateFilterName === filter.title
          return <DateRangeFilterOption
            key={filter.title}
            title={filter.title}
            onClickFunction={() => { this.setDateFromFilter(filter) }}
            selected={selected}
          />
        }
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
        customInputIcon={<i className="fa fa-icon fa-calendar"/>}
      />
    );
  }
});
