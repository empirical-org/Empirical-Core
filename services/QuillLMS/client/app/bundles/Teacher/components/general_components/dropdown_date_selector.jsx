'use strict';
import PropTypes from 'prop-types';
import React from 'react'
import _ from 'underscore'

export default class extends React.Component {
  static propTypes = {
    date: PropTypes.string.isRequired,
    updateDate: PropTypes.func.isRequired
  };

  getDateParts = () => {
    var dateParts, year, month, day;
    if (this.props.date != null) {
      year = this.props.date.slice(0,4);
      month = this.props.date.slice(5,7);
      day = this.props.date.slice(8, 10);
      dateParts = {
        year: year,
        month: month,
        day: day
      }
    } else {
      dateParts = {
        year: null,
        month: null,
        day: null
      }
    }
    return dateParts;

  };

  createDateString = (dateParts) => {
    var str = dateParts.year + "-" + dateParts.month + "-"  + dateParts.day
    return str;
  };

  updateDatePart = (part) => {
    var value, dateParts, str;
    value = $(this.refs[part]).val();
    dateParts = this.getDateParts();
    dateParts[part] = value;
    str = this.createDateString(dateParts);
    this.props.updateDate(str);
  };

  updateYear = () => {
    this.updateDatePart('year');
  };

  updateMonth = () => {
    this.updateDatePart('month');
  };

  updateDay = () => {
    this.updateDatePart('day');
  };

  getYearOptions = () => {
    var years, yearOptions;
    years = [];
    _.times(20, function (i) {
      var next = 2015 + i;
      years.push(next);
    });
    yearOptions = _.map(years, function (year) {
      return <option key={year} value={year}>{year}</option>;
    });
    return yearOptions;
  };

  getMonthOptions = () => {
    var monthNames, monthNumbers, months, monthOptions;
    monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    monthNumbers = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
    months = _.map(monthNames, function (name, index) {
      return {
        name: name,
        number: monthNumbers[index]
      };
    });
    monthOptions = _.map(months, function (hash) {
      return <option key={hash.number} value={hash.number}>{hash.name}</option>;
    });
    return monthOptions;
  };

  getDayOptions = (month) => {
    var numDays, days, shortMonths, dayOptions;
    shortMonths = ['04', '06', '09', '11'];
    if (month == '02') {
      numDays = 28;
    } else if (_.contains(shortMonths, month)) {
      numDays = 30;
    } else {
      numDays = 31;
    }
    days = [];
    _.times(numDays, function (i) {
      var number = i+1;
      var numberName = '' + number
      if (number < 10) {
        number = '0' + number;
      }
      var next = {
        name: '' + numberName,
        number: '' + number
      }
      days.push(next);
    });
    dayOptions = _.map(days, function (day) {
      return <option key={day.number} value={day.number}>{day.name}</option>;
    });
    return dayOptions;
  };

  render() {
    var dateParts, yearOptions, monthOptions, dayOptions;
    dateParts = this.getDateParts();
    yearOptions = this.getYearOptions();
    monthOptions = this.getMonthOptions();
    dayOptions = this.getDayOptions(dateParts.month);

    return (
      <span>
        <div className='col-xs-2'>
          <select onChange={this.updateMonth} ref='month' value={dateParts.month}>
            {monthOptions}
          </select>
        </div>
        <div className='col-xs-2'>
          <select onChange={this.updateDay} ref='day' value={dateParts.day}>
            {dayOptions}
          </select>
        </div>
        <div className='col-xs-2'>
          <select onChange={this.updateYear} ref='year' value={dateParts.year}>
            {yearOptions}
          </select>
        </div>
      </span>
    );
  }
}
