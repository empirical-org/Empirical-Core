import * as React from 'react'

import { DataTable } from 'quill-component-library/dist/componentLibrary'

import RemoveCoteacherModal from './remove_coteacher_modal'
import TransferOwnershipModal from './transfer_ownership_modal'

const CoteacherDisplayName = 'Coteacher'
const OwnerDisplayName = 'Owner'

const headers = [
  {
    width: '200px',
    name: 'Name',
    attribute: 'name'
  }, {
    width: '72px',
    name: 'Role',
    attribute: 'role'
  }, {
    width: '375px',
    name: 'Email',
    attribute: 'email'
  },
  {
    width: '52px',
    name: 'Status',
    attribute: 'status'
  }
]

interface ClassroomTeacherSectionProps {
  user: any;
  classroom: any;
  onSuccess: (event) => void;
  isOwnedByCurrentUser: boolean;
}

interface ClassroomTeacherSectionState {
  showRemoveCoteacherModal: boolean;
  showTransferOwnershipModal: boolean;
  selectedCoteacherId?: string|number;
}

export default class ClassroomTeacherSection extends React.Component<ClassroomTeacherSectionProps, ClassroomTeacherSectionState> {
  constructor(props) {
    super(props)

    this.state = {
      showRemoveCoteacherModal: false,
      showTransferOwnershipModal: false
    }

    this.actions = this.actions.bind(this)
    this.classroomOwner = this.classroomOwner.bind(this)
    this.removeCoteacher = this.removeCoteacher.bind(this)
    this.transferOwnership = this.transferOwnership.bind(this)
    this.closeRemoveCoteacherModal = this.closeRemoveCoteacherModal.bind(this)
    this.closeTransferOwnershipModal = this.closeTransferOwnershipModal.bind(this)
  }

  actions(status) {
    let transferClassAction
    if (status === 'Joined') {
      transferClassAction = {
        name: 'Transfer class',
        action: (id) => this.transferOwnership(id)
      }
    }
    return [
      {
        name: 'Invite to another class',
        action: (id) => console.log('Invite to another class', id)
      },
      transferClassAction,
      {
        name: 'Remove from class',
        action: (id) => this.removeCoteacher(id)
      }
    ].filter(Boolean)
  }

  classroomOwner() {
    const { classroom, } = this.props
    return classroom.teachers.find(teacher => teacher.classroom_relation === 'owner')
  }

  formatRole(role) {
    if (role === 'coteacher') {
      return CoteacherDisplayName
    } else {
      return OwnerDisplayName
    }
  }

  removeCoteacher(id) {
    this.setState({ showRemoveCoteacherModal: true, selectedCoteacherId: id })
  }

  closeRemoveCoteacherModal() {
    this.setState({ showRemoveCoteacherModal: false, selectedCoteacherId: null })
  }

  transferOwnership(id) {
    this.setState({ showTransferOwnershipModal: true, selectedCoteacherId: id })
  }

  closeTransferOwnershipModal() {
    this.setState({ showTransferOwnershipModal: false, selectedCoteacherId: null })
  }

  renderTeacherRow(teacher) {
    const { isOwnedByCurrentUser, } = this.props
    const { name, classroom_relation, id, status, email } = teacher
    const role = this.formatRole(classroom_relation)
    const currentUserIsOwnerAndRowIsCoteacher = role === CoteacherDisplayName && isOwnedByCurrentUser
    const teacherRow: { name: string, id: number, email: string, role: string, status: string, actions?: Array<any> } = {
      name,
      id,
      email,
      role,
      status,
      actions: currentUserIsOwnerAndRowIsCoteacher ? this.actions(status) : null
    }
    return teacherRow
  }

  renderTeachers() {
    const { classroom } = this.props

    const owner = this.classroomOwner()
    const coteachers = classroom.teachers.filter(teacher => teacher.classroom_relation === 'coteacher')
    const alphabeticalCoteachers = coteachers.sort((a, b) => {
      const aLastName = a.name.split(' ')[1] || ''
      const bLastName = b.name.split(' ')[1] || ''
      return aLastName.localeCompare(bLastName)
    })

    const teachers = [owner].concat(alphabeticalCoteachers)

    const rows = teachers.map(teacher => this.renderTeacherRow(teacher))
    return <DataTable
      headers={headers}
      rows={rows}
      showActions={true}
    />
  }

  renderRemoveCoteacherModal() {
    const { classroom, onSuccess } = this.props
    const { showRemoveCoteacherModal, selectedCoteacherId } = this.state
    if (showRemoveCoteacherModal && selectedCoteacherId) {
      const coteacher = classroom.teachers.find(t => t.id === selectedCoteacherId)
      return <RemoveCoteacherModal
        close={this.closeRemoveCoteacherModal}
        onSuccess={onSuccess}
        coteacher={coteacher}
        classroom={classroom}
      />
    }
  }

  renderTransferOwnershipModal() {
    const { classroom, onSuccess } = this.props
    const { showTransferOwnershipModal, selectedCoteacherId } = this.state
    if (showTransferOwnershipModal && selectedCoteacherId) {
      const coteacher = classroom.teachers.find(t => t.id === selectedCoteacherId)
      return <TransferOwnershipModal
        close={this.closeTransferOwnershipModal}
        onSuccess={onSuccess}
        coteacher={coteacher}
        classroom={classroom}
      />
    }
  }

  render() {
    return <div className="teacher-section">
      {this.renderRemoveCoteacherModal()}
      {this.renderTransferOwnershipModal()}
      <div className="teacher-section-header">
        <h3>Teachers</h3>
        <button className="quill-button primary outlined small">Invite co-teachers</button>
      </div>
      {this.renderTeachers()}
    </div>
  }
}
