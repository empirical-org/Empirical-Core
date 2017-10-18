import React from 'react';
import DropdownFilter from '../progress_reports/dropdown_filter.jsx';
import DateRangeFilter from '../general_components/date_range_filter.jsx';
import moment from 'moment';

export default React.createClass({

  DATE_RANGE_FILTER_OPTIONS: [
    {
      title: 'Today',
      beginDate: moment()
    },
    {
      title: 'This Week',
      beginDate: moment().startOf('week')
    },
    {
      title: 'This Month',
      beginDate: moment().startOf('month')
    },
    {
      title: 'Last 7 days',
      beginDate: moment().subtract(7, 'days')
    },
    {
      title: 'Last 30 days',
      beginDate: moment().subtract(1, 'months')
    },
    {
      title: 'All Time',
      beginDate: null
    },
  ],

  render() {
    return (
      <div className="row activity-page-dropdown-wrapper">
        <div className="col-xs-12 col-sm-3 col-md-3 col-lg-3 col-xl-3 ">
          <DropdownFilter
            options={this.props.classroomFilters}
            selectOption={this.props.selectClassroom}
            selectedOption={this.props.selectedClassroom}
          />
        </div>
        <div className="col-xs-12 col-sm-3 col-md-3 col-lg-3 col-xl-3">
          <DropdownFilter
            options={this.props.unitFilters}
            selectOption={this.props.selectUnit}
            selectedOption={this.props.selectedUnit}
          />
        </div>
        <div className="col-xs-12 col-sm-6">
          <DateRangeFilter
            selectDates={this.props.selectDates}
            filterOptions={this.DATE_RANGE_FILTER_OPTIONS}
            beginDate={this.props.beginDate}
            endDate={this.props.endDate}
          />
        </div>
      </div>
    );
  },
});
