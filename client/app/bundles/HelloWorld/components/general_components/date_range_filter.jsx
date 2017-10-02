'use strict';
import DatePicker from 'react-datepicker'
import React from 'react'
import moment from 'moment';
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
      <div className="row date-range-filter">
        <div className="no-pl col-xs-6 col-sm-5">
          <DatePicker selected={this.state.beginDate} maxDate={moment()} onChange={this.selectBeginDate}   placeholderText='Completed: From'/>
        </div>
        <div className="no-pl col-xs-6 col-sm-5">
          <DatePicker selected={this.state.endDate} maxDate={moment()}  onChange={this.selectEndDate}   placeholderText='Completed: To'/>
        </div>
      </div>
    );
  }
});
