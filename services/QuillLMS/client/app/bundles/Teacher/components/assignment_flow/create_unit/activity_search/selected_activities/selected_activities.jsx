'use strict'

import React from 'react'
import SelectedActivity from './selected_activity'
import SortableList from '../../../../shared/sortableList'

export default class SelectedActivities extends React.Component {
  render() {
    let rows, buttonClassName, content
    rows = this.props.selectedActivities.map((ele, i) => <SelectedActivity data={ele} key={i} toggleActivitySelection={this.props.toggleActivitySelection} />);
    const sortableRows = this.props.sortable ? <SortableList data={rows} sortCallback={this.props.sortCallback} /> : null
    const unitName = this.props.unitName ? this.props.unitName : 'New Activity Pack'
    if (this.props.selectedActivities.length > 0) {
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
  }
}
