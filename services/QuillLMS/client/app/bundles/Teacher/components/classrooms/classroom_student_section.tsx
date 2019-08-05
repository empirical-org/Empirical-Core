import * as React from 'react'
import moment from 'moment'

import { DropdownInput, DataTable } from 'quill-component-library/dist/componentLibrary'

import EditStudentAccountModal from './edit_student_account_modal'
import ResetStudentPasswordModal from './reset_student_password_modal'
import MergeStudentAccountsModal from './merge_student_accounts_modal'
import MoveStudentsModal from './move_students_modal'
import RemoveStudentsModal from './remove_students_modal'

const emptyDeskSrc = `${process.env.CDN_URL}/images/illustrations/empty-desks.svg`

const activeHeaders = [
  {
    width: '190px',
    name: 'Name',
    attribute: 'name'
  }, {
    width: '362px',
    name: 'Username',
    attribute: 'username'
  }, {
    width: '124px',
    name: 'Synced',
    attribute: 'synced'
  }
]

const archivedHeaders = [
  {
    width: '235px',
    name: 'Name',
    attribute: 'name'
  }, {
    width: '407px',
    name: 'Username',
    attribute: 'username'
  }, {
    width: '124px',
    name: 'Synced',
    attribute: 'synced'
  }
]

enum modalNames {
  editStudentAccountModal = 'editStudentAccountModal',
  resetStudentPasswordModal = 'resetStudentPasswordModal',
  mergeStudentAccountsModal = 'mergeStudentAccountsModal',
  moveStudentsModal = 'moveStudentsModal',
  removeStudentsModal = 'removeStudentsModal'
}

interface ClassroomStudentSectionProps {
  user: any;
  classroom: any;
  classrooms: Array<any>;
  isOwnedByCurrentUser: boolean;
  onSuccess: (event) => void;
  inviteStudents?: (event) => void;
  importGoogleClassroomStudents?: (event) => void;
}

interface ClassroomStudentSectionState {
  selectedStudentIds: Array<string|number>;
  studentIdsForModal: Array<string|number>;
  showModal?: modalNames.editStudentAccountModal|modalNames.resetStudentPasswordModal|modalNames.mergeStudentAccountsModal|modalNames.moveStudentsModal|modalNames.removeStudentsModal;
}

export default class ClassroomStudentSection extends React.Component<ClassroomStudentSectionProps, ClassroomStudentSectionState> {
  constructor(props) {
    super(props)

    this.state = {
      selectedStudentIds: [],
      studentIdsForModal: []
    }

    this.individualStudentActions = this.individualStudentActions.bind(this)
    this.dropdownActions = this.dropdownActions.bind(this)
    this.actionsForIndividualStudent = this.actionsForIndividualStudent.bind(this)
    this.checkRow = this.checkRow.bind(this)
    this.uncheckRow = this.uncheckRow.bind(this)
    this.checkAllRows = this.checkAllRows.bind(this)
    this.uncheckAllRows = this.uncheckAllRows.bind(this)
    this.selectAction = this.selectAction.bind(this)
    this.editStudentAccount = this.editStudentAccount.bind(this)
    this.resetStudentPassword = this.resetStudentPassword.bind(this)
    this.mergeStudentAccounts = this.mergeStudentAccounts.bind(this)
    this.moveClass = this.moveClass.bind(this)
    this.removeStudentFromClass = this.removeStudentFromClass.bind(this)
    this.closeModal = this.closeModal.bind(this)
  }

  individualStudentActions() {
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
      }
    }
  }

  dropdownActions() {
    return {
      editAccount: {
        name: 'Edit account',
        action: this.editStudentAccount
      },
      resetPassword: {
        name: 'Reset password',
        action: this.resetStudentPassword
      },
      mergeAccounts: {
        name: 'Merge accounts',
        action: this.mergeStudentAccounts
      },
      moveClass: {
        name: 'Move class',
        action: this.moveClass
      },
      removeFromClass: {
        name: 'Remove from class',
        action: this.removeStudentFromClass
      }
    }
  }

  actionsForIndividualStudent() {
    const { classrooms, isOwnedByCurrentUser, } = this.props
    const {
      editAccount,
      resetPassword,
      mergeAccounts,
      moveClass,
      removeFromClass
    } = this.individualStudentActions()
    if (classrooms.length > 1 && isOwnedByCurrentUser) {
      return [ editAccount, resetPassword, mergeAccounts, moveClass, removeFromClass ]
    } else if (isOwnedByCurrentUser) {
      return [ editAccount, resetPassword, mergeAccounts, removeFromClass ]
    } else {
      return [ editAccount, resetPassword, removeFromClass ]
    }
  }

  checkRow(id) {
    const { selectedStudentIds } = this.state
    const newSelectedStudentIds = selectedStudentIds.concat(id)
    this.setState({ selectedStudentIds: newSelectedStudentIds })
  }

  uncheckRow(id) {
    const { selectedStudentIds } = this.state
    const newSelectedStudentIds = selectedStudentIds.filter(selectedId => selectedId !== id)
    this.setState({ selectedStudentIds: newSelectedStudentIds })
  }

  checkAllRows() {
    const { classroom } = this.props
    const newSelectedStudentIds = classroom.students.map(student => student.id)
    this.setState({ selectedStudentIds: newSelectedStudentIds })
  }

  uncheckAllRows() {
    this.setState({ selectedStudentIds: [] })
  }

  selectAction(action) {
    action.value()
  }

  editStudentAccount(id=null) {
    const { selectedStudentIds } = this.state
    // we will only show the edit student account dropdown option when only one student is selected
    const studentId = id || selectedStudentIds[0]
    this.setState( { showModal: modalNames.editStudentAccountModal, studentIdsForModal: [studentId] })
  }

  resetStudentPassword(id=null) {
    const { selectedStudentIds } = this.state
    // we will only show the reset password account dropdown option when only one student is selected
    const studentId = id || selectedStudentIds[0]
    this.setState( { showModal: modalNames.resetStudentPasswordModal, studentIdsForModal: [studentId] })
  }

  mergeStudentAccounts(id=null) {
    const { selectedStudentIds } = this.state
    // we will only show the merge student accounts account dropdown option when one or two students are selected
    const studentIds = id ? [id] : selectedStudentIds
    this.setState( { showModal: modalNames.mergeStudentAccountsModal, studentIdsForModal: studentIds })
  }

  moveClass(id=null) {
    const { selectedStudentIds } = this.state
    // we will show the move class dropdown option when any number of students are selected
    const studentIds = id ? [id] : selectedStudentIds
    this.setState( { showModal: modalNames.moveStudentsModal, studentIdsForModal: studentIds })
  }

  removeStudentFromClass(id=null) {
    const { selectedStudentIds } = this.state
    // we will show the remove student from class dropdown option when any number of students are selected
    const studentIds = id ? [id] : selectedStudentIds
    this.setState( { showModal: modalNames.removeStudentsModal, studentIdsForModal: studentIds })
  }

  closeModal() {
    this.setState({ showModal: null, studentIdsForModal: []})
  }

  renderEditStudentAccountModal() {
    const { classroom, onSuccess } = this.props
    const { showModal, studentIdsForModal } = this.state
    if (showModal === modalNames.editStudentAccountModal && studentIdsForModal.length === 1) {
      const student = classroom.students.find(s => s.id === studentIdsForModal[0])
      return <EditStudentAccountModal
        close={this.closeModal}
        onSuccess={onSuccess}
        student={student}
        classroom={classroom}
      />
    }
  }

  renderResetStudentPasswordModal() {
    const { classroom, onSuccess } = this.props
    const { showModal, studentIdsForModal } = this.state
    if (showModal === modalNames.resetStudentPasswordModal && studentIdsForModal.length === 1) {
      const student = classroom.students.find(s => s.id === studentIdsForModal[0])
      return <ResetStudentPasswordModal
        close={this.closeModal}
        onSuccess={onSuccess}
        student={student}
        classroom={classroom}
      />
    }
  }

  renderMergeStudentAccountsModal() {
    const { classroom, onSuccess } = this.props
    const { showModal, studentIdsForModal } = this.state
    if (showModal === modalNames.mergeStudentAccountsModal) {
      return <MergeStudentAccountsModal
        close={this.closeModal}
        onSuccess={onSuccess}
        selectedStudentIds={studentIdsForModal}
        classroom={classroom}
      />
    }
  }

  renderMoveStudentsModal() {
    const { classroom, onSuccess, classrooms, } = this.props
    const { showModal, studentIdsForModal } = this.state
    if (showModal === modalNames.moveStudentsModal) {
      return <MoveStudentsModal
        close={this.closeModal}
        onSuccess={onSuccess}
        selectedStudentIds={studentIdsForModal}
        classroom={classroom}
        classrooms={classrooms}
      />
    }
  }

  renderRemoveStudentsModal() {
    const { classroom, onSuccess, } = this.props
    const { showModal, studentIdsForModal } = this.state
    if (showModal === modalNames.removeStudentsModal) {
      return <RemoveStudentsModal
        close={this.closeModal}
        onSuccess={onSuccess}
        selectedStudentIds={studentIdsForModal}
        classroom={classroom}
      />
    }
  }

  optionsForStudentActions() {
    const { classrooms, isOwnedByCurrentUser, } = this.props
    const { selectedStudentIds } = this.state

    const {
      editAccount,
      resetPassword,
      mergeAccounts,
      moveClass,
      removeFromClass
    } = this.dropdownActions()

    if (classrooms.length > 1 && isOwnedByCurrentUser) {
      if (selectedStudentIds.length === 1) {
        return [ editAccount, resetPassword, mergeAccounts, moveClass, removeFromClass ]
      } else if (selectedStudentIds.length === 2) {
        return [ mergeAccounts, moveClass, removeFromClass ]
      } else {
        return [ moveClass, removeFromClass ]
      }
    } else if (isOwnedByCurrentUser) {
      if (selectedStudentIds.length === 1) {
        return [ editAccount, resetPassword, mergeAccounts, removeFromClass ]
      } else if (selectedStudentIds.length === 2) {
        return [ mergeAccounts, removeFromClass ]
      } else {
        return [ removeFromClass ]
      }
    } else {
      if (selectedStudentIds.length === 1) {
        return [ editAccount, resetPassword, removeFromClass ]
      } else {
        return [ removeFromClass ]
      }
    }
  }

  renderStudentActions() {
    const { classroom } = this.props
    const { selectedStudentIds } = this.state
    if (!classroom.visible) {
      return null
    } else {
      return <DropdownInput
        disabled={selectedStudentIds.length === 0}
        label="Actions"
        className="student-actions-dropdown"
        options={this.optionsForStudentActions()}
        handleChange={this.selectAction}
      />
    }
  }

  renderStudentDataTable() {
    const { classroom, } = this.props

    const rows = classroom.students.map(student => {
      const { name, username, id } = student
      const checked = !!this.state.selectedStudentIds.includes(id)
      let synced = ''
      if (student.google_id) { synced = 'Google Classroom'}
      if (student.clever_id) { synced = 'Clever' }
      return {
        synced,
        name,
        id,
        username,
        checked,
        actions: classroom.visible ? this.actionsForIndividualStudent() : null
      }
    })

    return <DataTable
      headers={classroom.visible ? activeHeaders : archivedHeaders}
      rows={rows}
      showCheckboxes={classroom.visible}
      showActions={classroom.visible}
      checkRow={this.checkRow}
      uncheckRow={this.uncheckRow}
      uncheckAllRows={this.uncheckAllRows}
      checkAllRows={this.checkAllRows}
    />
  }

  renderStudentHeaderButtons() {
    const { classroom } = this.props
    if (!classroom.visible) {
      return null
    } else {
      return <div className="students-section-header-buttons">
        <a href={`/teachers/classrooms/${this.props.classroom.id}/student_logins`} className="quill-button secondary outlined small">Download setup instructions</a>
        {this.renderInviteStudents()}
      </div>
    }
  }

  renderInviteStudents() {
    const { classroom, inviteStudents, importGoogleClassroomStudents, } = this.props
    if (!classroom.visible) { return null }
    if (classroom.google_classroom_id) {
      const lastUpdatedDate = moment(classroom.updated_at).format('MMM D, YYYY')
      return <div className="invite-google-classroom-students">
        <button className="quill-button primary outlined small" onClick={importGoogleClassroomStudents}>Import Google Classroom students</button>
        <span>Last imported {lastUpdatedDate}</span>
      </div>
    } else if (classroom.clever_id) {
      return <div className="invite-clever-students">
        <p>Auto-synced from Clever</p>
        <span>You can modify your Quill class rosters from your Clever account.</span>
      </div>
    } else {
      return <div className="invite-quill-classroom-students">
        <button className="quill-button primary outlined small" onClick={inviteStudents}>Invite students</button>
      </div>
    }
  }

  renderStudentSection() {
    const { classroom, } = this.props
    if (classroom.students.length) {
      return <div className="students-section">
        {this.renderEditStudentAccountModal()}
        {this.renderResetStudentPasswordModal()}
        {this.renderMergeStudentAccountsModal()}
        {this.renderMoveStudentsModal()}
        {this.renderRemoveStudentsModal()}
        <div className="students-section-header with-students">
          <h3>Students</h3>
          {this.renderStudentHeaderButtons()}
        </div>
        {this.renderStudentActions()}
        {this.renderStudentDataTable()}
      </div>
    }
    else {
      return <div className="students-section">
        <div className="students-section-header">
          <h3>Students</h3>
          {this.renderInviteStudents()}
        </div>
        <div className="no-students">
          <img src={emptyDeskSrc} />
          <p>Click on the "Invite students" button to get started with your writing instruction!</p>
        </div>
      </div>
    }
  }

  render() {
    return this.renderStudentSection()
  }
}
