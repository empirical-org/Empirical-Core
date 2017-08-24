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
        unitsWithGroupedActivities[unit].incomplete = _.sortBy(partitionedActivities[1], 'act_sesh_updated_at');
      }
    }
    const unitsGroupedByCompletion = _.partition(unitsWithGroupedActivities, unit => (!!unit.incomplete));
    const finalUnitGrouping = {};
    finalUnitGrouping.incomplete = unitsGroupedByCompletion[0].sort((a, b) => a.incomplete[0].unit_created_at - b.incomplete[0].unit_created_at);
    finalUnitGrouping.complete = unitsGroupedByCompletion[1].sort((a, b) => a.complete[0].unit_created_at - b.complete[0].unit_created_at);
    console.log(finalUnitGrouping);
    return finalUnitGrouping;
  },

  render() {
    console.log('props', this.groupUnits());
    // var units = _.reduce(this.props.data, function (acc, value, key) {
    //   var x = <StudentProfileUnit key={key} data={_.extend(value, {unitName: key})} />
    //   return _.chain(acc).push(x).value();
    // }, []);
    return (
      <div className="container">
        {this.props.loading ? null : 'HIEHEHEHEH'}
      </div>
    );
  },
});
