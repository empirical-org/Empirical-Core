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
            icon="fa-group"
            options={this.props.classroomFilters}
            placeholder={'Select a Classroom'}
            selectedOption={this.props.selectedClassroom}
            selectOption={this.props.selectClassroom}
          />
        </div>
        <div style={inputDropdownStyle}>
          <DropdownFilter
            icon="fa-book"
            options={this.props.unitFilters}
            selectedOption={this.props.selectedUnit}
            selectOption={this.props.selectUnit}
          />
        </div>
        <div style={datepickerDropdownStyle}>
          <DateRangeFilter
            beginDate={this.props.beginDate}
            dateFilterName={this.props.dateFilterName}
            endDate={this.props.endDate}
            filterOptions={this.props.dateRangeFilterOptions}
            icon="fa-calendar"
            selectDates={this.props.selectDates}
          />
        </div>
      </div>
    );
  },
});
