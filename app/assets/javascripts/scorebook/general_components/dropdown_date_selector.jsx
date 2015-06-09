'use strict';
EC.DropdownDateSelector = React.createClass({
  propTypes : {
    date: React.PropTypes.string.isRequired,
    updateDate: React.PropTypes.func.isRequired
  },
  getDateParts: function () {
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

  },
  createDateString: function (dateParts) {
    var str = dateParts.year + "-" + dateParts.month + "-"  + dateParts.day
    return str;
  },
  updateDatePart: function (part) {
    var value, dateParts, str;
    value = $(this.refs[part].getDOMNode()).val();
    dateParts = this.getDateParts();
    dateParts[part] = value;
    str = this.createDateString(dateParts);
    this.props.updateDate(str);
  },
  updateYear: function () {
    this.updateDatePart('year');
  },
  updateMonth: function () {
    this.updateDatePart('month');
  },
  updateDay: function () {
    this.updateDatePart('day');
  },
  getYearOptions: function () {
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
  },
  getMonthOptions: function () {
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
  },
  getDayOptions: function (month) {
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
  },
  render: function () {
    var dateParts, yearOptions, monthOptions, dayOptions;
    dateParts = this.getDateParts();
    yearOptions = this.getYearOptions();
    monthOptions = this.getMonthOptions();
    dayOptions = this.getDayOptions(dateParts.month);

    return (
      <span>
        <div className='col-xs-2'>
          <select ref='month' value={dateParts.month} onChange={this.updateMonth}>
            {monthOptions}
          </select>
        </div>
        <div className='col-xs-2'>
          <select ref='day' value={dateParts.day} onChange={this.updateDay}>
            {dayOptions}
          </select>
        </div>
        <div className='col-xs-2'>
          <select ref='year' value={dateParts.year} onChange={this.updateYear}>
            {yearOptions}
          </select>
        </div>
      </span>
    );
  }
});
