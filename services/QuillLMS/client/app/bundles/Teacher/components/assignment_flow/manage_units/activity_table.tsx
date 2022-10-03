import * as React from 'react'
import Datetime from 'react-datetime';
import * as moment from 'moment';

import * as api from '../../modules/call_api';
import { formatDateTimeForDisplay, } from '../../../helpers/unitActivityDates'
import { requestPut } from '../../../../../modules/request/index.js';
import { DataTable, Tooltip, copyIcon, publishedIcon, scheduledIcon, Snackbar, defaultSnackbarTimeout, } from '../../../../Shared/index'
import useSnackbarMonitor from '../../../../Shared/hooks/useSnackbarMonitor'
import { getIconForActivityClassification } from '../../../../Shared/libs';

const shareActivitySrc = `${process.env.CDN_URL}/images/icons/icons-share.svg`

const copyImage = <img alt={copyIcon.alt} src={copyIcon.src} />
const publishedIconImage = <img alt={publishedIcon.alt} className="published-icon" src={publishedIcon.src} />
const scheduledIconImage = <img alt={scheduledIcon.alt} className="scheduled-icon" src={scheduledIcon.src} />

export const AVERAGE_FONT_WIDTH = 7

const INVALID_DATES_SNACKBAR_COPY = 'The due date must be after the publish date.'
const DUE_DATE_DEFAULT_TEXT = 'No due date'
const PUBLISH_DATE_DEFAULT_TEXT = 'Right away'

const PUBLISH_DATE_ATTRIBUTE_KEY = 'publish_date'
const DUE_DATE_ATTRIBUTE_KEY = 'due_date'

const CopyModal = ({ attributeName, closeFunction, copyFunction, }) => {
  return (
    <div aria-live="polite" className="modal-container copy-dates-modal-container" tabIndex={-1}>
      <div className="modal-background" />
      <div className="copy-dates-modal quill-modal modal-body">
        <div className="top-section">
          <h1>Copy {attributeName} to all activities?</h1>
          <p>Copying will overwrite the settings you previously entered. Please confirm that you want to continue.</p>
        </div>
        <div className="button-section">
          <button className="quill-button medium secondary outlined focus-on-light" onClick={closeFunction} type="button">Cancel</button>
          <button className="quill-button medium primary contained focus-on-light" onClick={copyFunction} type="button">Yes, copy</button>
        </div>
      </div>
    </div>
  )
}

const DatePickerContainer = ({ initialValue, defaultText, rowIndex, closeFunction, openModalFunction, icon, }) => {
  const copyDateToAllButton = rowIndex === 0 ? <CopyToAllButton openModalFunction={openModalFunction} /> : ''

  // note: the key in this uncontrolled component is necessary in order for it to rerender when "copy to all" is clicked
  return (
    <div className="date-picker-container">
      <div className="icon-and-datetime-picker">
        {icon}
        <Datetime
          initialValue={initialValue}
          onClose={closeFunction}
          renderInput={(props) => <DatetimeInput defaultText={defaultText} props={props} />}
          utc={true}
        />
      </div>
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

const CopyToAllButton = ({ openModalFunction, }) => (
  <button
    className="interactive-wrapper focus-on-light copy-to-all-button"
    onClick={openModalFunction}
    type="button"
  >
    {copyImage}
    <span>Copy to all</span>
  </button>
)

const tableHeaders = (isOwner) => ([
  {
    name: <span className="tool-and-name-header"><span>Tool</span><span>Activity</span></span>,
    attribute: 'toolAndNameSection',
    width: isOwner ? '460px' : '577px',
    rowSectionClassName: 'tool-and-name-section'
  },
  {
    name: (
      <Tooltip
        tooltipText="When you schedule an activity, it is displayed in your dashboard, but it is hidden from a student until the publish date."
        tooltipTriggerText={<span className="publish-date-header">Publish date <span>(optional)</span></span>}
      />
    ),
    attribute: 'publishDatePicker',
    width: isOwner ? '126px' : '110px',
    headerClassName: 'publish-date-header-container',
    rowSectionClassName: 'datetime-picker'
  },
  {
    name: (
      <Tooltip
        tooltipText="Display a due date to students for this activity. Students can still access an activity after the due date."
        tooltipTriggerText={<span className="due-date-header">Due date <span>(optional)</span></span>}
      />
    ),
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

  const [activityOrder, setActivityOrder] = React.useState(classroomActivityArray.map(ca => ca.activityId) || [])
  const [showCopyPublishDateModal, setShowCopyPublishDateModal] = React.useState(false)
  const [showCopyDueDateModal, setShowCopyDueDateModal] = React.useState(false)
  const [erroredUnitActivityIds, setErroredUnitActivityIds] = React.useState([])
  const [showSnackbar, setShowSnackbar] = React.useState(false)
  const [snackbarText, setSnackbarText] = React.useState('')

  useSnackbarMonitor(showSnackbar, setShowSnackbar, defaultSnackbarTimeout)

  React.useEffect(() => {
    setErroredUnitActivityIds([])
  }, [data])

  function hideUnitActivity(unitActivityId) {
    requestPut(`${process.env.DEFAULT_URL}/teachers/unit_activities/${unitActivityId}/hide`, {}, () => onSuccess('Activity removed'))
  }

  function closeDatePicker(date, unitActivityId, dateAttributeKey) {
    const activitiesWithEarlierDueDates = classroomActivityArray.filter(act => act.uaId === unitActivityId && (dateAttributeKey === PUBLISH_DATE_ATTRIBUTE_KEY ? date >= moment.utc(act.dueDate) : date <= moment.utc(act.publishDate)))
    if (date && activitiesWithEarlierDueDates.length) {
      setErroredUnitActivityIds(activitiesWithEarlierDueDates.map(a => a.uaId))
      setSnackbarText(INVALID_DATES_SNACKBAR_COPY)
      setShowSnackbar(true)
    } else {
      const formattedDate = date ? date : null
      requestPut(`/teachers/unit_activities/${unitActivityId}`, { unit_activity: { [dateAttributeKey]: formattedDate, } }, () => onSuccess());
    }
  }

  function closeCopyPublishDateModal() { setShowCopyPublishDateModal(false) }

  function closeCopyDueDateModal() { setShowCopyDueDateModal(false) }

  function openCopyPublishDateModal() { setShowCopyPublishDateModal(true) }

  function openCopyDueDateModal() { setShowCopyDueDateModal(true) }

  function copyPublishDateToAll() {
    const publishDate = classroomActivityArray[0].publishDate
    const activitiesWithEarlierDueDates = classroomActivityArray.filter(act => publishDate >= act.dueDate)
    if (publishDate && activitiesWithEarlierDueDates.length) {
      setErroredUnitActivityIds(activitiesWithEarlierDueDates.map(a => a.uaId))
      setSnackbarText(INVALID_DATES_SNACKBAR_COPY)
      setShowSnackbar(true)
    } else {
      copyDateToAll(publishDate, PUBLISH_DATE_ATTRIBUTE_KEY)
    }
    setShowCopyPublishDateModal(false)
  }

  function copyDueDateToAll() {
    const dueDate = classroomActivityArray[0].dueDate
    const activitiesWithEarlierDueDates = classroomActivityArray.filter(act => dueDate <= act.publishDate)
    if (dueDate && activitiesWithEarlierDueDates.length) {
      setErroredUnitActivityIds(activitiesWithEarlierDueDates.map(a => a.uaId))
      setSnackbarText(INVALID_DATES_SNACKBAR_COPY)
      setShowSnackbar(true)
    } else {
      copyDateToAll(dueDate, DUE_DATE_ATTRIBUTE_KEY)
    }
    setShowCopyDueDateModal(false)
  }

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
          closeFunction={(date) => closeDatePicker(date, activity.uaId, DUE_DATE_ATTRIBUTE_KEY)}
          defaultText={DUE_DATE_DEFAULT_TEXT}
          initialValue={dueDateInMoment}
          key={dueDateInMoment ? dueDateInMoment.date() : activity.uaId}
          openModalFunction={openCopyDueDateModal}
          rowIndex={i}
          unitActivityId={activity.uaId}
        />
      )

      activityPublishDatePicker = (
        <DatePickerContainer
          closeFunction={(date) => closeDatePicker(date, activity.uaId, PUBLISH_DATE_ATTRIBUTE_KEY)}
          defaultText={PUBLISH_DATE_DEFAULT_TEXT}
          icon={activity.scheduled ? scheduledIconImage : publishedIconImage}
          initialValue={publishDateInMoment}
          key={publishDateInMoment ? publishDateInMoment.date() : activity.uaId}
          openModalFunction={openCopyPublishDateModal}
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
    activity.className = erroredUnitActivityIds.includes(activity.uaId) ? 'checked' : ''
    return activity
  }).filter(Boolean)
  return (
    <React.Fragment>
      <Snackbar text={snackbarText} visible={showSnackbar} />
      {showCopyDueDateModal && (
        <CopyModal
          attributeName="due date"
          closeFunction={closeCopyDueDateModal}
          copyFunction={copyDueDateToAll}
        />
      )}
      {showCopyPublishDateModal && (
        <CopyModal
          attributeName="publish date"
          closeFunction={closeCopyPublishDateModal}
          copyFunction={copyPublishDateToAll}
        />
      )}
      <DataTable
        className={isOwner ? 'is-owner' : ''}
        headers={tableHeaders(isOwner)}
        isReorderable={isOwner}
        removeRow={hideUnitActivity}
        reorderCallback={reorderCallback}
        rows={activityRows}
        showRemoveIcon={isOwner}
      />
    </React.Fragment>
  )
}

export default ActivityTable
