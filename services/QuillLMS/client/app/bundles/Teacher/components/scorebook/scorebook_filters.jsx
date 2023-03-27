import React from 'react';

import { DropdownInput } from '../../../Shared';
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
    'width': '30%'
  });
  const classroomFilterOptions = classroomFilters.map((c) => {
    c.label = c.name
    return c
  })

  const selectedClassroomOption = classroomFilterOptions.find(c => selectedClassroom ? c.value === selectedClassroom.value : true)

  const activityPackFilterOptions = unitFilters.map((c) => {
    c.label = c.name
    return c
  })

  const selectedActivityPackOption = activityPackFilterOptions.find(c => c.value === selectedUnit.value)

  return (
    <div className="activity-page-dropdown-wrapper scorebook-filters">
      <div className="scorebook-filter-group">
        <div style={inputDropdownStyle}>
          <DropdownInput
            handleChange={selectClassroom}
            options={classroomFilterOptions}
            value={selectedClassroomOption}
          />
        </div>
        <div style={inputDropdownStyle}>
          <DropdownInput
            handleChange={selectUnit}
            options={activityPackFilterOptions}
            value={selectedActivityPackOption}
          />
        </div>
      </div>
      <DateRangeFilter
        beginDate={beginDate}
        dateFilterName={dateFilterName}
        endDate={endDate}
        filterOptions={dateRangeFilterOptions}
        icon="fa-calendar"
        selectDates={selectDates}
      />
    </div>
  );
};

export default ScorebookFilters;
