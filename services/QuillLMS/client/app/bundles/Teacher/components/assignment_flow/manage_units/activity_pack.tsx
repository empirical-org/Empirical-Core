import * as React from 'react'

import ActivityTable from './activity_table'
import ActivityPackUpdateButtons from './activity_pack_update_buttons'
import IndividualClassroom from './individual_classroom'
import ArchiveModal from './archive_modal'
import RenameModal from './rename_modal'
import CloseUnitModal from './close_unit_modal'
import ReopenUnitModal from './reopen_unit_modal'

import ShareActivityPackModal from '../create_unit/share_activity_pack/shareActivityPackModal';
import { requestGet } from '../../../../../modules/request';

const multipleAccountSrc = `${process.env.CDN_URL}/images/icons/icons-account-multiple-check.svg`
const expandSrc = `${process.env.CDN_URL}/images/icons/expand.svg`
const lockSrc = `${process.env.CDN_URL}/images/icons/icons-lock.svg`

const RENAME = 'rename'
const ARCHIVE = 'archive'
const SHARE = 'share'
const CLOSE = 'close'
const REOPEN = 'reopen'

const ActivityPack = ({
  data,
  getUnits,
  selectedClassroomId,
  showSnackbar,
}) => {
  const [showIndividualClassroomInfo, setShowIndividualClassroomInfo] = React.useState(false)
  const [showModal, setShowModal] = React.useState('')
  const [classrooms, setClassrooms] = React.useState([]);
  const [activityClicked, setActivityClicked] = React.useState(null);

  React.useEffect(() => {
    if(!classrooms.length) {
      requestGet('/teachers/classrooms/retrieve_classrooms_i_teach_for_custom_assigning_activities', (body) => {
        setClassrooms(body.classrooms_and_their_students)
      })
    }
  }, [])

  function toggleShowIndividualClassroomInfo() { setShowIndividualClassroomInfo(!showIndividualClassroomInfo) }

  function handleClickShowRename() { setShowModal(RENAME) }

  function handleClickShowRemove() { setShowModal(ARCHIVE) }

  function handleClickShowCloseUnit() { setShowModal(CLOSE) }

  function handleClickShowReopenUnit() { setShowModal(REOPEN) }

  function handleClickShareActivity() { setShowModal(SHARE) }

  function handleClickShareActivityPack() {
    // clear single selected activity if there was one previously clicked
    setActivityClicked(null)
    setShowModal(SHARE)
  }

  function handleActivityClicked(activity) {
    setActivityClicked(activity);
  }

  function closeModal() { setShowModal('') }

  function onSuccess(snackbarCopy) {
    getUnits()
    closeModal()
    showSnackbar(snackbarCopy)
  }

  function getActivityPackData() {
    const { unitName, classroomActivities } = data
    return {
      name: unitName,
      activityCount: classroomActivities && classroomActivities.length,
      activities: []
    }
  }

  function getSelectedClassroomName() {
    const { classrooms } = data;
    if(classrooms && classrooms.length === 1) {
      return classrooms[0].name;
    }
  }

  function getSelectableClassrooms() {
    const { classrooms } = data;
    return classrooms.map(classroom => classroom.name);
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

  const activityPackUpdateButtons = isOwner && (
    <ActivityPackUpdateButtons
      handleClickShareActivityPack={handleClickShareActivityPack}
      handleClickShowCloseUnit={handleClickShowCloseUnit}
      handleClickShowRemove={handleClickShowRemove}
      handleClickShowRename={handleClickShowRename}
      handleClickShowReopenUnit={handleClickShowReopenUnit}
      isOpen={data.open}
    />
  )

  return (
    <section className="activity-pack">
      {showModal === RENAME && <RenameModal
        closeModal={closeModal}
        onSuccess={onSuccess}
        unitId={data.unitId}
        unitName={data.unitName}
      />}
      {showModal === ARCHIVE && <ArchiveModal
        closeModal={closeModal}
        onSuccess={onSuccess}
        unitId={data.unitId}
        unitName={data.unitName}
      />}
      {showModal === CLOSE && <CloseUnitModal
        closeModal={closeModal}
        onSuccess={onSuccess}
        unitId={data.unitId}
        unitName={data.unitName}
      />}
      {showModal === REOPEN && <ReopenUnitModal
        closeModal={closeModal}
        onSuccess={onSuccess}
        unitId={data.unitId}
        unitName={data.unitName}
      />}
      {showModal === SHARE &&
      <ShareActivityPackModal
        activityPackData={data && getActivityPackData()}
        closeModal={closeModal}
        selectableClassrooms={data && getSelectableClassrooms()}
        selectedClassroomId={selectedClassroomId}
        selectedClassroomName={data && getSelectedClassroomName()}
        singleActivity={activityClicked}
        unitId={data && data.unitId}
      />}
      <div className="activity-pack-top-section">
        <div className="top-section-header">
          {activityPackUpdateButtons}
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
            <div className="individual-classroom-info small-screen">{individualClassroomInfo}</div>
            {isOwner && <a className="quill-button secondary outlined medium focus-on-light" href={`/teachers/classrooms/activity_planner/units/${data.unitId}/students/edit`}>Add/remove students assigned</a>}
          </div>
        </div>
        <div className="individual-classroom-info big-screen">{individualClassroomInfo}</div>
      </div>
      <ActivityTable
        data={data}
        handleActivityClicked={handleActivityClicked}
        handleToggleModal={handleClickShareActivity}
        isOwner={isOwner}
        onSuccess={onSuccess}
      />
      {isOwner && <a className="quill-button secondary medium focus-on-light outlined add-activities-button" href={`/teachers/classrooms/activity_planner/units/${data.unitId}/activities/edit/${encodeURIComponent(data.unitName)}`}>Add activities</a>}
    </section>
  )
}

export default ActivityPack
