'use strict'

import React from 'react'

import SelectedActivity from './selected_activity'

import SortableList from '../../../../shared/sortableList'

const SelectedActivities = props => {
  let rows, buttonClassName, content
  rows = props.selectedActivities.map((ele, i) => <SelectedActivity data={ele} key={i} toggleActivitySelection={props.toggleActivitySelection} />);
  const sortableRows = props.sortable ? <SortableList data={rows} sortCallback={props.sortCallback} /> : null
  const unitName = props.unitName ? props.unitName : 'New Activity Pack'
  if (props.selectedActivities.length > 0) {
    content = (<section className="selected-activities-section">
      <h3 className="section-header">Selected Activities for {unitName}:</h3>
      <table className="table activity-table selected-activities headless-rounded-table">
        <tbody>
          {sortableRows ? sortableRows : rows}
        </tbody>
      </table>
    </section>)
  } else {
    content = <span />
  }
  return (
    <div>{content}</div>
  );
};

export default SelectedActivities;
