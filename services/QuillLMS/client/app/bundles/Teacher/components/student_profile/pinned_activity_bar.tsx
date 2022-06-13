import * as React from 'react'
import activityLaunchLink from '../modules/generate_activity_launch_link.js';

interface PinnedActivityBarProps {
  activityId: string,
  classroomUnitId: string,
  name: string,
  isBeingPreviewed: boolean,
  onShowPreviewModal: (activityId: string) => void
}

export default class PinnedActivityBar extends React.Component<PinnedActivityBarProps, {}> {
  handleClickDuringPreview = () => {
    const { activityId, onShowPreviewModal, } = this.props
    onShowPreviewModal(activityId)
  }

  render() {
    const { isBeingPreviewed, classroomUnitId, activityId, name, } = this.props
    let link = <a aria-label={`Join ${name}`} className="quill-button medium primary contained focus-on-dark" href={activityLaunchLink(classroomUnitId, activityId)}>Join</a>

    if (isBeingPreviewed) {
      link = <button aria-label={`Join ${name}`} className="quill-button medium primary contained focus-on-dark" onClick={this.handleClickDuringPreview} type="button">Join</button>
    }

    return (
      <div className="pinned-activity" role="status">
        <span>{name}</span>
        {link}
      </div>
    )
  }
}
