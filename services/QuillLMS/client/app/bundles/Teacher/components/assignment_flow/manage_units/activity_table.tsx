import * as React from 'react'
import { SingleDatePicker } from 'react-dates'
import * as moment from 'moment';

import * as api from '../../modules/call_api';
import { requestPut } from '../../../../../modules/request/index.js';
import { DataTable } from '../../../../Shared/index'
import { addKeyDownListener, } from '../../../../Shared/hooks/addKeyDownListener'
import { getIconForActivityClassification } from '../../../../Shared/libs';

const shareActivitySrc = `${process.env.CDN_URL}/images/icons/icons-share.svg`
export const AVERAGE_FONT_WIDTH = 7

const tableHeaders = (isOwner) => ([
  {
    name: <span className="tool-and-name-header"><span>Tool</span><span>Activity</span></span>,
    attribute: 'toolAndNameSection',
    width: isOwner ? '607px' : '724px',
    rowSectionClassName: 'tool-and-name-section'
  },
  {
    name: <span className="due-date-header">Due date <span>(optional)</span></span>,
    attribute: 'dueDatePicker',
    width: isOwner ? '120px' : '110px',
    headerClassName: isOwner ? 'due-date-header-container' : 'due-date-header-container no-right-margin',
    rowSectionClassName: isOwner ? 'due-date-picker' : 'due-date-picker no-right-margin'
  },
  {
    name: '',
    attribute: 'shareActivity',
    width: '30px',
    noTooltip: true
  }
])

const ActivityTable = ({ data, onSuccess, isOwner, handleActivityClicked, handleToggleModal }) => {
  const classroomActivityArray = Array.from(data.classroomActivities).map(ca => ca[1])

  const [focusedHash, setFocusedHash] = React.useState({})
  const [activityOrder, setActivityOrder] = React.useState(classroomActivityArray.map(ca => ca.activityId) || [])

  function handleKeyDown(event) {
    if (event.key !== 'Tab') { return }

    const focusUnitActivityId = Object.keys(focusedHash).find(k => focusedHash[k])
    if (!focusUnitActivityId) { return }

    event.preventDefault()
    event.shiftKey ? document.getElementById(`tool-and-name-section-${focusUnitActivityId}`).focus() : document.getElementById(`remove-button-${focusUnitActivityId}`).focus()
    setFocusedHash({})
  }

  addKeyDownListener(handleKeyDown)

  function hideUnitActivity(unitActivityId) {
    requestPut(`${process.env.DEFAULT_URL}/teachers/unit_activities/${unitActivityId}/hide`, {}, () => onSuccess('Activity removed'))
  }

  function handleDueDateChange(date, unitActivityId) {
    const formattedDate = date ? date : null
    requestPut(`/teachers/unit_activities/${unitActivityId}`, { unit_activity: { due_date: formattedDate, } }, () => onSuccess());
  }

  function updateFocused(unitActivityId, isFocused) {
    const newFocused = {...focusedHash}
    newFocused[unitActivityId] = isFocused
    setFocusedHash(newFocused)
  }

  function reorderCallback(sortInfo) {
    const newUnitActivityOrder = sortInfo.map(item => item.key);
    const newActivityOrder = newUnitActivityOrder.map(unitActivityId => classroomActivityArray.find(ca => String(ca.uaId) === String(unitActivityId)).activityId)
    setActivityOrder(newActivityOrder)
    api.changeActivityPackOrder(data.unitId, newActivityOrder, () => onSuccess(null), null)
  }

  function handleShareActivityClick(activity) {
    handleActivityClicked(activity)
    handleToggleModal()
  }

  const activityRows = activityOrder.map(activityId => {
    const activity = classroomActivityArray.find(act => act.activityId === activityId)
    if (!activity){ return }
    const toolIcon = getIconForActivityClassification(activity.activityClassificationId)
    const previewLink = <a href={`/activity_sessions/anonymous?activity_id=${activity.activityId}`} tabIndex={-1}>{activity.name}</a>
    activity.toolAndNameSection = (<a className="interactive-wrapper focus-on-light" href={`/activity_sessions/anonymous?activity_id=${activity.activityId}`} id={`tool-and-name-section-${activity.uaId}`}>
      <span className="tool-icon-wrapper">{toolIcon}</span>
      {previewLink}
    </a>)

    const startDate = activity.dueDate ? moment(activity.dueDate) : null
    const focused = focusedHash[activity.uaId]
    const dropdownIconStyle = focused ? { transform: 'rotate(180deg)', } : null;

    const placeholderText = startDate ? startDate.format('MM/DD/YYYY') : 'No due date'
    /* eslint-disable react/jsx-no-bind */
    activity.dueDatePicker = isOwner ? (<SingleDatePicker
      customInputIcon={<img alt="dropdown indicator" src="https://assets.quill.org/images/icons/dropdown.svg" style={dropdownIconStyle} />}
      date={startDate}
      focused={focused}
      id={`${activity.uaId}-date-picker`}
      inputIconPosition="after"
      navNext='›'
      navPrev='‹'
      numberOfMonths={1}
      onDateChange={(date) => handleDueDateChange(date, activity.uaId)}
      onFocusChange={({ focused }) => updateFocused(activity.uaId, focused)}
      placeholder={placeholderText}
    />) : placeholderText
    activity.shareActivity = (
      <button className="share-activity-button focus-on-light" onClick={() => handleShareActivityClick(activity)} type="button" value="row-button">
        <img alt='share-arrow' src={shareActivitySrc} />
      </button>
    )
    activity.removable = true
    activity.id = activity.uaId
    return activity
  }).filter(Boolean)
  return (
    <DataTable
      headers={tableHeaders(isOwner)}
      isReorderable={isOwner}
      removeRow={hideUnitActivity}
      reorderCallback={reorderCallback}
      rows={activityRows}
      showRemoveIcon={isOwner}
    />
  )
}

export default ActivityTable
