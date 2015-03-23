"use strict;"
EC.DateRangeFilter = React.createClass({
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
    this.setState({beginDate: val}, this.areBothSelected);
  },

  selectEndDate: function (val) {
    this.setState({endDate: val}, this.areBothSelected);
  },

  areBothSelected: function () {
    if ((this.state.beginDate != null) && (this.state.endDate != null)) {
      this.props.selectDates(this.state.beginDate, this.state.endDate);
    }
  },

  render: function() {
    return (
      <div className="row date-range-filter">
        <div className="no-pl col-xs-6 col-sm-5">
          <EC.DatePicker key='datepick1' placeHolder="Start Date" handleChange={this.selectBeginDate}/>
        </div>
        <div className="no-pl col-xs-6 col-sm-5">
          <EC.DatePicker key='datepick2' placeHolder="End Date" handleChange={this.selectEndDate}/>
        </div>
      </div>
    );
  }
});