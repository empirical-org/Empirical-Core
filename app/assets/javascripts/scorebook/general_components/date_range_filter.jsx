EC.DateRangeFilter = React.createClass({
  propTypes: {
    selectDates: React.PropTypes.func.isRequired
  },
  getInitialState: function () {
    return ({
      firstDate: null,
      secondDate: null
    });
  },
  selectFirstDate: function (val) {
    this.setState({firstDate: val});
  },
  selectSecondDate: function (val) {
    if (this.state.firstDate != null) {
      this.selectDates(this.state.firstDate, this.state.secondDate);
    }
  },
  render: function() {
    return (
      <span>
        <EC.DatePicker key='datepick1' handleChange={this.selectFirstDate}/>
        <EC.DatePicker key='datepick2' handleChange={this.selectSecondDate}/>
      </span>
    );
  }
});