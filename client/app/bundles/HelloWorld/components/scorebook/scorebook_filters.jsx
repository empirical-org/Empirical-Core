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
    const dropdownStyle = {
      'width': '250px',
      'position': 'relative',
      'display': 'inline-block',
      'marginRight': '20px'
    }

    return (
      <div className="row activity-page-dropdown-wrapper scorebook-filters">
        <div style={dropdownStyle}>
          <DropdownFilter
            options={this.props.classroomFilters}
            selectOption={this.props.selectClassroom}
            selectedOption={this.props.selectedClassroom}
            placeholder={'Select a Classroom'}
            icon="fa-group"
          />
        </div>
        <div style={dropdownStyle}>
          <DropdownFilter
            options={this.props.unitFilters}
            selectOption={this.props.selectUnit}
            selectedOption={this.props.selectedUnit}
            icon="fa-book"
          />
        </div>
        <div style={dropdownStyle}>
          <DateRangeFilter
            selectDates={this.props.selectDates}
            filterOptions={this.DATE_RANGE_FILTER_OPTIONS}
            beginDate={this.props.beginDate}
            endDate={this.props.endDate}
            icon="fa-calendar"
          />
        </div>
      </div>
    );
  },
});
