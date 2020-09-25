import React from 'react';
import moment from 'moment';

import DropdownFilter from '../progress_reports/dropdown_filter.jsx';
import DateRangeFilter from '../general_components/date_range_filter.jsx';

const ScorebookFilters = (
  {
    classroomFilters,
    selectedClassroom,
    selectClassroom,
    unitFilters,
    selectedUnit,
    selectUnit,
    beginDate,
    dateFilterName,
    endDate,
    dateRangeFilterOptions,
    selectDates,
  },
) => {
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
          icon="fa-users"
          options={classroomFilters}
          placeholder={'Select a Classroom'}
          selectedOption={selectedClassroom}
          selectOption={selectClassroom}
        />
      </div>
      <div style={inputDropdownStyle}>
        <DropdownFilter
          icon="fa-book"
          options={unitFilters}
          selectedOption={selectedUnit}
          selectOption={selectUnit}
        />
      </div>
      <div style={datepickerDropdownStyle}>
        <DateRangeFilter
          beginDate={beginDate}
          dateFilterName={dateFilterName}
          endDate={endDate}
          filterOptions={dateRangeFilterOptions}
          icon="fa-calendar"
          selectDates={selectDates}
        />
      </div>
    </div>
  );
};

export default ScorebookFilters;
