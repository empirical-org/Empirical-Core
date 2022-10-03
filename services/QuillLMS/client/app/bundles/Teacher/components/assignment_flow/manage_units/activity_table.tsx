import * as React from 'react'
import Datetime from 'react-datetime';
import * as moment from 'moment';

import * as api from '../../modules/call_api';
import { requestPut } from '../../../../../modules/request/index.js';
import { DataTable, copyIcon, } from '../../../../Shared/index'
import { addKeyDownListener, } from '../../../../Shared/hooks/addKeyDownListener'
import { getIconForActivityClassification } from '../../../../Shared/libs';

const shareActivitySrc = `${process.env.CDN_URL}/images/icons/icons-share.svg`

const copyImage = <img alt={copyIcon.alt} src={copyIcon.src} />

export const AVERAGE_FONT_WIDTH = 7

const DUE_DATE_DEFAULT_TEXT = 'No due date'
const PUBLISH_DATE_DEFAULT_TEXT = 'Right away'

const DatePickerContainer = ({ initialValue, defaultText, rowIndex, closeFunction, copyFunction, }) => {
  const copyDateToAllButton = rowIndex === 0 ? <CopyToAllButton copyFunction={copyFunction} /> : ''

  // note: the key in this uncontrolled component is necessary in order for it to rerender when "copy to all" is clicked
  return (
    <div className="date-picker-container">
      <Datetime
        initialValue={initialValue}
        onClose={closeFunction}
        renderInput={(props) => <DatetimeInput defaultText={defaultText} props={props} />}
        utc={true}
      />
      {copyDateToAllButton}
    </div>
  )
}

const DatetimeInput = ({ props, defaultText, }) => {
  const { onClick, value, } = props
  const valueInMoment = value ? moment.utc(value) : null
  const buttonText = valueInMoment ? formatDateTimeForDisplay(valueInMoment) : defaultText
  return (
    <button className="interactive-wrapper focus-on-light datetime-input" onClick={onClick} type="button">
      <span className="text">{buttonText}</span>
      <img alt="dropdown indicator" className="dropdown-indicator" src="https://assets.quill.org/images/icons/dropdown.svg" />
    </button>
  )
}

const CopyToAllButton = ({ copyFunction, }) => (
  <button
    className="interactive-wrapper focus-on-light copy-to-all-button"
    onClick={copyFunction}
    type="button"
  >
    {copyImage}
    <span>Copy to all</span>
  </button>
)

const formatDateTimeForDisplay = (datetime) => {
  if (datetime.minutes()) {
    return datetime.format('MMM D, h:mma')
  }
  return datetime.format('MMM D, ha')
}

const tableHeaders = (isOwner) => ([
  {
    name: <span className="tool-and-name-header"><span>Tool</span><span>Activity</span></span>,
    attribute: 'toolAndNameSection',
    width: isOwner ? '460px' : '577px',
    rowSectionClassName: 'tool-and-name-section'
  },
  {
    name: <span className="publish-date-header">Publish date <span>(optional)</span></span>,
    attribute: 'publishDatePicker',
    width: isOwner ? '126px' : '110px',
    headerClassName: 'publish-date-header-container',
    rowSectionClassName: 'datetime-picker'
  },
  {
    name: <span className="due-date-header">Due date <span>(optional)</span></span>,
    attribute: 'dueDatePicker',
    width: isOwner ? '126px' : '110px',
    headerClassName: isOwner ? 'due-date-header-container' : 'due-date-header-container no-right-margin',
    rowSectionClassName: isOwner ? 'datetime-picker' : 'datetime-picker no-right-margin'
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

  function closeDatePicker(date, unitActivityId, dateAttributeKey) {
    const formattedDate = date ? date : null
    requestPut(`/teachers/unit_activities/${unitActivityId}`, { unit_activity: { [dateAttributeKey]: formattedDate, } }, () => onSuccess());
  }

  function copyPublishDateToAll() { copyDateToAll(classroomActivityArray[0].publishDate, 'publish_date') }

  function copyDueDateToAll() { copyDateToAll(classroomActivityArray[0].dueDate, 'due_date') }

  function copyDateToAll(date, dateAttributeKey) {
    const unitActivityIds = classroomActivityArray.map(ca => ca.uaId)
    requestPut('/teachers/unit_activities/update_multiple_dates', { unit_activity_ids: unitActivityIds, date: date, date_attribute: dateAttributeKey }, () => onSuccess());
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

  const activityRows = activityOrder.map((activityId, i) => {
    const activity = classroomActivityArray.find(act => act.activityId === activityId)
    if (!activity){ return }
    const toolIcon = getIconForActivityClassification(activity.activityClassificationId)
    const previewLink = <a href={`/activity_sessions/anonymous?activity_id=${activity.activityId}`} tabIndex={-1}>{activity.name}</a>
    activity.toolAndNameSection = (<a className="interactive-wrapper focus-on-light" href={`/activity_sessions/anonymous?activity_id=${activity.activityId}`} id={`tool-and-name-section-${activity.uaId}`}>
      <span className="tool-icon-wrapper">{toolIcon}</span>
      {previewLink}
    </a>)

    const dueDateInMoment = activity.dueDate ? moment.utc(activity.dueDate) : null
    const publishDateInMoment = activity.publishDate ? moment.utc(activity.publishDate) : null

    let activityDueDatePicker = dueDateInMoment ? formatDateTimeForDisplay(dueDateInMoment) : DUE_DATE_DEFAULT_TEXT
    let activityPublishDatePicker = publishDateInMoment ? formatDateTimeForDisplay(publishDateInMoment) : PUBLISH_DATE_DEFAULT_TEXT

    if (isOwner) {
      activityDueDatePicker = (
        <DatePickerContainer
          closeFunction={(date) => closeDatePicker(date, activity.uaId, 'due_date')}
          copyFunction={copyDueDateToAll}
          defaultText={DUE_DATE_DEFAULT_TEXT}
          initialValue={dueDateInMoment}
          key={dueDateInMoment ? dueDateInMoment.date() : activity.uaId}
          rowIndex={i}
          unitActivityId={activity.uaId}
        />
      )

      activityPublishDatePicker = (
        <DatePickerContainer
          closeFunction={(date) => closeDatePicker(date, activity.uaId, 'publish_date')}
          copyFunction={copyPublishDateToAll}
          defaultText={PUBLISH_DATE_DEFAULT_TEXT}
          initialValue={publishDateInMoment}
          key={publishDateInMoment ? publishDateInMoment.date() : activity.uaId}
          rowIndex={i}
          unitActivityId={activity.uaId}
        />
      )
    }

    activity.dueDatePicker = activityDueDatePicker
    activity.publishDatePicker = activityPublishDatePicker

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
      className={isOwner ? 'is-owner' : ''}
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
