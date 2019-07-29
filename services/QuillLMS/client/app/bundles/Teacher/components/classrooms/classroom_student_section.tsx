import * as React from 'react'
import moment from 'moment'

import { DropdownInput, DataTable } from 'quill-component-library/dist/componentLibrary'

import EditStudentAccountModal from './edit_student_account_modal'
import ResetStudentPasswordModal from './reset_student_password_modal'
import MergeStudentAccountsModal from './merge_student_accounts_modal'
import MoveStudentsModal from './move_students_modal'
import RemoveStudentsModal from './remove_students_modal'

const emptyDeskSrc = `${process.env.CDN_URL}/images/illustrations/empty-desks.svg`

const headers = [
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

interface ClassroomStudentSectionProps {
  user: any;
  classroom: any;
  classrooms: Array<any>;
  onSuccess: (event) => void;
  inviteStudents: (event) => void;
}

interface ClassroomStudentSectionState {
  selectedStudentIds: Array<string|number>;
  studentIdsForModal: Array<string|number>;
  showEditStudentAccountModal: boolean;
  showResetStudentPasswordModal: boolean;
  showMergeStudentAccountsModal: boolean;
  showMoveStudentsModal: boolean;
  showRemoveStudentsModal: boolean;
}

export default class ClassroomStudentSection extends React.Component<ClassroomStudentSectionProps, ClassroomStudentSectionState> {
  constructor(props) {
    super(props)

    this.state = {
      selectedStudentIds: [],
      studentIdsForModal: [],
      showEditStudentAccountModal: false,
      showResetStudentPasswordModal: false,
      showMergeStudentAccountsModal: false,
      showMoveStudentsModal: false,
      showRemoveStudentsModal: false
    }

    this.actions = this.actions.bind(this)
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
    this.closeEditStudentAccountModal = this.closeEditStudentAccountModal.bind(this)
    this.closeResetStudentPasswordModal = this.closeResetStudentPasswordModal.bind(this)
    this.closeMergeStudentAccountsModal = this.closeMergeStudentAccountsModal.bind(this)
    this.closeMoveStudentsModal = this.closeMoveStudentsModal.bind(this)
    this.closeRemoveStudentsModal = this.closeRemoveStudentsModal.bind(this)
  }

  actions() {
    return [
      {
        name: 'Edit account',
        action: (id) => this.editStudentAccount(id)
      },
      {
        name: 'Reset password',
        action: (id) => this.resetStudentPassword(id)
      },
      {
        name: 'Merge accounts',
        action: (id) => this.mergeStudentAccounts(id)
      },
      {
        name: 'Move class',
        action: (id) => this.moveClass(id)
      },
      {
        name: 'Remove from class',
        action: (id) => this.removeStudentFromClass(id)
      }
    ]
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
    this.setState( { showEditStudentAccountModal: true, studentIdsForModal: [studentId] })
  }

  resetStudentPassword(id=null) {
    const { selectedStudentIds } = this.state
    // we will only show the reset password account dropdown option when only one student is selected
    const studentId = id || selectedStudentIds[0]
    this.setState( { showResetStudentPasswordModal: true, studentIdsForModal: [studentId] })
  }

  mergeStudentAccounts(id=null) {
    const { selectedStudentIds } = this.state
    // we will only show the merge student accounts account dropdown option when one or two students are selected
    const studentIds = id ? [id] : selectedStudentIds
    this.setState( { showMergeStudentAccountsModal: true, studentIdsForModal: studentIds })
  }

  moveClass(id=null) {
    const { selectedStudentIds } = this.state
    // we will show the move class dropdown option when any number of students are selected
    const studentIds = id ? [id] : selectedStudentIds
    this.setState( { showMoveStudentsModal: true, studentIdsForModal: studentIds })
  }

  removeStudentFromClass(id=null) {
    const { selectedStudentIds } = this.state
    // we will show the remove student from class dropdown option when any number of students are selected
    const studentIds = id ? [id] : selectedStudentIds
    this.setState( { showRemoveStudentsModal: true, studentIdsForModal: studentIds })
  }

  closeEditStudentAccountModal() {
    this.setState({ showEditStudentAccountModal: false, studentIdsForModal: [] })
  }

  closeResetStudentPasswordModal() {
    this.setState({ showResetStudentPasswordModal: false, studentIdsForModal: [] })
  }

  closeMergeStudentAccountsModal() {
    this.setState({ showMergeStudentAccountsModal: false, studentIdsForModal: [] })
  }

  closeMoveStudentsModal() {
    this.setState({ showMoveStudentsModal: false, studentIdsForModal: [] })
  }

  closeRemoveStudentsModal() {
    this.setState({ showRemoveStudentsModal: false, studentIdsForModal: [] })
  }

  renderEditStudentAccountModal() {
    const { classroom, onSuccess } = this.props
    const { showEditStudentAccountModal, studentIdsForModal } = this.state
    if (showEditStudentAccountModal && studentIdsForModal.length === 1) {
      const student = classroom.students.find(s => s.id === studentIdsForModal[0])
      return <EditStudentAccountModal
        close={this.closeEditStudentAccountModal}
        onSuccess={onSuccess}
        student={student}
        classroom={classroom}
      />
    }
  }

  renderResetStudentPasswordModal() {
    const { classroom, onSuccess } = this.props
    const { showResetStudentPasswordModal, studentIdsForModal } = this.state
    if (showResetStudentPasswordModal && studentIdsForModal.length === 1) {
      const student = classroom.students.find(s => s.id === studentIdsForModal[0])
      return <ResetStudentPasswordModal
        close={this.closeResetStudentPasswordModal}
        onSuccess={onSuccess}
        student={student}
        classroom={classroom}
      />
    }
  }

  renderMergeStudentAccountsModal() {
    const { classroom, onSuccess } = this.props
    const { showMergeStudentAccountsModal, studentIdsForModal } = this.state
    if (showMergeStudentAccountsModal) {
      return <MergeStudentAccountsModal
        close={this.closeMergeStudentAccountsModal}
        onSuccess={onSuccess}
        selectedStudentIds={studentIdsForModal}
        classroom={classroom}
      />
    }
  }

  renderMoveStudentsModal() {
    const { classroom, onSuccess, classrooms, } = this.props
    const { showMoveStudentsModal, studentIdsForModal } = this.state
    if (showMoveStudentsModal) {
      return <MoveStudentsModal
        close={this.closeMoveStudentsModal}
        onSuccess={onSuccess}
        selectedStudentIds={studentIdsForModal}
        classroom={classroom}
        classrooms={classrooms}
      />
    }
  }

  renderRemoveStudentsModal() {
    const { classroom, onSuccess, } = this.props
    const { showRemoveStudentsModal, studentIdsForModal } = this.state
    if (showRemoveStudentsModal) {
      return <RemoveStudentsModal
        close={this.closeRemoveStudentsModal}
        onSuccess={onSuccess}
        selectedStudentIds={studentIdsForModal}
        classroom={classroom}
      />
    }
  }

  renderStudentActions() {
    const { selectedStudentIds } = this.state
    let options = []

    const moreThanTwoStudentOptions = [
      {
        label: 'Move class',
        value: this.moveClass
      },
      {
        label: 'Remove from class',
        value: this.removeStudentFromClass
      }
    ]

    const twoStudentOptions = [
      {
        label: 'Merge accounts',
        value: this.mergeStudentAccounts
      }
    ].concat(moreThanTwoStudentOptions)

    const oneStudentOptions = [
      {
        label: 'Edit account',
        value: this.editStudentAccount
      },
      {
        label: 'Reset password',
        value: this.resetStudentPassword
      }
    ].concat(twoStudentOptions)

    if (selectedStudentIds.length === 1) {
      options = oneStudentOptions
    } else if (selectedStudentIds.length === 2) {
      options = twoStudentOptions
    } else if (selectedStudentIds.length > 2) {
      options = moreThanTwoStudentOptions
    }
    return <DropdownInput
      disabled={selectedStudentIds.length === 0}
      label="Actions"
      className="student-actions-dropdown"
      options={options || []}
      handleChange={this.selectAction}
    />
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
        actions: this.actions()
      }
    })

    return <DataTable
      headers={headers}
      rows={rows}
      showCheckboxes={true}
      showActions={true}
      checkRow={this.checkRow}
      uncheckRow={this.uncheckRow}
      uncheckAllRows={this.uncheckAllRows}
      checkAllRows={this.checkAllRows}
    />
  }

  renderInviteStudents() {
    const { classroom, inviteStudents, } = this.props
    if (classroom.google_classroom_id) {
      const lastUpdatedDate = moment(classroom.updated_at).format('MMM D, YYYY')
      return <div className="invite-google-classroom-students">
        <button className="quill-button primary outlined small">Import Google Classroom students</button>
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
          <div className="students-section-header-buttons">
            <a href={`/teachers/classrooms/${this.props.classroom.id}/student_logins`} className="quill-button secondary outlined small">Download setup instructions</a>
            {this.renderInviteStudents()}
          </div>
        </div>
        {this.renderStudentActions()}
        {this.renderStudentDataTable()}
      </div>
    }
    else {
      return <div className="students-section">
        <div className="students-section-header">
          <h3>Students</h3>
          <button className="quill-button primary outlined small">Invite students</button>
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
