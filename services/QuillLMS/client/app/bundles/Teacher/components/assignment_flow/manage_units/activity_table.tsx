import * as React from 'react'
import * as moment from 'moment';

import CopyModal from './copy_modal'
import RemoveActivityModal from './remove_activity_modal';

import * as api from '../../modules/call_api';
import {
  formatDateTimeForDisplay,
  DatePickerContainer,
  DUE_DATE_DEFAULT_TEXT,
  PUBLISH_DATE_DEFAULT_TEXT,
  INVALID_DATES_SNACKBAR_COPY,
} from '../../../helpers/unitActivityDates'
import { requestPut } from '../../../../../modules/request/index';
import { DataTable, Tooltip, publishedIcon, scheduledIcon, Snackbar, defaultSnackbarTimeout, } from '../../../../Shared/index'
import useSnackbarMonitor from '../../../../Shared/hooks/useSnackbarMonitor'
import { getIconForActivityClassification } from '../../../../Shared/libs';

const shareActivitySrc = `${import.meta.env.VITE_PROCESS_ENV_CDN_URL}/images/icons/icons-share.svg`

const publishedIconImage = <img alt={publishedIcon.alt} className="published-icon" src={publishedIcon.src} />
const scheduledIconImage = <img alt={scheduledIcon.alt} className="scheduled-icon" src={scheduledIcon.src} />

export const AVERAGE_FONT_WIDTH = 7

const PUBLISH_DATE_ATTRIBUTE_KEY = 'publish_date'
const DUE_DATE_ATTRIBUTE_KEY = 'due_date'

const STAGGERED_RELEASE_DATE_TEXT = "This activity is set for staggered release. This means that it will be unlocked when a student completes the previous activity pack in the sequence. As a result, you cannot set the publish date or due date."

const tableHeaders = (isOwner) => ([
  {
    name: <span className="tool-and-name-header"><span>Tool</span><span>Activity</span></span>,
    attribute: 'toolAndNameSection',
    width: isOwner ? '624px' : '764px',
    rowSectionClassName: 'tool-and-name-section'
  },
  {
    name: (
      <Tooltip
        tooltipText="When you schedule an activity, it is displayed in your dashboard, but it is hidden from a student until the publish date."
        tooltipTriggerText={<span className="publish-date-header">Publish date</span>}
      />
    ),
    attribute: 'publishDatePicker',
    width: isOwner ? '140px' : '110px',
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
    width: isOwner ? '135px' : '110px',
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
  const [showRemoveActivityModal, setShowRemoveActivityModal] = React.useState(false)
  const [unitActivityIdToRemove, setUnitActivityIdToRemove] = React.useState(null)
  const [erroredUnitActivityIds, setErroredUnitActivityIds] = React.useState([])
  const [showSnackbar, setShowSnackbar] = React.useState(false)
  const [snackbarText, setSnackbarText] = React.useState('')

  useSnackbarMonitor(showSnackbar, setShowSnackbar, defaultSnackbarTimeout)

  React.useEffect(() => {
    setErroredUnitActivityIds([])
  }, [data])

  function removeActivity(unitActivityId) {
    requestPut(`${import.meta.env.VITE_DEFAULT_URL}/teachers/unit_activities/${unitActivityId}/hide`, {}, () => onSuccess('Activity removed'))
    setShowRemoveActivityModal(false)
  }

  function closeDatePicker(date, unitActivityId, dateAttributeKey) {
    const activity = classroomActivityArray.find(act => act.uaId === unitActivityId)
    const activityHasDueDateBeforePublishDate = date && (dateAttributeKey === PUBLISH_DATE_ATTRIBUTE_KEY ? date >= moment.utc(activity.dueDate) : date <= moment.utc(activity.publishDate))
    if (activityHasDueDateBeforePublishDate) {
      setErroredUnitActivityIds([unitActivityId])
      setSnackbarText(INVALID_DATES_SNACKBAR_COPY)
      setShowSnackbar(true)
    } else {
      const formattedDate = date || null
      requestPut(`/teachers/unit_activities/${unitActivityId}`, { unit_activity: { [dateAttributeKey]: formattedDate, } }, () => onSuccess());
    }
  }

  function closeCopyPublishDateModal() { setShowCopyPublishDateModal(false) }

  function closeCopyDueDateModal() { setShowCopyDueDateModal(false) }

  function closeRemoveActivityModal() { setShowRemoveActivityModal(false) }

  function openCopyPublishDateModal() { setShowCopyPublishDateModal(true) }

  function openCopyDueDateModal() { setShowCopyDueDateModal(true) }

  function openRemoveActivityModal(unitActivityId) {
    setUnitActivityIdToRemove(unitActivityId)
    setShowRemoveActivityModal(true)
  }

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

  function getActivityNameToRemove() {
    return classroomActivityArray.find(act => act.uaId === unitActivityIdToRemove).name
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

    const showCopyToAll = i === 0 && activityOrder.length > 1 && !activity.staggered

    if (activity.staggered) {
      activityDueDatePicker = (
        <Tooltip
          tooltipText={STAGGERED_RELEASE_DATE_TEXT}
          tooltipTriggerText={activityDueDatePicker}
        />
      )

      activityPublishDatePicker = (
        <Tooltip
          tooltipText={STAGGERED_RELEASE_DATE_TEXT}
          tooltipTriggerText={activityPublishDatePicker}
        />
      )
    } else if (isOwner) {
      activityDueDatePicker = (
        <DatePickerContainer
          closeFunction={(date) => closeDatePicker(date, activity.uaId, DUE_DATE_ATTRIBUTE_KEY)}
          defaultText={DUE_DATE_DEFAULT_TEXT}
          handleClickCopyToAll={openCopyDueDateModal}
          initialValue={dueDateInMoment}
          key={dueDateInMoment ? formatDateTimeForDisplay(dueDateInMoment) : activity.uaId}
          showCopyToAll={showCopyToAll}
        />
      )

      activityPublishDatePicker = (
        <DatePickerContainer
          closeFunction={(date) => closeDatePicker(date, activity.uaId, PUBLISH_DATE_ATTRIBUTE_KEY)}
          defaultText={PUBLISH_DATE_DEFAULT_TEXT}
          handleClickCopyToAll={openCopyPublishDateModal}
          icon={activity.scheduled ? scheduledIconImage : publishedIconImage}
          initialValue={publishDateInMoment}
          key={publishDateInMoment ? formatDateTimeForDisplay(publishDateInMoment) : activity.uaId}
          showCopyToAll={showCopyToAll}
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
    activity.className += showCopyToAll ? ' show-copy-to-all' : ''
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
      {showRemoveActivityModal && (
        <RemoveActivityModal
          activityName={getActivityNameToRemove()}
          closeFunction={closeRemoveActivityModal}
          removeFunction={() => removeActivity(unitActivityIdToRemove)}
        />
      )}
      <DataTable
        className={isOwner ? 'is-owner' : ''}
        headers={tableHeaders(isOwner)}
        isReorderable={isOwner}
        removeRow={openRemoveActivityModal}
        reorderCallback={reorderCallback}
        rows={activityRows}
        showRemoveIcon={isOwner}
      />
    </React.Fragment>
  )
}

export default ActivityTable
