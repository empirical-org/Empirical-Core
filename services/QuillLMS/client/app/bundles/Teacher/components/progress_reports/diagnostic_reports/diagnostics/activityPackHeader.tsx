import * as React from 'react'

import {
  baseDiagnosticImageSrc
} from './shared'

import {
  helpIcon,
  Tooltip
} from '../../../../../Shared/index'

const ellipsesIcon = <img alt="Open menu icon" src={`${baseDiagnosticImageSrc}/ellipses_icon.svg`} />

const ActivityPackHeader = ({ name, activityPackId, activityCount, handleSelectAllClick, style, }) => {
  return (
    <th className="recommendation-header" key={name} style={style || {}}>
      <div className="name-and-tooltip">
        <span>{name}</span>
        <a aria-label="Preview the activity pack" href={`/activities/packs/${activityPackId}`} rel="noopener noreferrer" target="_blank"><img alt="" src={helpIcon.src} /></a>
      </div>
      <div className="activity-count-and-select-all">
        <span className="activity-count">{activityCount} {activityCount === 1 ? 'activity' : 'activities'}</span>
        <Tooltip
          tooltipText="Select all column"
          tooltipTriggerText={<button aria-label="Select all column" className="interactive-wrapper" onClick={handleSelectAllClick} type="button">{ellipsesIcon}</button>}
        />
      </div>
    </th>
  )
}

export default ActivityPackHeader
