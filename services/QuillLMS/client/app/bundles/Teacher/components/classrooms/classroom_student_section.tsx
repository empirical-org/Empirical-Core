import * as React from 'react'
import moment from 'moment'

import { DropdownInput, DataTable } from 'quill-component-library/dist/componentLibrary'

import EditStudentAccountModal from './edit_student_account_modal'

const emptyDeskSrc = `${process.env.CDN_URL}/images/illustrations/empty-desks.svg`

interface ClassroomStudentSectionProps {
  user: any;
  classroom: any;
  onSuccess: (event) => void;
}

interface ClassroomStudentSectionState {
  selectedStudentIds: Array<string|number>;
  studentIdsForModal: Array<string|number>;
  showEditStudentAccountModal: boolean;
}

export default class ClassroomStudentSection extends React.Component<ClassroomStudentSectionProps, ClassroomStudentSectionState> {
  constructor(props) {
    super(props)

    this.state = {
      selectedStudentIds: [],
      studentIdsForModal: [],
      showEditStudentAccountModal: false
    }

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
    console.log('edit student account', id)
  }

  resetStudentPassword(id=null) {
    console.log('reset student password', id)
  }

  mergeStudentAccounts(id=null) {
    console.log('merge student acccounts', id)
  }

  moveClass(id=null) {
    console.log('move class', id)
  }

  removeStudentFromClass(id=null) {
    console.log('remove from class', id)
  }

  closeEditStudentAccountModal() {
    this.setState({ showEditStudentAccountModal: false, studentIdsForModal: [] })
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

  renderStudentActions() {
    const { selectedStudentIds } = this.state
    let options = []
    if (selectedStudentIds.length === 1) {
      options = [
        {
          label: 'Edit account',
          value: this.editStudentAccount
        },
        {
          label: 'Reset password',
          value: this.resetStudentPassword
        },
        {
          label: 'Merge accounts',
          value: this.mergeStudentAccounts
        },
        {
          label: 'Move class',
          value: this.moveClass
        },
        {
          label: 'Remove from class',
          value: this.removeStudentFromClass
        }
      ]
    } else if (selectedStudentIds.length === 2) {
      options = [
        {
          label: 'Merge accounts',
          value: this.mergeStudentAccounts
        },
        {
          label: 'Move class',
          value: this.moveClass
        },
        {
          label: 'Remove from class',
          value: this.removeStudentFromClass
        }
      ]
    } else if (selectedStudentIds.length > 2) {
      options = [
        {
          label: 'Move class',
          value: this.moveClass
        },
        {
          label: 'Remove from class',
          value: this.removeStudentFromClass
        }
      ]
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

    const actions = [
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
        actions,
        checked
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
    const { classroom, } = this.props
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
        <button className="quill-button primary outlined small">Invite students</button>
      </div>
    }
  }

  renderStudentSection() {
    const { classroom, } = this.props
    if (classroom.students.length) {
      return <div className="students-section">
        {this.renderEditStudentAccountModal()}
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
