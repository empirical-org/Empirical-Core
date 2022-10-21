import * as React from "react";
import DateTimePicker from 'react-datetime-picker';
import { DropdownInput } from "../../../../Shared";

const FilterWidget = ({
  handleFilterClick,
  handleVersionSelection,
  onEndDateChange,
  onStartDateChange,
  endDate,
  startDate,
  versionOptions,
  selectedVersion
}) => {
  return(
    <div className="date-selection-container rules-analysis">
      <div className="left-side-container">
        <DropdownInput
          className="version-dropdown"
          handleChange={handleVersionSelection}
          isSearchable={true}
          label="Version options"
          options={versionOptions}
          value={selectedVersion}
        />
        <div className="filter-container">
          <p className="date-picker-label">Start Date:</p>
          <DateTimePicker
            ampm={false}
            className="start-date-picker"
            format='y-MM-dd HH:mm'
            onChange={onStartDateChange}
            value={startDate}
          />
        </div>
        <div className="filter-container">
          <p className="date-picker-label">End Date:</p>
          <DateTimePicker
            ampm={false}
            className="end-date-picker"
            format='y-MM-dd HH:mm'
            onChange={onEndDateChange}
            value={endDate}
          />
        </div>
      </div>
      <button className="quill-button fun primary contained" onClick={handleFilterClick} type="submit">Filter</button>
    </div>
  );
}

export default FilterWidget;
