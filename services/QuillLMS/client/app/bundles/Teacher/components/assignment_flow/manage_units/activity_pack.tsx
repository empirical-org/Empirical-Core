import * as React from 'react'
import { SingleDatePicker } from 'react-dates'
import moment from 'moment';

import * as api from '../../modules/call_api';
import {
  Tooltip,
  Snackbar,
  Input,
  defaultSnackbarTimeout,
  DataTable
} from '../../../../Shared/index'
import useSnackbarMonitor from '../../../../Shared/hooks/useSnackbarMonitor'
import { addKeyDownListener, } from '../../../../Shared/hooks/addKeyDownListener'
import { requestPut } from '../../../../../modules/request/index.js';

const multipleAccountSrc = `${process.env.CDN_URL}/images/icons/icons-account-multiple-check.svg`
const multipleAccountOutlinedSrc = `${process.env.CDN_URL}/images/icons/icons-account-multiple-check-outlined.svg`
const expandSrc = `${process.env.CDN_URL}/images/icons/expand.svg`
const renameSrc = `${process.env.CDN_URL}/images/icons/icons-rename.svg`
const removeInCircleSrc = `${process.env.CDN_URL}/images/icons/remove-in-circle.svg`
const lockSrc = `${process.env.CDN_URL}/images/icons/icons-lock.svg`

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
    headerClassName: isOwner ? '' : 'no-right-margin',
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
    requestPut(`/teachers/unit_activities/${unitActivityId}`, { unit_activity: { due_date: formattedDate, } }, onSuccess);
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

const ArchiveModal = ({ onSuccess, closeModal, unitId, unitName, }) => {
  function handleArchiveUnitButtonClick() {
    requestPut(`/teachers/units/${unitId}/hide`, {}, () => onSuccess('Activity pack deleted'))
  }

  return (<div className="modal-container archive-activity-pack-modal-container">
    <div className="modal-background" />
    <div className="archive-activity-pack-modal quill-modal modal-body">
      <div>
        <h3 className="title">Delete this activity pack?</h3>
      </div>
      <div className="archive-activity-pack-modal-text">
        <p>If you delete the activity pack &#34;{unitName},&#34; you will no longer have access to it on the Student Reports page. Students who completed or were assigned activities will no longer be able to access them.</p>
      </div>
      <div className="form-buttons">
        <button className="quill-button outlined secondary medium" onClick={closeModal} type="button">Cancel</button>
        <button className="quill-button contained primary medium" onClick={handleArchiveUnitButtonClick} type="button">Delete</button>
      </div>
    </div>
  </div>)
}

const RenameModal = ({ onSuccess, closeModal, unitId, unitName, }) => {
  const [name, setName] = React.useState(unitName)
  const [errors, setErrors] = React.useState({})
  const [timesSubmitted, setTimesSubmitted] = React.useState(0)

  function handleNameChange(event) {
    setName(event.target.value)
  }

  function renameActivityPack() {
    api.changeActivityPackName(
      unitId,
      name,
      () => onSuccess('Activity pack renamed'),
      (response) => {
        setErrors(response.body.errors)
        setTimesSubmitted(timesSubmitted + 1)
      }
    )
  }

  let saveButtonClass = 'quill-button contained primary medium';
  if (!name.length || unitName === name) {
    saveButtonClass += ' disabled';
  }

  return (<div className="modal-container rename-activity-pack-modal-container">
    <div className="modal-background" />
    <div className="rename-activity-pack-modal quill-modal modal-body">
      <div>
        <h3 className="title">Rename your activity pack</h3>
      </div>
      <Input
        className="name"
        error={errors.name}
        handleChange={handleNameChange}
        label="Activity pack name"
        timesSubmitted={timesSubmitted}
        type="text"
        value={name}
      />
      <div className="form-buttons">
        <button className="quill-button outlined secondary medium" onClick={closeModal} type="button">Cancel</button>
        <button className={saveButtonClass} onClick={renameActivityPack} type="button">Save</button>
      </div>
    </div>
  </div>)

}

const IndividualClassroom = ({ classroom, }) => {
  // following code accounts for CSS rules that determine width
  let maxWidth = 840
  if (window.innerWidth < 985) { maxWidth = 635 }
  if (window.innerWidth < 800) { maxWidth = window.innerWidth - 32 - 32 - 16 }

  const classroomNameElement = classroom.name.length * AVERAGE_FONT_WIDTH >= maxWidth ? <Tooltip tooltipText={classroom.name} tooltipTriggerText={classroom.name} tooltipTriggerTextClass="tooltip-trigger-text" /> : <span>{classroom.name}</span>

  return (<div className="individual-classroom">
    <img alt="Multiple people outlined with a check icon" src={multipleAccountOutlinedSrc} />
    <div className="name-and-count">
      {classroomNameElement}
      <span className="count">{classroom.assignedStudentCount} of {classroom.totalStudentCount} student{classroom.totalStudentCount === 1 ? '' : 's'}</span>
    </div>
  </div>)
}

const RightSide = ({
  handleClickShowRename,
  handleClickShowRemove
}) => (
  <div className="right-side">
    <button className="interactive-wrapper focus-on-light" onClick={handleClickShowRename} type="button">
      <img alt="Rename icon" src={renameSrc} />
      <span>Rename activity pack</span>
    </button>
    <button className="interactive-wrapper focus-on-light" onClick={handleClickShowRemove} type="button">
      <img alt="Remove icon" src={removeInCircleSrc} />
      <span>Delete activity pack</span>
    </button>
  </div>
)

const ActivityPack = ({
  data,
  editActivityPack,
  getUnits,
}) => {
  const [showIndividualClassroomInfo, setShowIndividualClassroomInfo] = React.useState(false)
  const [showSnackbar, setShowSnackbar] = React.useState(false)
  const [snackbarText, setSnackbarText] = React.useState('')
  const [showModal, setShowModal] = React.useState(false)

  useSnackbarMonitor(showSnackbar, setShowSnackbar, defaultSnackbarTimeout)

  function toggleShowIndividualClassroomInfo() { setShowIndividualClassroomInfo(!showIndividualClassroomInfo) }

  function handleClickShowRename() { setShowModal('rename') }

  function handleClickShowRemove() { setShowModal('archive') }

  function closeModal() { setShowModal(false) }

  function onSuccess(snackbarCopy) {
    getUnits()
    closeModal()
    if (snackbarCopy) {
      setSnackbarText(snackbarCopy)
      setShowSnackbar(true)
    }
  }

  let totalStudents = 0
  data.classrooms.forEach(classroom => totalStudents += Number(classroom.assignedStudentCount))
  const totalClassroomInfoCopy = `Assigned: ${data.classrooms.length} class${data.classrooms.length === 1 ? '' : 'es'}, ${totalStudents} student${totalStudents === 1 ? '' : 's'}`

  let individualClassroomInfo

  if (showIndividualClassroomInfo) {
    individualClassroomInfo = data.classrooms.map(classroom => <IndividualClassroom classroom={classroom} key={classroom.id} />)
  }

  const firstActivity = Array.from(data.classroomActivities)[0][1]
  const isOwner = firstActivity.ownedByCurrentUser

  return (<section className="activity-pack">
    <Snackbar text={snackbarText} visible={showSnackbar} />
    {showModal === 'rename' && <RenameModal
      closeModal={closeModal}
      onSuccess={onSuccess}
      unitId={data.unitId}
      unitName={data.unitName}
    />}
    {showModal === 'archive' && <ArchiveModal
      closeModal={closeModal}
      onSuccess={onSuccess}
      unitId={data.unitId}
      unitName={data.unitName}
    />}
    <div className="top-section">
      <div className="top-section-header">
        {isOwner && <RightSide handleClickShowRemove={handleClickShowRemove} handleClickShowRename={handleClickShowRename} />}
        <div className="left-side">
          <h2>{data.unitName}</h2>
          {!isOwner && (<div className="coteacher-explanation">
            <img alt="Lock" src={lockSrc} />
            <div>
              <p>Created by {firstActivity.ownerName}</p>
              <span>Since you did not create this pack, you are unable to edit it.</span>
            </div>
          </div>)}
          <p className={`total-classroom-info ${showIndividualClassroomInfo ? 'is-open' : 'is-closed'}`}>
            <img alt="Multiple people with a check icon" src={multipleAccountSrc} />
            <button className="interactive-wrapper focus-on-light" onClick={toggleShowIndividualClassroomInfo} type="button">
              <span>{totalClassroomInfoCopy}</span>
              <img alt="" src={expandSrc} />
            </button>
          </p>
        </div>
      </div>
      {individualClassroomInfo}
      {isOwner && <a className="quill-button secondary outlined medium focus-on-light" href={`/teachers/classrooms/activity_planner/units/${data.unitId}/students/edit`}>Add/remove students assigned</a>}
    </div>
    <ActivityTable
      data={data}
      isOwner={isOwner}
      onSuccess={onSuccess}
    />
    {isOwner && <a className="quill-button secondary medium focus-on-light outlined add-activities-button" href={`/teachers/classrooms/activity_planner/units/${data.unitId}/activities/edit/${encodeURIComponent(data.unitName)}`}>Add activities</a>}
  </section>)
}

export default ActivityPack
