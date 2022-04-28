import * as React from 'react'

import activityLaunchLink from '../modules/generate_activity_launch_link.js';

interface PinnedActivityModalProps {
  activityId: string,
  classroomUnitId: string,
  name: string,
  teacherName: string,
  onClosePinnedActivityModalClick: () => void
}

const PinnedActivityModal = ({ name, teacherName, classroomUnitId, activityId, onClosePinnedActivityModalClick, }: PinnedActivityModalProps) => (<div className="modal-container pinned-activity-modal-container">
  <div className="modal-background" />
  <div className="pinned-activity-modal quill-modal modal-body">
    <div>
      <h3 className="title">{name}</h3>
    </div>
    <div className="pinned-activity-modal-text">
      <p>Your teacher, {teacherName}, has launched a live Quill Lesson.</p>
    </div>
    <div className="form-buttons">
      <button className="quill-button outlined secondary medium focus-on-light" onClick={onClosePinnedActivityModalClick} type="button">Not now</button>
      <a className="quill-button contained primary medium focus-on-light" href={activityLaunchLink(classroomUnitId, activityId)}>Join the lesson</a>
    </div>
  </div>
</div>)

export default PinnedActivityModal
