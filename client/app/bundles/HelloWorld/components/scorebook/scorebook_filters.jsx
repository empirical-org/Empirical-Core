import React from 'react';
import DropdownFilter from '../progress_reports/dropdown_filter.jsx';
import DateRangeFilter from '../general_components/date_range_filter.jsx';
import moment from 'moment';

export default React.createClass({

  render() {
    return (
      <div className="row activity-page-dropdown-wrapper">
        <div className="col-xs-12 col-sm-3 col-md-3 col-lg-3 col-xl-3 ">
          <DropdownFilter
            options={this.props.classroomFilters}
            selectOption={this.props.selectClassroom}
            selectedOption={this.props.selectedClassroom}
            placeholder={'Select a Classroom'}
            icon="fa-group"
          />
        </div>
        <div className="col-xs-12 col-sm-3 col-md-3 col-lg-3 col-xl-3">
          <DropdownFilter
            options={this.props.unitFilters}
            selectOption={this.props.selectUnit}
            selectedOption={this.props.selectedUnit}
            icon="fa-book"
          />
        </div>
        <div className="col-xs-12 col-sm-6">
          <DateRangeFilter
            selectDates={this.props.selectDates}
            filterOptions={this.props.dateRangeFilterOptions}
            beginDate={this.props.beginDate}
            endDate={this.props.endDate}
            icon="fa-calendar"
            dateFilterName={this.props.dateFilterName}
          />
        </div>
      </div>
    );
  },
});
