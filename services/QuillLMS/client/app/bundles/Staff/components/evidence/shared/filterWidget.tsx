import * as React from "react";
import DateTimePicker from 'react-datetime-picker';

const FilterWidget = ({
  handleFilterClick,
  onEndDateChange,
  onStartDateChange,
  endDate,
  startDate
}) => {

  return(
    <div className="date-selection-container rules-analysis">
      <div className="left-side-container">
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
          <p className="date-picker-label">End Date (optional):</p>
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
