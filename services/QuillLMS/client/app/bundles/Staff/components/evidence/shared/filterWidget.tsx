import * as React from "react";
import DateTimePicker from 'react-datetime-picker';

import { Input } from '../../../../Shared/index';

const FilterWidget = ({
  handleFilterClick,
  handleSetTurkSessionID,
  onEndDateChange,
  onStartDateChange,
  endDate,
  startDate,
  turkSessionID,
  showError
}) => {

  return(
    <div className="date-selection-container rules-analysis">
      <p className="date-picker-label">Start Date:</p>
      <DateTimePicker
        ampm={false}
        className="start-date-picker"
        format='y-MM-dd HH:mm'
        onChange={onStartDateChange}
        value={startDate}
      />
      <p className="date-picker-label">End Date (optional):</p>
      <DateTimePicker
        ampm={false}
        className="end-date-picker"
        format='y-MM-dd HH:mm'
        onChange={onEndDateChange}
        value={endDate}
      />
      <p className="date-picker-label">Turk Session ID (optional):</p>
      <Input
        className="turk-session-id-input"
        handleChange={handleSetTurkSessionID}
        label=""
        value={turkSessionID}
      />
      <button className="quill-button fun primary contained" onClick={handleFilterClick} type="submit">Filter</button>
      {showError && <p className="error-message">Start date is required.</p>}
    </div>
  );
}

export default FilterWidget;
