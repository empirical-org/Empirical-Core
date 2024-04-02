import moment from 'moment'
import * as React from 'react'
import { useState } from 'react'

import { canvasProvider, classroomProviders, cleverProvider, googleProvider, providerConfigLookup } from './providerHelpers'

import EditStudentAccountModal from './edit_student_account_modal'
import MergeStudentAccountsModal from './merge_student_accounts_modal'
import MoveStudentsModal from './move_students_modal'
import RemoveStudentsModal from './remove_students_modal'
import ResetStudentPasswordModal from './reset_student_password_modal'

import { DataTable, DropdownInput, Tooltip, helpIcon, warningIcon, } from '../../../Shared/index'

const emptyDeskSrc = `${process.env.CDN_URL}/images/illustrations/empty-desks.svg`
const lightBulbSrc = `${process.env.CDN_URL}/images/pages/classrooms/lightbulb.svg`
const questionMarkSrc = `${process.env.CDN_URL}/images/pages/classrooms/question_mark.svg`
const canvasSetupInstructionsPdf = `${process.env.CDN_URL}/documents/setup_instructions_pdfs/canvas_setup_instructions.pdf`
const cleverSetupInstructionsPdf = `${process.env.CDN_URL}/documents/setup_instructions_pdfs/clever_setup_instructions.pdf`
const googleSetupInstructionsPdf = `${process.env.CDN_URL}/documents/setup_instructions_pdfs/google_setup_instructions.pdf`

function activeHeaders(hasClassroomProvider: boolean) {
  const name = {
    width: '205px',
    name: 'Name',
    attribute: 'name'
  }

  const usernameOrEmail = {
    width: hasClassroomProvider ? '280px' : '330px',
    name: 'Username/Email',
    attribute: 'usernameOrEmail'
  }

  const logInMethod = {
    width: '135px',
    name: 'Log-in Method',
    attribute: 'logInMethod'
  }

  const lastActive = {
    width: '110px',
    name: 'Last Active',
    attribute: 'lastActive',
    rowSectionClassName: 'show-overflow'
  }

  const activities = {
    width: '70px',
    name: 'Activities',
    attribute: 'activities',
    rowSectionClassName: 'left-align'
  }

  const synced = {
    width: '50px',
    name: 'Synced',
    attribute: 'synced',
    noTooltip: true,
    rowSectionClassName: 'show-overflow'
  }

  const actions = {
    name: 'Actions',
    attribute: 'actions',
    isActions: true
  }

  return hasClassroomProvider
    ? [name, usernameOrEmail, logInMethod, lastActive, activities, synced, actions]
    : [name, usernameOrEmail, logInMethod, lastActive, activities, actions]
}

function archivedHeaders(hasClassroomProvider: boolean) {
  const name = {
    width: '235px',
    name: 'Name',
    attribute: 'name'
  }

  const usernameOrEmail = {
    width: hasClassroomProvider ? '407px' : '531px',
    name: 'Username/Email',
    attribute: 'usernameOrEmail'
  }

  const synced = {
    width: '124px',
    name: 'Synced',
    attribute: 'synced',
    noTooltip: true,
    rowSectionClassName: 'show-overflow'
  }

  return hasClassroomProvider
    ? [name, usernameOrEmail, synced]
    : [name, usernameOrEmail]
}

enum modalNames {
  editStudentAccountModal = 'editStudentAccountModal',
  resetStudentPasswordModal = 'resetStudentPasswordModal',
  mergeStudentAccountsModal = 'mergeStudentAccountsModal',
  moveStudentsModal = 'moveStudentsModal',
  removeStudentsModal = 'removeStudentsModal',
}

interface ClassroomStudentSectionProps {
  classroom: any;
  classrooms: Array<any>;
  isOwnedByCurrentUser: boolean;
  provider?: string;
  user: any;
  onSuccess: (event) => void;
  inviteStudents?: (event) => void;
  importProviderClassroomStudents?: (event) => void;
  viewAsStudent?: (event) => void;
}

const ClassroomStudentSection = ({
  classroom,
  classrooms,
  importProviderClassroomStudents,
  inviteStudents,
  isOwnedByCurrentUser,
  onSuccess,
  user,
  viewAsStudent,
}: ClassroomStudentSectionProps) => {
  const [selectedStudentIds, setSelectedStudentIds] = useState<Array<string | number>>([])
  const [studentIdsForModal, setStudentIdsForModal] = useState<Array<string | number>>([])
  const [showModal, setShowModal] = useState<modalNames>()

  const allStudentsAreProvider = (provider: string) => {
    return classroom.students.every(student => student.provider === provider)
  }

  const allStudentsAreCanvas = allStudentsAreProvider(canvasProvider)
  const allStudentsAreClever = allStudentsAreProvider(cleverProvider)
  const allStudentsAreGoogle = allStudentsAreProvider(googleProvider)

  const individualStudentActions = () => {
    return {
      editAccount: {
        name: 'Edit account',
        action: (id) => editStudentAccount(id)
      },
      resetPassword: {
        name: 'Reset password',
        action: (id) => resetStudentPassword(id)
      },
      mergeAccounts: {
        name: 'Merge accounts',
        action: (id) => mergeStudentAccounts(id)
      },
      moveClass: {
        name: 'Move class',
        action: (id) => moveClass(id)
      },
      removeFromClass: {
        name: 'Remove from class',
        action: (id) => removeStudentFromClass(id)
      },
      viewAsStudent: {
        name: 'View as student',
        action: (id) => viewAsStudent(id)
      }
    }
  }

  const dropdownActions = () => {
    return {
      editAccount: {
        label: 'Edit account',
        value: editStudentAccount
      },
      resetPassword: {
        label: 'Reset password',
        value: resetStudentPassword
      },
      mergeAccounts: {
        label: 'Merge accounts',
        value: mergeStudentAccounts
      },
      moveClass: {
        label: 'Move class',
        value: moveClass
      },
      removeFromClass: {
        label: 'Remove from class',
        value: removeStudentFromClass
      },
      viewAsStudent: {
        label: 'View as student',
        value: viewAsStudent
      }
    }
  }

  const actionsForIndividualStudent = (student) => {
    const { user_external_id, synced } = student

    const {
      editAccount,
      resetPassword,
      viewAsStudent,
      mergeAccounts,
      moveClass,
      removeFromClass
    } = individualStudentActions()

    if (user_external_id) {
      return synced ? [viewAsStudent] : [viewAsStudent, moveClass, removeFromClass]
    } else if (classrooms.length > 1 && isOwnedByCurrentUser) {
      return [editAccount, resetPassword, viewAsStudent, mergeAccounts, moveClass, removeFromClass]
    } else if (isOwnedByCurrentUser) {
      return [editAccount, resetPassword, viewAsStudent, mergeAccounts, removeFromClass]
    } else {
      return [editAccount, resetPassword, viewAsStudent, removeFromClass]
    }
  }

  const handleSuccess = (successMessage) => {
    setSelectedStudentIds([])
    onSuccess(successMessage)
  }

  const checkRow = (id) => {
    setSelectedStudentIds(selectedStudentIds.concat(id))
  }

  const uncheckRow = (id) => {
    setSelectedStudentIds(selectedStudentIds.filter(selectedId => selectedId !== id))
  }

  const checkAllRows = () => {
    setSelectedStudentIds(classroom.students.map(student => student.id))
  }

  const uncheckAllRows = () => {
    setSelectedStudentIds([])
  }

  const handleClickViewAsStudentButton = () => {
    viewAsStudent(null)
  }

  const onClickViewAsIndividualStudent = (id: string | number) => {
    viewAsStudent(id)
  }

  const selectAction = (action) => {
    action.value()
  }

  const editStudentAccount = (id = null) => {
    // we will only show the edit student account dropdown option when only one student is selected
    setShowModal(modalNames.editStudentAccountModal)
    setStudentIdsForModal([id || selectedStudentIds[0]])
  }

  const resetStudentPassword = (id = null) => {
    // we will only show the reset password account dropdown option when only one student is selected
    setShowModal(modalNames.resetStudentPasswordModal)
    setStudentIdsForModal([id || selectedStudentIds[0]])
  }

  const mergeStudentAccounts = (id = null) => {
    // we will only show the merge student accounts account dropdown option when one or two students are selected
    setShowModal(modalNames.mergeStudentAccountsModal)
    setStudentIdsForModal(id ? [id] : selectedStudentIds)
  }

  const moveClass = (id = null) => {
    // we will show the move class dropdown option when any number of students are selected
    setShowModal(modalNames.moveStudentsModal)
    setStudentIdsForModal(id ? [id] : selectedStudentIds)
  }

  const removeStudentFromClass = (id = null) => {
    // we will show the remove student from class dropdown option when any number of students are selected
    const studentIds = id ? [id] : selectedStudentIds
    setShowModal(modalNames.removeStudentsModal)
    setStudentIdsForModal(id ? [id] : selectedStudentIds)
  }

  const closeModal = () => {
    setShowModal(null)
    setStudentIdsForModal([])
  }

  const renderEditStudentAccountModal = () => {
    if (showModal === modalNames.editStudentAccountModal && studentIdsForModal.length === 1) {
      const student = classroom.students.find(s => s.id === studentIdsForModal[0])
      return (
        <EditStudentAccountModal
          classroom={classroom}
          close={closeModal}
          onSuccess={handleSuccess}
          student={student}
        />
      )
    }
  }

  const renderResetStudentPasswordModal = () => {
    if (showModal === modalNames.resetStudentPasswordModal && studentIdsForModal.length === 1) {
      const student = classroom.students.find(s => s.id === studentIdsForModal[0])
      return (
        <ResetStudentPasswordModal
          classroom={classroom}
          close={closeModal}
          onSuccess={handleSuccess}
          student={student}
        />
      )
    }
  }

  const renderMergeStudentAccountsModal = () => {
    if (showModal === modalNames.mergeStudentAccountsModal) {
      return (
        <MergeStudentAccountsModal
          classroom={classroom}
          close={closeModal}
          onSuccess={handleSuccess}
          selectedStudentIds={studentIdsForModal}
        />
      )
    }
  }

  const renderMoveStudentsModal = () => {
    if (showModal === modalNames.moveStudentsModal) {
      return (
        <MoveStudentsModal
          classroom={classroom}
          classrooms={classrooms}
          close={closeModal}
          onSuccess={handleSuccess}
          selectedStudentIds={studentIdsForModal}
        />
      )
    }
  }

  const renderRemoveStudentsModal = () => {
    if (showModal === modalNames.removeStudentsModal) {
      return (
        <RemoveStudentsModal
          classroom={classroom}
          close={closeModal}
          onSuccess={handleSuccess}
          selectedStudentIds={studentIdsForModal}
        />
      )
    }
  }

  const optionsForStudentActions = () => {
    const anySelectedProviderStudents = selectedStudentIds.some(id => {
      const student = classroom.students.find(s => s.id === id)
      if (!student) { return false }
      return student.external_user_id
    })

    const {
      editAccount,
      resetPassword,
      mergeAccounts,
      moveClass,
      removeFromClass,
      viewAsStudent
    } = dropdownActions()

    if (anySelectedProviderStudents) {
      return [viewAsStudent, removeFromClass]
    } else if (classrooms.length > 1 && isOwnedByCurrentUser) {
      if (selectedStudentIds.length === 1) {
        return [editAccount, resetPassword, viewAsStudent, mergeAccounts, moveClass, removeFromClass]
      } else if (selectedStudentIds.length === 2) {
        return [viewAsStudent, mergeAccounts, moveClass, removeFromClass]
      } else {
        return [viewAsStudent, moveClass, removeFromClass]
      }
    } else if (isOwnedByCurrentUser) {
      if (selectedStudentIds.length === 1) {
        return [editAccount, resetPassword, viewAsStudent, mergeAccounts, removeFromClass]
      } else if (selectedStudentIds.length === 2) {
        return [viewAsStudent, mergeAccounts, removeFromClass]
      } else {
        return [viewAsStudent, removeFromClass]
      }
    } else {
      if (selectedStudentIds.length === 1) {
        return [editAccount, resetPassword, viewAsStudent, removeFromClass]
      } else {
        return [viewAsStudent, removeFromClass]
      }
    }
  }

  const renderStudentActions = () => {
    if (!classroom.visible) { return null }

    return (
      <div className="student-actions-dropdown-wrapper">
        <DropdownInput
          className="student-actions-dropdown"
          disabled={selectedStudentIds.length === 0}
          handleChange={selectAction}
          label="Actions"
          options={optionsForStudentActions()}
        />
        {selectedStudentIds.length === 0 && <Tooltip
          tooltipText="Please select students from the list below to take action"
          tooltipTriggerText={<img alt={warningIcon.alt} src={warningIcon.src} />}
        />}
      </div>
    )
  }

  const renderProviderNoteOfExplanation = () => {
    if (!classroom.visible) { return null }

    if (allStudentsAreGoogle || allStudentsAreClever || allStudentsAreCanvas) {
      let copy: string, header: JSX.Element

      if (allStudentsAreGoogle) {
        header = <h4>This class is managed through <u>Google</u></h4>
        copy = user.classroom_provider === googleProvider
          ? "Your students’ account information is linked to your Google Classroom account. Go to your Google Classroom account to edit your students."
          : "Your students’ account information is on Google Classroom. To enable auto-syncing, you'll need to link your account to Google."
      } else if (allStudentsAreClever) {
        header = <h4>This class is managed through <u>Clever</u></h4>
        copy = user.classroom_provider === cleverProvider
          ? "Your students’ account information is auto-synced from your Clever account. You can modify your Quill class rosters from your Clever account."
          : "Your students’ account information is on Clever.  To enable auto-syncing, you'll need to link your account to Clever."
      } else if (allStudentsAreCanvas) {
        header = <h4>This class is managed through <u>Canvas</u></h4>
        copy = user.classroom_provider === canvasProvider
          ? "Your students’ account information is auto-synced from your Canvas Instance. Go to your Canvas Instance to edit your students."
          : "Your students’ account information is on Canvas. To enable auto-syncing, you'll need to link your account to Canvas."
      }
      return (
        <div className="provider-note-of-explanation">
          <img alt="" src={questionMarkSrc} />
          <div className="provider-note-of-explanation-text">
            {header}
            <p>{copy}</p>
          </div>
        </div>
      )
    }
  }

  const renderDuplicateAccountProTip = () => {
    return (
      <div className="duplicate-account-pro-tip">
        <img alt="" src={lightBulbSrc} />
        <div className="duplicate-account-pro-tip-text">
          <h4>Pro Tip - How to manage duplicate accounts</h4>
          <p>If a student has multiple accounts that were created manually (with a Quill password), you can merge those accounts together. However, Google, Clever or Canvas accounts cannot be merged together. Instead, if a student has a duplicate Google, Clever or Canvas account, go to the “Actions” menu and select the “remove the student” option for the duplicate account.</p>
        </div>
      </div>
    )
  }

  const syncedStatus = (student: any, classroomProvider: string) => {
    const { synced } = student

    if (synced === undefined || synced === null) { return '' }
    if (synced) { return 'Yes' }

    return (
      <Tooltip
        tooltipText={`This student is no longer in this class in ${classroomProvider}`}

        tooltipTriggerText={
          <div className="text-and-icon-wrapper">
            <span>No&nbsp;</span>
            <img
              alt={helpIcon.alt}
              src={helpIcon.src}
            />
          </div>
        }
      />
    )
  }

  const logInMethod = ({ email, provider }) => {
    if (provider === googleProvider) { return 'Google or email' }
    if (provider === cleverProvider) { return 'Clever' }
    if (provider === canvasProvider) { return 'Canvas' }
    if (email) { return 'Username or email' }

    return 'Username'
  }

  const renderStudentDataTable = () => {
    const { classroomProvider } = classroom
    const hasClassroomProvider = classroomProvider !== undefined

    const rows = classroom.students.map(student => {
      const { name, username, email, id, provider, last_active, number_of_completed_activities, } = student
      const checked = !!selectedStudentIds.includes(id)
      const synced = syncedStatus(student, classroomProvider)

      return {
        synced,
        name,
        id,
        usernameOrEmail: email || username,
        checked,
        logInMethod: logInMethod({ email, provider }),
        lastActive: last_active ? moment(last_active).format('MM/DD/YY HH:mm') : '',
        activities: number_of_completed_activities,
        actions: classroom.visible ? actionsForIndividualStudent(student) : null
      }
    })

    return (
      <DataTable
        checkAllRows={checkAllRows}
        checkRow={checkRow}
        className='show-overflow'
        headers={classroom.visible ? activeHeaders(hasClassroomProvider) : archivedHeaders(hasClassroomProvider)}
        rows={rows}
        showActions={classroom.visible}
        showCheckboxes={classroom.visible}
        uncheckAllRows={uncheckAllRows}
        uncheckRow={uncheckRow}
      />
    )
  }

  const renderStudentHeader = () => {
    return (
      <div className="students-section-header with-students">
        <h3>Students</h3>
        {renderStudentHeaderButtons()}
      </div>
    )
  }

  const renderStudentHeaderButtons = () => {
    if (!classroom.visible) { return null }

    let loginPdfHref = `/teachers/classrooms/${classroom.id}/student_logins`

    let download: boolean
    if (allStudentsAreGoogle) {
      loginPdfHref = googleSetupInstructionsPdf
      download = true
    } else if (allStudentsAreClever) {
      loginPdfHref = cleverSetupInstructionsPdf
      download = true
    } else if (allStudentsAreCanvas) {
      loginPdfHref = canvasSetupInstructionsPdf
      download = true
    }
    /* eslint-disable react/jsx-no-target-blank */
    const loginPdfLink = (
      <a
        className="quill-button secondary outlined small"
        download={download}
        href={loginPdfHref}
        rel="noopener noreferrer"
        target="_blank"
      >
        Download student log-in instructions
      </a>
    )
    /* eslint-enable react/jsx-no-target-blank */

    return (
      <div className="students-section-header-buttons">
        <div className="login-pdf-and-view-as-student top-buttons-container">
          {loginPdfLink}
          <button className="quill-button secondary outlined small" onClick={handleClickViewAsStudentButton} type="button">
            View as student
          </button>
        </div>
        {renderInviteStudents()}
      </div>
    )
  }

  const renderInviteStudents = () => {
    if (!classroom.visible) { return null }

    const { classroomProvider } = classroom

    if (classroomProvider) {
      const isDisabled = providerConfigLookup[user.provider]?.title !== classroomProvider
      const lastUpdatedDate = moment(classroom.updated_at).format('MMM D, YYYY')
      return (
        <div className="invite-provider-classroom-students">
          <button
            className={`quill-button primary outlined small ${isDisabled ? 'disabled' : ''}`}
            disabled={isDisabled}
            onClick={importProviderClassroomStudents}
            type="button"
          >
            Import {classroomProvider} students
          </button>
          <span>Last imported {lastUpdatedDate}</span>
        </div>
      )
    }

    return (
      <div className="invite-quill-classroom-students">
        <button className="quill-button primary outlined small" onClick={inviteStudents} type="button">
          Invite students
        </button>
      </div>
    )
  }

  const renderStudentSection = () => {
    if (classroom.students.length) {
      return (
        <div className="students-section">
          {renderEditStudentAccountModal()}
          {renderResetStudentPasswordModal()}
          {renderMergeStudentAccountsModal()}
          {renderMoveStudentsModal()}
          {renderRemoveStudentsModal()}
          {renderStudentHeader()}
          {renderProviderNoteOfExplanation()}
          {renderStudentActions()}
          {renderStudentDataTable()}
          {renderDuplicateAccountProTip()}
        </div>
      )
    } else if (classroom.visible) {
      let copy = 'Click on the "Invite students" button to get started with your writing instruction!'
      const { classroom_provider } = classroom

      if (classroomProviders.includes(classroom_provider)) {
        copy = `Add students to your class in ${classroom_provider} and they will automatically appear here.`
      }

      return (
        <div className="students-section">
          <div className="students-section-header">
            <h3>Students</h3>
            {renderInviteStudents()}
          </div>
          <div className="no-students">
            <img alt="Three empty desks" src={emptyDeskSrc} />
            <p>{copy}</p>
          </div>
        </div>
      )
    } else {
      return (
        <div className="students-section empty">
          <div className="students-section-header">
            <h3>Students</h3>
          </div>
        </div>
      )
    }
  }

  return renderStudentSection()
}

export default ClassroomStudentSection
