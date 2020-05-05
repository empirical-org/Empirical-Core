import React from 'react';
import _ from 'underscore';
import StudentProfileUnit from './student_profile_unit.jsx';
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

  showPreviewModal = (activityId) => {
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
        showPreviewModal={this.showPreviewModal}
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

    let link = <a className="quill-button medium primary contained focus-on-dark" href={activityLaunchLink(ca_id, activity_id)}>Join</a>

    if (isBeingPreviewed) {
      const onClick = () => this.showPreviewModal(activity_id)
      link = <button className="quill-button medium primary contained focus-on-dark" onClick={onClick} type="button">Join</button>
    }

    return (<div className="pinned-activity">
      <span>{name}</span>
      {link}
    </div>)
  }

  renderPreviewModal = () => {
    const { showPreviewModal, previewActivityId, } = this.state

    if (!(showPreviewModal && previewActivityId)) { return }

    return (<div className="modal-container student-profile-modal-container">
      <div className="modal-background" />
      <div className="student-profile-modal quill-modal modal-body">
        <div>
          <h3 className="title">Only a student can complete an activity, but you can still preview it.</h3>
        </div>
        <div className="student-profile-modal-text">
          <p>None of your responses will be saved, and the activity will not be marked as complete.</p>
        </div>
        <div className="form-buttons">
          <button className="quill-button outlined secondary medium focus-on-light" onClick={this.handleClosePreviewActivityModalClick} type="button">Cancel</button>
          <a className="quill-button contained primary medium focus-on-light" href={`/activity_sessions/anonymous?activity_id=${previewActivityId}`} onClick={this.handleClosePreviewActivityModalClick} rel="noopener noreferrer" target="_blank">Preview activity</a>
        </div>
      </div>
    </div>)
  }

  renderPinnedActivityModal = () => {
    const { data, teacherName, isBeingPreviewed, } = this.props
    const { closedPinnedActivityModal, } = this.state
    const pinnedActivity = data.find(act => act.pinned === 't')
    if (isBeingPreviewed || !pinnedActivity || closedPinnedActivityModal) { return }

    const { name, ca_id, activity_id, } = pinnedActivity
    return (<div className="modal-container pinned-activity-modal-container">
      <div className="modal-background" />
      <div className="pinned-activity-modal quill-modal modal-body">
        <div>
          <h3 className="title">Join: {name}</h3>
        </div>
        <div className="pinned-activity-modal-text">
          <p>Your teacher, {teacherName}, has launched a live Quill Lesson.</p>
        </div>
        <div className="form-buttons">
          <button className="quill-button outlined secondary medium focus-on-light" onClick={this.handleClosePinnedActivityModalClick} type="button">Not now</button>
          <a className="quill-button contained primary medium focus-on-light" href={activityLaunchLink(ca_id, activity_id)}>Join the lesson</a>
        </div>
      </div>
    </div>)
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
