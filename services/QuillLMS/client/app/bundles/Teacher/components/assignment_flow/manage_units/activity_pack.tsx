import * as React from 'react'

import * as api from '../../modules/call_api';
import { Tooltip, Snackbar, Input, defaultSnackbarTimeout, } from '../../../../Shared/index'
import useSnackbarMonitor from '../../../../Shared/hooks/useSnackbarMonitor'
import { requestPut } from '../../../../../modules/request/index.js';

const multipleAccountSrc = `${process.env.CDN_URL}/images/icons/icons-account-multiple-check.svg`
const multipleAccountOutlinedSrc = `${process.env.CDN_URL}/images/icons/icons-account-multiple-check-outlined.svg`
const expandSrc = `${process.env.CDN_URL}/images/icons/expand.svg`
const renameSrc = `${process.env.CDN_URL}/images/icons/icons-rename.svg`
const removeInCircleSrc = `${process.env.CDN_URL}/images/icons/remove-in-circle.svg`

export const AVERAGE_FONT_WIDTH = 7

const ArchiveModal = ({ archiveSuccess, closeModal, unitId, unitName, }) => {
  function handleArchiveUnitButtonClick() {
    requestPut(`/teachers/units/${unitId}/hide`, {}, archiveSuccess)
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

const RenameModal = ({ renameSuccess, closeModal, unitId, unitName, }) => {
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
      renameSuccess,
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

const ActivityPack = ({
  data,
  editActivityPack,
  hideActivityPackActivity,
  updateDueDate,
  updateMultipleDueDates,
  getUnits,
}) => {
  const [showIndividualClassroomInfo, setShowIndividualClassroomInfo] = React.useState(false)
  const [showSnackbar, setShowSnackbar] = React.useState(false)
  const [snackbarText, setSnackbarText] = React.useState('')
  const [showRenameModal, setShowRenameModal] = React.useState(false)
  const [showArchiveModal, setShowArchiveModal] = React.useState(false)

  useSnackbarMonitor(showSnackbar, setShowSnackbar, defaultSnackbarTimeout)

  function toggleShowIndividualClassroomInfo() { setShowIndividualClassroomInfo(!showIndividualClassroomInfo) }

  function handleClickShowRename() { setShowRenameModal(true) }

  function handleClickShowRemove() { setShowArchiveModal(true) }

  function closeRenameModal() { setShowRenameModal(false) }

  function closeArchiveModal() { setShowArchiveModal(false) }

  function renameSuccess() {
    getUnits()
    closeRenameModal()
    setSnackbarText('Activity pack renamed')
    setShowSnackbar(true)
  }

  function archiveSuccess() {
    getUnits()
    closeArchiveModal()
    setSnackbarText('Activity pack deleted')
    setShowSnackbar(true)
  }

  let totalStudents = 0
  data.classrooms.forEach(classroom => totalStudents += Number(classroom.assignedStudentCount))
  const totalClassroomInfoCopy = `Assigned: ${data.classrooms.length} class${data.classrooms.length === 1 ? '' : 'es'}, ${totalStudents} student${totalStudents === 1 ? '' : 's'}`

  let individualClassroomInfo

  if (showIndividualClassroomInfo) {
    individualClassroomInfo = data.classrooms.map(classroom => <IndividualClassroom classroom={classroom} key={classroom.id} />)
  }

  return (<section className="activity-pack">
    <Snackbar text={snackbarText} visible={showSnackbar} />
    {showRenameModal && <RenameModal
      closeModal={closeRenameModal}
      renameSuccess={renameSuccess}
      unitId={data.unitId}
      unitName={data.unitName}
    />}
    {showArchiveModal && <ArchiveModal
      archiveSuccess={archiveSuccess}
      closeModal={closeArchiveModal}
      unitId={data.unitId}
      unitName={data.unitName}
    />}
    <div className="top-section">
      <div className="top-section-header">
        <div className="left-side">
          <h2>{data.unitName}</h2>
          <p className={`total-classroom-info ${showIndividualClassroomInfo ? 'is-open' : 'is-closed'}`}>
            <img alt="Multiple people with a check icon" src={multipleAccountSrc} />
            <button className="interactive-wrapper focus-on-light" onClick={toggleShowIndividualClassroomInfo} type="button">
              <span>{totalClassroomInfoCopy}</span>
              <img alt="" src={expandSrc} />
            </button>
          </p>
        </div>
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
      </div>
      {individualClassroomInfo}
      <a className="quill-button secondary outlined medium focus-on-light" href={`/teachers/classrooms/activity_planner/units/${data.unitId}/students/edit`}>Add/remove students assigned</a>
    </div>
  </section>)
}

export default ActivityPack
