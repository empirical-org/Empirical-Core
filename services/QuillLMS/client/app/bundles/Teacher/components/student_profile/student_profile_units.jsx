import React from 'react';
import _ from 'underscore';
import StudentProfileUnit from './student_profile_unit.jsx';
import { ALL_ACTIVITIES, TO_DO_ACTIVITIES, COMPLETED_ACTIVITIES, } from '../../../../constants/student_profile'

const clipboardSrc = `${process.env.CDN_URL}/images/illustrations/clipboard.svg`

export default class StudentProfileUnits extends React.Component {

  groupUnits() {
    const { data, } = this.props
    const groupedUnits = _.groupBy(data, 'unit_id');
    const unitsWithGroupedActivities = {};
    for (const unit in groupedUnits) {
      const partitionedActivities = _.partition(groupedUnits[unit], activity => (activity.max_percentage != null));
      unitsWithGroupedActivities[unit] = {};
      if (partitionedActivities[0].length) {
        unitsWithGroupedActivities[unit].complete = _.sortBy(partitionedActivities[0], 'unit_activity_created_at');
      }
      if (partitionedActivities[1].length) {
        unitsWithGroupedActivities[unit].incomplete = partitionedActivities[1];
      }
    }
    const unitsGroupedByCompletion = _.partition(unitsWithGroupedActivities, unit => (!!unit.incomplete));
    const finalArrangement = (unitsGroupedByCompletion[0].sort((a, b) => a.incomplete[0].unit_created_at - b.incomplete[0].unit_created_at));
    const resultWithUnsortedUnits = finalArrangement.concat(unitsGroupedByCompletion[1].sort((a, b) => a.complete[0].unit_created_at - b.complete[0].unit_created_at));
    const resultWithSortedUnits = resultWithUnsortedUnits.sort(function(first, second) {
      if (first.incomplete != undefined && second.incomplete != undefined) {
        return new Date(first.incomplete[0].due_date) - new Date(second.incomplete[0].due_date);
      } else {
        return -1
      }
    });
    return resultWithSortedUnits;
  }

  emptyStateText = () => {
    const { activeClassworkTab, } = this.props

    switch(activeClassworkTab) {
      case TO_DO_ACTIVITIES:
        return resultWithSortedUnits.length ? 'Write on! You’re all finished with your activities.' : '"Nothing to see here yet! Once your teacher assigns activities they will show up here.'
      case COMPLETED_ACTIVITIES:
        return 'Nothing to see here yet! Once you complete an activity it will show up here.'
      case ALL_ACTIVITIES:
      default:
        return 'Nothing to see here yet! Once your teacher assigns activities they will show up here.'
    }

  }

  renderEmptyState = () => (
    <div className="student-profile-empty-state">
      <img alt="Clipboard" src={clipboardSrc} />
      <p>{this.emptyStateText()}</p>
    </div>
  )

  render() {
    const { loading, } = this.props
    let content = 'LOADING';
    if (!loading) {
      // give unit unit id key whether it is complete or incomplete
      content = this.groupUnits().map(unit => <StudentProfileUnit data={unit} key={unit[Object.keys(unit)[0]][0].unit_id} />);
    }

    if (!content.length) { content = this.renderEmptyState() }

    return (
      <div className="container">
        {content}
      </div>
    );
  }
}
