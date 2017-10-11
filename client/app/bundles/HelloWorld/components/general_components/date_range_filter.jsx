'use strict';
import React from 'react';
import moment from 'moment';
import { DateRangePicker } from 'react-dates';

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

  selectBeginDate: function (date) {
    this.setState({beginDate: date}, this.selectDates);
  },

  selectEndDate: function (date) {
    this.setState({endDate: date}, this.selectDates);
  },

  selectDates: function () {
    this.props.selectDates(this.state.beginDate, this.state.endDate);
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
        renderCalendarInfo={() => { return 'TODO'}}
        daySize={40}
      />
    );
  }
});
