import React from 'react';
import _ from 'underscore';
import StudentProfileUnit from './student_profile_unit.jsx';
import activityLaunchLink from '../modules/generate_activity_launch_link.js';
import { ALL_ACTIVITIES, TO_DO_ACTIVITIES, COMPLETED_ACTIVITIES, } from '../../../../constants/student_profile'

const clipboardSrc = `${process.env.CDN_URL}/images/illustrations/clipboard.svg`

export default class StudentProfileUnits extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      closedModal: false
    }
  }

  handleCloseModalClick = () => {
    this.setState({ closedModal: true, })
  }

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

  displayedUnits = () => {
    const { activeClassworkTab, } = this.props
    const groupedUnits = this.groupUnits()

    switch(activeClassworkTab) {
      case TO_DO_ACTIVITIES:
        const unitsWithIncompleteActivities = groupedUnits.filter(u => u.incomplete && u.incomplete.length)
        return unitsWithIncompleteActivities.map(u => ({ incomplete: u.incomplete }))
      case COMPLETED_ACTIVITIES:
        const unitsWithCompletedActivities = groupedUnits.filter(u => u.complete && u.complete.length)
        return unitsWithCompletedActivities.map(u => ({ complete: u.complete }))
      case ALL_ACTIVITIES:
      default:
        return groupedUnits
    }
  }

  emptyStateText = () => {
    const { activeClassworkTab, } = this.props

    switch(activeClassworkTab) {
      case TO_DO_ACTIVITIES:
        return this.groupUnits().length ? 'Write on! You’re all finished with your activities.' : '"Nothing to see here yet! Once your teacher assigns activities they will show up here.'
      case COMPLETED_ACTIVITIES:
        return 'Nothing to see here yet! Once you complete an activity it will show up here.'
      case ALL_ACTIVITIES:
      default:
        return 'Nothing to see here yet! Once your teacher assigns activities they will show up here.'
    }
  }

  renderEmptyState = () => (
    <div className="student-profile-empty-state">
      <img alt="Clipboard with notes written on it" src={clipboardSrc} />
      <p>{this.emptyStateText()}</p>
    </div>
  )

  renderPinnedActivityBar = () => {
    const { data, } = this.props
    const pinnedActivity = data.find(act => act.pinned === 't')
    if (!pinnedActivity) { return }

    const { name, ca_id, activity_id, } = pinnedActivity
    return (<div className="pinned-activity">
      <span>{name}</span>
      <a className="quill-button medium primary contained focus-on-dark" href={activityLaunchLink(ca_id, activity_id)}>Join</a>
    </div>)
  }

  renderPinnedActivityModal = () => {
    const { data, teacherName, } = this.props
    const { closedModal, } = this.state
    const pinnedActivity = data.find(act => act.pinned === 't')
    if (!pinnedActivity || closedModal) { return }

    const { name, ca_id, activity_id, } = pinnedActivity
    return (<div className="modal-container pinned-activity-modal-container">
      <div className="modal-background" />
      <div className="pinned-activity-modal quill-modal modal-body">
        <div>
          <h3 className="title">New Lesson Available: {name}</h3>
        </div>
        <div className="pinned-activity-modal-text">
          <p>Your teacher, {teacherName}, has launched a live Quill Lesson.</p>
        </div>
        <div className="form-buttons">
          <button className="quill-button outlined secondary medium focus-on-light" onClick={this.handleCloseModalClick} type="button">Not now</button>
          <a className="quill-button contained primary medium focus-on-light" href={activityLaunchLink(ca_id, activity_id)}>Join the lesson</a>
        </div>
      </div>
    </div>)
  }

  render() {
    const { loading, } = this.props
    let content = 'LOADING';
    if (!loading) {
      // give unit unit id key whether it is complete or incomplete
      content = this.displayedUnits().map(unit => {
        const { unit_id, unit_name, } = unit[Object.keys(unit)[0]][0]
        return <StudentProfileUnit data={unit} key={unit_id} unitName={unit_name} />
      });
    }

    if (!content.length) { content = this.renderEmptyState() }

    return (
      <div className="container">
        {this.renderPinnedActivityBar()}
        {this.renderPinnedActivityModal()}
        {content}
      </div>
    );
  }
}
