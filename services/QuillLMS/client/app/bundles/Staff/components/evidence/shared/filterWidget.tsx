import * as React from "react";
import Datetime from 'react-datetime';
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
          <Datetime
            dateFormat='y-MM-D'
            onChange={onStartDateChange}
            timeFormat='HH:mm'
            value={startDate || new Date()}
          />
        </div>
        <div className="filter-container">
          <p className="date-picker-label">End Date:</p>
          <Datetime
            dateFormat='y-MM-D'
            onChange={onStartDateChange}
            timeFormat='HH:mm'
            value={endDate || new Date()}
          />
        </div>
      </div>
      <button className="quill-button fun primary contained" onClick={handleFilterClick} type="submit">Filter</button>
    </div>
  );
}

export default FilterWidget;
