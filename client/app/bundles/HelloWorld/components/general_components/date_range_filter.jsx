"use strict";
import DatePicker from '../shared/date_picker.jsx'
import React from 'react'
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

  selectBeginDate: function (val) {
    this.setState({beginDate: val}, this.selectDates);
  },

  selectEndDate: function (val) {
    this.setState({endDate: val}, this.selectDates);
  },

  selectDates: function () {
    this.props.selectDates(this.state.beginDate, this.state.endDate);
  },

  render: function() {
    return (
      <div className="row date-range-filter">
        <div className="no-pl col-xs-6 col-sm-5">
          <DatePicker key='datepick1' placeHolder="Completed : From" handleChange={this.selectBeginDate}/>
        </div>
        <div className="no-pl col-xs-6 col-sm-5">
          <DatePicker key='datepick2' placeHolder="Completed : To" handleChange={this.selectEndDate}/>
        </div>
      </div>
    );
  }
});
