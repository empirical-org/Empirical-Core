import React from 'react';

const DateRangeFilterOption = props => {
  const selected = props.selected ? 'selected' : ''
  return <div className={`calendar-prefill-option ${selected}`} onClick={props.onClickFunction}>{props.title}</div>;
};

export default DateRangeFilterOption;
