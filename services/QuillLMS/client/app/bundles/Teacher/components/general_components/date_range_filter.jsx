import React from 'react';
import moment from 'moment';
import "react-dates/initialize";

import { DateRangePicker } from 'react-dates';
import DateRangeFilterOption from './date_range_filter_option.jsx'

export default class  DateRangeFilter extends React.Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  setDateFromFilter = (filter) => {
    this.setState({focusedInput: null});
    this.props.selectDates(filter.beginDate, null, filter.title);
  };

  renderFilterOptions = () => {
    return (
      <div className='calendar-prefill-options'>
        {this.props.filterOptions.map(filter => {
          const selected = this.props.dateFilterName === filter.title
          return (
            <DateRangeFilterOption
              key={filter.title}
              onClickFunction={() => { this.setDateFromFilter(filter) }}
              selected={selected}
              title={filter.title}
            />
          )
        }
        )}
      </div>
    );
  };

  render() {
    return (
      <DateRangePicker
        customInputIcon={<i className="fas fa-icon fa-calendar" />}
        daySize={30}
        endDate={this.props.endDate}
        focusedInput={this.state.focusedInput}
        isOutsideRange={day => {return false}}
        navNext="›"
        navPrev="‹"
        numberOfMonths={1}
        onDatesChange={({ startDate, endDate }) => this.props.selectDates(startDate, endDate, null)}
        onFocusChange={focusedInput => this.setState({ focusedInput })}
        renderCalendarInfo={this.renderFilterOptions}
        startDate={this.props.beginDate}
      />
    );
  }
}
