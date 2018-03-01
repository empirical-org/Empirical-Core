import React from 'react';
import DropdownFilter from '../progress_reports/dropdown_filter.jsx';
import DateRangeFilter from '../general_components/date_range_filter.jsx';
import moment from 'moment';

export default React.createClass({

  render() {
    const datepickerDropdownStyle = {
      'position': 'relative',
      'display': 'inline-block',
      'marginRight': '20px'
    }

    const inputDropdownStyle = Object.assign({}, datepickerDropdownStyle, {
      'width': '250px'
    });

    return (
      <div className="row activity-page-dropdown-wrapper scorebook-filters">
        <div style={inputDropdownStyle}>
          <DropdownFilter
            options={this.props.classroomFilters}
            selectOption={this.props.selectClassroom}
            selectedOption={this.props.selectedClassroom}
            placeholder={'Select a Classroom'}
            icon="fa-group"
          />
        </div>
        <div style={inputDropdownStyle}>
          <DropdownFilter
            options={this.props.unitFilters}
            selectOption={this.props.selectUnit}
            selectedOption={this.props.selectedUnit}
            icon="fa-book"
          />
        </div>
        <div style={datepickerDropdownStyle}>
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
