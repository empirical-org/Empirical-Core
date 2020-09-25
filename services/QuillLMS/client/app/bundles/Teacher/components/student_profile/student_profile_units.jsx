import React from 'react';
import _ from 'underscore';

import StudentProfileUnit from './student_profile_unit.jsx';
import PinnedActivityModal from './pinned_activity_modal'
import PreviewActivityModal from './preview_activity_modal'
import PinnedActivityBar from './pinned_activity_bar'

import LoadingIndicator from '../shared/loading_indicator'
import activityLaunchLink from '../modules/generate_activity_launch_link.js';
import { ALL_ACTIVITIES, TO_DO_ACTIVITIES, COMPLETED_ACTIVITIES, } from '../../../../constants/student_profile'

const clipboardSrc = `${process.env.CDN_URL}/images/illustrations/clipboard.svg`

export default class StudentProfileUnits extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      closedPinnedActivityModal: false,
      showPreviewModal: false
    }
  }

  componentDidMount() {
    document.title = 'Quill.org | Classwork'
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
        return this.groupUnits().length ? 'Write on! You’re all finished with your activities.' : 'Nothing to see here yet! Once your teacher assigns activities they will show up here.'
      case COMPLETED_ACTIVITIES:
        return 'Nothing to see here yet! Once you complete an activity it will show up here.'
      case ALL_ACTIVITIES:
      default:
        return 'Nothing to see here yet! Once your teacher assigns activities they will show up here.'
    }
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

  handleClosePinnedActivityModalClick = () => {
    this.setState({ closedPinnedActivityModal: true, })
  }

  handleClosePreviewActivityModalClick = () => {
    this.setState({ showPreviewModal: false, previewActivityId: null, })
  }

  handleShowPreviewModal = (activityId) => {
    this.setState({ showPreviewModal: true, previewActivityId: activityId, })
  }

  renderContent = () => {
    const { loading, nextActivitySession, isBeingPreviewed, } = this.props
    if (loading) { return <LoadingIndicator /> }

    const content = this.displayedUnits().map(unit => {
      const { unit_id, unit_name, } = unit[Object.keys(unit)[0]][0]
      return (<StudentProfileUnit
        data={unit}
        isBeingPreviewed={isBeingPreviewed}
        key={unit_id}
        nextActivitySession={nextActivitySession}
        onShowPreviewModal={this.handleShowPreviewModal}
        unitName={unit_name}
      />)
    })

    return content.length ? content : this.renderEmptyState()
  }

  renderEmptyState = () => (
    <div className="student-profile-empty-state">
      <img alt="Clipboard with notes written on it" src={clipboardSrc} />
      <p>{this.emptyStateText()}</p>
    </div>
  )

  renderPinnedActivityBar = () => {
    const { data, isBeingPreviewed, } = this.props
    const pinnedActivity = data.find(act => act.pinned === 't')
    if (!pinnedActivity) { return }

    const { name, ca_id, activity_id, } = pinnedActivity

    return (<PinnedActivityBar
      activityId={activity_id}
      classroomUnitId={ca_id}
      isBeingPreviewed={isBeingPreviewed}
      name={name}
      onShowPreviewModal={this.handleShowPreviewModal}
    />)
  }

  renderPreviewModal = () => {
    const { showPreviewModal, previewActivityId, } = this.state

    if (!(showPreviewModal && previewActivityId)) { return }

    return (<PreviewActivityModal
      onClosePreviewActivityModalClick={this.handleClosePreviewActivityModalClick}
      previewActivityId={previewActivityId}
    />)
  }

  renderPinnedActivityModal = () => {
    const { data, teacherName, isBeingPreviewed, } = this.props
    const { closedPinnedActivityModal, } = this.state
    const pinnedActivity = data.find(act => act.pinned === 't')
    if (isBeingPreviewed || !pinnedActivity || closedPinnedActivityModal) { return }

    const { name, ca_id, activity_id, } = pinnedActivity
    return (<PinnedActivityModal
      activityId={activity_id}
      classroomUnitId={ca_id}
      name={name}
      onClosePinnedActivityModalClick={this.handleClosePinnedActivityModalClick}
      teacherName={teacherName}
    />)
  }

  render() {
    return (
      <div className="container">
        {this.renderPinnedActivityBar()}
        {this.renderPinnedActivityModal()}
        {this.renderPreviewModal()}
        {this.renderContent()}
      </div>
    );
  }
}
