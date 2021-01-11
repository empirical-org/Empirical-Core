import * as React from 'react'
import { SingleDatePicker } from 'react-dates'
import moment from 'moment';

import * as api from '../../modules/call_api';
import { requestPut } from '../../../../../modules/request/index.js';
import {
  DataTable
} from '../../../../Shared/index'
import { addKeyDownListener, } from '../../../../Shared/hooks/addKeyDownListener'

const connectSrc = `${process.env.CDN_URL}/images/icons/connect-forest-green.svg`
const diagnosticSrc = `${process.env.CDN_URL}/images/icons/diagnostic-forest-green.svg`
const lessonsSrc = `${process.env.CDN_URL}/images/icons/lessons-forest-green.svg`
const proofreaderSrc = `${process.env.CDN_URL}/images/icons/proofreader-forest-green.svg`
const grammarSrc = `${process.env.CDN_URL}/images/icons/grammar-forest-green.svg`

export const AVERAGE_FONT_WIDTH = 7

const imageTagForClassification = (activityClassificationId: string): JSX.Element => {
  let imgAlt = ""
  let imgSrc
  switch(Number(activityClassificationId)) {
    case 5:
      imgAlt = "Target representing Quill Connect"
      imgSrc = connectSrc
      break
    case 4:
      imgAlt = "Magnifying glass representing Quill Diagnostic"
      imgSrc = diagnosticSrc
      break
    case 2:
      imgAlt = "Puzzle piece representing Quill Grammar"
      imgSrc = grammarSrc
      break
    case 6:
      imgAlt = "Apple representing Quill Lessons"
      imgSrc = lessonsSrc
      break
    case 1:
      imgAlt = "Flag representing Quill Proofreader"
      imgSrc = proofreaderSrc
      break
  }

  return <img alt={imgAlt} src={imgSrc} />
}

const tableHeaders = (isOwner) => ([
  {
    name: <span className="tool-and-name-header"><span>Tool</span><span>Activity</span></span>,
    attribute: 'toolAndNameSection',
    width: isOwner ? '637px' : '754px',
    rowSectionClassName: 'tool-and-name-section'
  },
  {
    name: <span className="due-date-header">Due date <span>(optional)</span></span>,
    attribute: 'dueDatePicker',
    width: isOwner ? '120px' : '110px',
    headerClassName: isOwner ? 'due-date-header-container' : 'due-date-header-container no-right-margin',
    rowSectionClassName: isOwner ? 'due-date-picker' : 'due-date-picker no-right-margin'
  }
])

const ActivityTable = ({ data, onSuccess, isOwner, }) => {
  const [focusedHash, setFocusedHash] = React.useState({})

  const classroomActivityArray = Array.from(data.classroomActivities).map(ca => ca[1])

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
    api.changeActivityPackOrder(data.unitId, newActivityOrder, () => onSuccess(null), null)
  }

  const activityRows = classroomActivityArray.map(activity => {
    const toolIcon = imageTagForClassification(activity.activityClassificationId)
    const previewLink = <a href={`/activity_sessions/anonymous?activity_id=${activity.activityId}`} tabIndex={-1}>{activity.name}</a>
    activity.toolAndNameSection = (<a className="interactive-wrapper focus-on-light" href={`/activity_sessions/anonymous?activity_id=${activity.activityId}`} id={`tool-and-name-section-${activity.uaId}`}>
      <span className="tool-icon-wrapper">{toolIcon}</span>
      {previewLink}
    </a>)

    const startDate = activity.dueDate ? moment(activity.dueDate) : null
    const focused = focusedHash[activity.uaId]
    const dropdownIconStyle = focused ? { transform: 'rotate(180deg)', } : null;

    const placeholderText = startDate ? startDate.format('MM/DD/YYYY') : 'No due date'

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
    activity.removable = true
    activity.id = activity.uaId
    return activity
  })
  return (<DataTable
    headers={tableHeaders(isOwner)}
    isReorderable={isOwner}
    removeRow={hideUnitActivity}
    reorderCallback={reorderCallback}
    rows={activityRows}
    showRemoveIcon={isOwner}
  />)
}

export default ActivityTable
