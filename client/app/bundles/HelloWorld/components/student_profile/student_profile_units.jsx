import React from 'react';
import _ from 'underscore';
import StudentProfileUnit from './student_profile_unit.jsx';

export default React.createClass({

  groupUnits() {
    const groupedUnits = _.groupBy(this.props.data, 'unit_id');
    const unitsWithGroupedActivities = {};
    for (const unit in groupedUnits) {
      const partitionedActivities = _.partition(groupedUnits[unit], activity => (activity.max_percentage != null));
      unitsWithGroupedActivities[unit] = {};
      if (partitionedActivities[0].length) {
        unitsWithGroupedActivities[unit].complete = _.sortBy(partitionedActivities[0], 'classroom_activity_created_at');
      }
      if (partitionedActivities[1].length) {
        unitsWithGroupedActivities[unit].incomplete = partitionedActivities[1];
      }
    }
    const unitsGroupedByCompletion = _.partition(unitsWithGroupedActivities, unit => (!!unit.incomplete));
    const finalArrangement = (unitsGroupedByCompletion[0].sort((a, b) => a.incomplete[0].unit_created_at - b.incomplete[0].unit_created_at));
    return finalArrangement.concat(unitsGroupedByCompletion[1].sort((a, b) => a.complete[0].unit_created_at - b.complete[0].unit_created_at));
  },

  render() {
    let content = 'LOADING';
    if (!this.props.loading) {
      // give unit unit id key whether it is complete or incomplete
      content = this.groupUnits().map(unit => <StudentProfileUnit key={unit[Object.keys(unit)[0]][0].unit_id} data={unit} />);
    }
    return (
      <div className="container">
        {content}
      </div>
    );
  },
});
