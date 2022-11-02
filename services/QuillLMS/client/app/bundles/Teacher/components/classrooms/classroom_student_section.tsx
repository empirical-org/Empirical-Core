import * as React from 'react'
import moment from 'moment'

import EditStudentAccountModal from './edit_student_account_modal'
import ResetStudentPasswordModal from './reset_student_password_modal'
import MergeStudentAccountsModal from './merge_student_accounts_modal'
import MoveStudentsModal from './move_students_modal'
import RemoveStudentsModal from './remove_students_modal'

import { DropdownInput, DataTable, Tooltip, helpIcon, warningIcon, } from '../../../Shared/index'

const emptyDeskSrc = `${process.env.CDN_URL}/images/illustrations/empty-desks.svg`
const bulbSrc = `${process.env.CDN_URL}/images/illustrations/bulb.svg`
const cleverSetupInstructionsPdf = `${process.env.CDN_URL}/documents/setup_instructions_pdfs/clever_setup_instructions.pdf`
const googleSetupInstructionsPdf = `${process.env.CDN_URL}/documents/setup_instructions_pdfs/google_setup_instructions.pdf`

function activeHeaders(hasProviderClassroom: boolean) {
  const name = {
    width: '190px',
    name: 'Name',
    attribute: 'name'
  }

  const username = {
    width: hasProviderClassroom ? '362px' : '486px',
    name: 'Username',
    attribute: 'username'
  }

  const synced = {
    width: '124px',
    name: 'Synced',
    attribute: 'synced',
    noTooltip: true,
    rowSectionClassName: 'show-overflow'
  }

  const actions =  {
    name: 'Actions',
    attribute: 'actions',
    isActions: true
  }

  return hasProviderClassroom ? [name, username, synced, actions] : [name, username, actions]
}

function archivedHeaders(hasProviderClassroom: boolean) {
  const name = {
    width: '235px',
    name: 'Name',
    attribute: 'name'
  }

  const username = {
    width: hasProviderClassroom ? '407px' : '531px',
    name: 'Username',
    attribute: 'username'
  }

  const synced = {
    width: '124px',
    name: 'Synced',
    attribute: 'synced',
    noTooltip: true,
    rowSectionClassName: 'show-overflow'
  }

  return hasProviderClassroom ? [name, username, synced] : [name, username]
}

enum modalNames {
  editStudentAccountModal = 'editStudentAccountModal',
  resetStudentPasswordModal = 'resetStudentPasswordModal',
  mergeStudentAccountsModal = 'mergeStudentAccountsModal',
  moveStudentsModal = 'moveStudentsModal',
  removeStudentsModal = 'removeStudentsModal',
}

interface ClassroomStudentSectionProps {
  user: any;
  classroom: any;
  classrooms: Array<any>;
  isOwnedByCurrentUser: boolean;
  onSuccess: (event) => void;
  inviteStudents?: (event) => void;
  importCleverClassroomStudents?: (event) => void;
  importGoogleClassroomStudents?: (event) => void;
  viewAsStudent?: (event) => void;
}

interface ClassroomStudentSectionState {
  selectedStudentIds: Array<string|number>;
  studentIdsForModal: Array<string|number>;
  showModal?: modalNames.editStudentAccountModal|modalNames.resetStudentPasswordModal|modalNames.mergeStudentAccountsModal|modalNames.moveStudentsModal|modalNames.removeStudentsModal;
}

export default class ClassroomStudentSection
  extends React.Component<ClassroomStudentSectionProps, ClassroomStudentSectionState> {

  constructor(props: ClassroomStudentSectionProps) {
    super(props)

    this.state = {
      selectedStudentIds: [],
      studentIdsForModal: []
    }
  }

  allGoogleStudents = () => {
    const { classroom } = this.props
    return classroom.students.every(student => student.google_id)
  }

  allCleverStudents = () => {
    const { classroom } = this.props
    return classroom.students.every(student => student.clever_id)
  }

  individualStudentActions = () => {
    const { viewAsStudent, } = this.props
    return {
      editAccount: {
        name: 'Edit account',
        action: (id) => this.editStudentAccount(id)
      },
      resetPassword: {
        name: 'Reset password',
        action: (id) => this.resetStudentPassword(id)
      },
      mergeAccounts: {
        name: 'Merge accounts',
        action: (id) => this.mergeStudentAccounts(id)
      },
      moveClass: {
        name: 'Move class',
        action: (id) => this.moveClass(id)
      },
      removeFromClass: {
        name: 'Remove from class',
        action: (id) => this.removeStudentFromClass(id)
      },
      viewAsStudent: {
        name: 'View as student',
        action: (id) => viewAsStudent(id)
      }
    }
  }

  dropdownActions = () => {
    const { viewAsStudent, } = this.props
    return {
      editAccount: {
        label: 'Edit account',
        value: this.editStudentAccount
      },
      resetPassword: {
        label: 'Reset password',
        value: this.resetStudentPassword
      },
      mergeAccounts: {
        label: 'Merge accounts',
        value: this.mergeStudentAccounts
      },
      moveClass: {
        label: 'Move class',
        value: this.moveClass
      },
      removeFromClass: {
        label: 'Remove from class',
        value: this.removeStudentFromClass
      },
      viewAsStudent: {
        label: 'View as student',
        value: viewAsStudent
      }
    }
  }

  actionsForIndividualStudent = (student) => {
    const { google_id, clever_id, synced } = student
    const { classrooms, isOwnedByCurrentUser, } = this.props
    const {
      editAccount,
      resetPassword,
      viewAsStudent,
      mergeAccounts,
      moveClass,
      removeFromClass
    } = this.individualStudentActions()
    if (google_id || clever_id) {
      return synced ? [viewAsStudent] : [viewAsStudent, moveClass, removeFromClass]
    } else if (classrooms.length > 1 && isOwnedByCurrentUser) {
      return [ editAccount, resetPassword, viewAsStudent, mergeAccounts, moveClass, removeFromClass ]
    } else if (isOwnedByCurrentUser) {
      return [ editAccount, resetPassword, viewAsStudent, mergeAccounts, removeFromClass ]
    } else {
      return [ editAccount, resetPassword, viewAsStudent, removeFromClass ]
    }
  }

  handleSuccess = (successMessage) => {
    const { onSuccess, } = this.props
    this.setState({ selectedStudentIds: [], })
    onSuccess(successMessage)
  }

  checkRow = (id) => {
    const { selectedStudentIds } = this.state
    const newSelectedStudentIds = selectedStudentIds.concat(id)
    this.setState({ selectedStudentIds: newSelectedStudentIds })
  }

  uncheckRow = (id) => {
    const { selectedStudentIds } = this.state
    const newSelectedStudentIds = selectedStudentIds.filter(selectedId => selectedId !== id)
    this.setState({ selectedStudentIds: newSelectedStudentIds })
  }

  checkAllRows = () => {
    const { classroom } = this.props
    const selectedStudentIds = classroom.students.map(student => student.id)
    this.setState({ selectedStudentIds })
  }

  uncheckAllRows = () => {
    this.setState({ selectedStudentIds: [] })
  }

  handleClickViewAsStudentButton = () => {
    const { viewAsStudent } = this.props
    viewAsStudent()
  }

  onClickViewAsIndividualStudent = (id: string|number) => {
    const { viewAsStudent } = this.props
    viewAsStudent(id)
  }

  selectAction = (action) => {
    action.value()
  }

  editStudentAccount = (id=null) => {
    const { selectedStudentIds } = this.state
    // we will only show the edit student account dropdown option when only one student is selected
    const studentId = id || selectedStudentIds[0]
    this.setState( { showModal: modalNames.editStudentAccountModal, studentIdsForModal: [studentId] })
  }

  resetStudentPassword = (id=null) => {
    const { selectedStudentIds } = this.state
    // we will only show the reset password account dropdown option when only one student is selected
    const studentId = id || selectedStudentIds[0]
    this.setState( { showModal: modalNames.resetStudentPasswordModal, studentIdsForModal: [studentId] })
  }

  mergeStudentAccounts = (id=null) => {
    const { selectedStudentIds } = this.state
    // we will only show the merge student accounts account dropdown option when one or two students are selected
    const studentIds = id ? [id] : selectedStudentIds
    this.setState( { showModal: modalNames.mergeStudentAccountsModal, studentIdsForModal: studentIds })
  }

  moveClass = (id=null) => {
    const { selectedStudentIds } = this.state
    // we will show the move class dropdown option when any number of students are selected
    const studentIds = id ? [id] : selectedStudentIds
    this.setState( { showModal: modalNames.moveStudentsModal, studentIdsForModal: studentIds })
  }

  removeStudentFromClass = (id=null) => {
    const { selectedStudentIds } = this.state
    // we will show the remove student from class dropdown option when any number of students are selected
    const studentIds = id ? [id] : selectedStudentIds
    this.setState( { showModal: modalNames.removeStudentsModal, studentIdsForModal: studentIds })
  }

  closeModal = () => {
    this.setState({ showModal: null, studentIdsForModal: []})
  }

  renderEditStudentAccountModal = () => {
    const { classroom, } = this.props
    const { showModal, studentIdsForModal } = this.state
    if (showModal === modalNames.editStudentAccountModal && studentIdsForModal.length === 1) {
      const student = classroom.students.find(s => s.id === studentIdsForModal[0])
      return (
        <EditStudentAccountModal
          classroom={classroom}
          close={this.closeModal}
          onSuccess={this.handleSuccess}
          student={student}
        />
      )
    }
  }

  renderResetStudentPasswordModal = () => {
    const { classroom, } = this.props
    const { showModal, studentIdsForModal } = this.state
    if (showModal === modalNames.resetStudentPasswordModal && studentIdsForModal.length === 1) {
      const student = classroom.students.find(s => s.id === studentIdsForModal[0])
      return (
        <ResetStudentPasswordModal
          classroom={classroom}
          close={this.closeModal}
          onSuccess={this.handleSuccess}
          student={student}
        />
      )
    }
  }

  renderMergeStudentAccountsModal = () => {
    const { classroom, } = this.props
    const { showModal, studentIdsForModal } = this.state
    if (showModal === modalNames.mergeStudentAccountsModal) {
      return (
        <MergeStudentAccountsModal
          classroom={classroom}
          close={this.closeModal}
          onSuccess={this.handleSuccess}
          selectedStudentIds={studentIdsForModal}
        />
      )
    }
  }

  renderMoveStudentsModal = () => {
    const { classroom, classrooms, } = this.props
    const { showModal, studentIdsForModal } = this.state
    if (showModal === modalNames.moveStudentsModal) {
      return (
        <MoveStudentsModal
          classroom={classroom}
          classrooms={classrooms}
          close={this.closeModal}
          onSuccess={this.handleSuccess}
          selectedStudentIds={studentIdsForModal}
        />
      )
    }
  }

  renderRemoveStudentsModal = () => {
    const { classroom, } = this.props
    const { showModal, studentIdsForModal } = this.state
    if (showModal === modalNames.removeStudentsModal) {
      return (
        <RemoveStudentsModal
          classroom={classroom}
          close={this.closeModal}
          onSuccess={this.handleSuccess}
          selectedStudentIds={studentIdsForModal}
        />
      )
    }
  }

  optionsForStudentActions = () => {
    const { classrooms, isOwnedByCurrentUser, classroom, } = this.props
    const { selectedStudentIds } = this.state

    const anySelectedStudentsAreGoogleOrClever = selectedStudentIds.some(id => {
      const student = classroom.students.find(s => s.id === id)
      if (!student) { return false }
      return student.google_id || student.clever_id
    })

    const {
      editAccount,
      resetPassword,
      mergeAccounts,
      moveClass,
      removeFromClass,
      viewAsStudent
    } = this.dropdownActions()

    if (anySelectedStudentsAreGoogleOrClever) {
      return [ viewAsStudent, removeFromClass ]
    } else if (classrooms.length > 1 && isOwnedByCurrentUser) {
      if (selectedStudentIds.length === 1) {
        return [ editAccount, resetPassword, viewAsStudent, mergeAccounts, moveClass, removeFromClass ]
      } else if (selectedStudentIds.length === 2) {
        return [ viewAsStudent, mergeAccounts, moveClass, removeFromClass ]
      } else {
        return [ viewAsStudent, moveClass, removeFromClass ]
      }
    } else if (isOwnedByCurrentUser) {
      if (selectedStudentIds.length === 1) {
        return [ editAccount, resetPassword, viewAsStudent, mergeAccounts, removeFromClass ]
      } else if (selectedStudentIds.length === 2) {
        return [ viewAsStudent, mergeAccounts, removeFromClass ]
      } else {
        return [ viewAsStudent, removeFromClass ]
      }
    } else {
      if (selectedStudentIds.length === 1) {
        return [ editAccount, resetPassword, viewAsStudent, removeFromClass ]
      } else {
        return [ viewAsStudent, removeFromClass ]
      }
    }
  }

  renderStudentActions() {
    const { classroom } = this.props
    const { selectedStudentIds } = this.state
    if (!classroom.visible) {
      return null
    } else {
      return (
        <div className="student-actions-dropdown-wrapper">
          <DropdownInput
            className="student-actions-dropdown"
            disabled={selectedStudentIds.length === 0}
            handleChange={this.selectAction}
            label="Actions"
            options={this.optionsForStudentActions()}
          />
          {selectedStudentIds.length === 0 && <Tooltip
            tooltipText="Please select students from the list below to take action"
            tooltipTriggerText={<img alt={warningIcon.alt} src={warningIcon.src} />}
          />}
        </div>
      )
    }
  }

  renderGoogleOrCleverNoteOfExplanation() {
    const { classroom } = this.props
    if (!classroom.visible) { return null }
    const allGoogleStudents = this.allGoogleStudents()
    const allCleverStudents = this.allCleverStudents()

    if (allGoogleStudents || allCleverStudents) {
      let copy
      if (allGoogleStudents) {
        copy = "Your students’ account information is linked to your Google Classroom account. Go to your Google Classroom account to edit your students."
      } else if (allCleverStudents) {
        copy = "Your students’ account information is auto-synced from your Clever account. You can modify your Quill class rosters from your Clever account."
      }
      return (
        <div className="google-or-clever-note-of-explanation">
          <div className="google-or-clever-note-of-explanation-text">
            <h4>Why can&#39;t I edit my students’ account information?</h4>
            <p>{copy}</p>
          </div>
          <img alt="lightbulb" src={bulbSrc} />
        </div>
      )
    }
  }

  syncedStatus(student: any, providerClassroom: string) {
    const { synced } = student

    if (synced === undefined || synced === null) { return '' }
    if (synced) { return 'Yes' }

    return (
      <Tooltip
        tooltipText={`This student is no longer in this class in ${providerClassroom}`}

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

  renderStudentDataTable() {
    const { classroom, } = this.props
    const { selectedStudentIds, } = this.state
    const { providerClassroom } = classroom
    const hasProviderClassroom = providerClassroom !== undefined

    const rows = classroom.students.map(student => {
      const { name, username, id, } = student
      const checked = !!selectedStudentIds.includes(id)
      const synced = this.syncedStatus(student, providerClassroom)
      return {
        synced,
        name,
        id,
        username,
        checked,
        actions: classroom.visible ? this.actionsForIndividualStudent(student) : null
      }
    })

    return (
      <DataTable
        checkAllRows={this.checkAllRows}
        checkRow={this.checkRow}
        className='show-overflow'
        headers={classroom.visible ? activeHeaders(hasProviderClassroom) : archivedHeaders(hasProviderClassroom)}
        rows={rows}
        showActions={classroom.visible}
        showCheckboxes={classroom.visible}
        uncheckAllRows={this.uncheckAllRows}
        uncheckRow={this.uncheckRow}
      />
    )
  }

  renderStudentHeaderButtons() {
    const { classroom } = this.props
    const allGoogleStudents = this.allGoogleStudents()
    const allCleverStudents = this.allCleverStudents()
    if (!classroom.visible) { return null }
    let loginPdfHref = `/teachers/classrooms/${classroom.id}/student_logins`
    let download: boolean
    if (allGoogleStudents) {
      loginPdfHref = googleSetupInstructionsPdf
      download = true
    } else if (allCleverStudents) {
      loginPdfHref = cleverSetupInstructionsPdf
      download = true
    }
    /* eslint-disable react/jsx-no-target-blank */
    const loginPdfLink = <a className="quill-button secondary outlined small" download={download} href={loginPdfHref} rel="noopener noreferrer" target="_blank">Download setup instructions</a>
    /* eslint-enable react/jsx-no-target-blank */

    return (
      <div className="students-section-header-buttons">
        <div>
          {loginPdfLink}
          <button className="quill-button secondary outlined small" onClick={this.handleClickViewAsStudentButton} type="button">
            View as student
          </button>
        </div>
        {this.renderInviteStudents()}
      </div>
    )
  }

  renderInviteStudents() {
    const { classroom, inviteStudents, importCleverClassroomStudents, importGoogleClassroomStudents } = this.props

    if (!classroom.visible) { return null }

    if (classroom.clever_id) {
      const lastUpdatedDate = moment(classroom.updated_at).format('MMM D, YYYY')
      return (
        <div className="invite-clever-classroom-students">
          <button className="quill-button primary outlined small" onClick={importCleverClassroomStudents} type="button">
            Import Clever classroom students
          </button>
          <span>Last imported {lastUpdatedDate}</span>
        </div>
      )
    }

    if (classroom.google_classroom_id) {
      const lastUpdatedDate = moment(classroom.updated_at).format('MMM D, YYYY')
      return (
        <div className="invite-google-classroom-students">
          <button className="quill-button primary outlined small" onClick={importGoogleClassroomStudents} type="button">
            Import Google Classroom students
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

  renderStudentSection = () => {
    const { classroom, } = this.props
    if (classroom.students.length) {
      return (
        <div className="students-section">
          {this.renderEditStudentAccountModal()}
          {this.renderResetStudentPasswordModal()}
          {this.renderMergeStudentAccountsModal()}
          {this.renderMoveStudentsModal()}
          {this.renderRemoveStudentsModal()}
          <div className="students-section-header with-students">
            <h3>Students</h3>
            {this.renderStudentHeaderButtons()}
          </div>
          {this.renderGoogleOrCleverNoteOfExplanation()}
          {this.renderStudentActions()}
          {this.renderStudentDataTable()}
        </div>
      )
    } else if (classroom.visible) {
      let copy = 'Click on the "Invite students" button to get started with your writing instruction!'
      if (classroom.google_classroom_id) {
        copy = 'Click on the "Import Google Classroom students" button to get started with your writing instruction!'
      } else if (classroom.clever_id) {
        copy = 'Add students to your class in Clever and they will automatically appear here.'
      }
      return (
        <div className="students-section">
          <div className="students-section-header">
            <h3>Students</h3>
            {this.renderInviteStudents()}
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

  render = () => {
    return this.renderStudentSection()
  }
}
