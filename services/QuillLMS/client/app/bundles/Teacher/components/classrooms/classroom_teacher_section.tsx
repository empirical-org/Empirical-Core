import * as React from 'react'

import { DataTable } from '../../../Shared/index'

import InviteCoteachersModal from './invite_coteachers_modal'
import RemoveCoteacherModal from './remove_coteacher_modal'
import TransferOwnershipModal from './transfer_ownership_modal'

const CoteacherDisplayName = 'Co-teacher'
const OwnerDisplayName = 'Owner'

const activeHeaders = [
  {
    width: '370px',
    name: 'Name',
    attribute: 'name'
  }, {
    width: '72px',
    name: 'Role',
    attribute: 'role'
  }, {
    width: '445px',
    name: 'Email',
    attribute: 'email'
  },
  {
    width: '52px',
    name: 'Status',
    attribute: 'status'
  }, {
    name: 'Actions',
    attribute: 'actions',
    isActions: true
  }
]

const archivedHeaders = [
  {
    width: '220px',
    name: 'Name',
    attribute: 'name'
  }, {
    width: '72px',
    name: 'Role',
    attribute: 'role'
  }, {
    width: '395px',
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
  classrooms: Array<any>;
  onSuccess: (event) => void;
  leaveClass: (event) => void;
  isOwnedByCurrentUser: boolean;
}

interface ClassroomTeacherSectionState {
  showModal?: string;
  selectedCoteacherId?: string|number;
}

export const inviteCoteachersModal = 'inviteCoteachersModal'
export const removeCoteacherModal = 'removeCoteacherModal'
export const transferOwnershipModal = 'transferOwnershipModal'

export default class ClassroomTeacherSection extends React.Component<ClassroomTeacherSectionProps, ClassroomTeacherSectionState> {
  constructor(props) {
    super(props)

    this.state = {
      showModal: null
    }

    this.ownerActions = this.ownerActions.bind(this)
    this.coteacherActions = this.coteacherActions.bind(this)
    this.classroomOwner = this.classroomOwner.bind(this)
    this.removeCoteacher = this.removeCoteacher.bind(this)
    this.transferOwnership = this.transferOwnership.bind(this)
    this.closeModal = this.closeModal.bind(this)
  }

  ownerActions(status) {
    let transferClassAction
    let inviteCoteachersAction
    if (status === 'Joined') {
      transferClassAction = {
        name: 'Transfer class',
        action: (id) => this.transferOwnership(id)
      }
    }
    if (this.classroomsOwnedByCurrentUser().length > 1) {
      inviteCoteachersAction = {
        name: 'Invite to another class',
        action: (id) => this.inviteCoteachers(id)
      }
    }
    return [
      inviteCoteachersAction,
      transferClassAction,
      {
        name: 'Remove from class',
        action: (id) => this.removeCoteacher(id)
      }
    ].filter(Boolean)
  }

  coteacherActions() {
    return [
      {
        name: 'Leave class',
        action: this.props.leaveClass
      }
    ]
  }

  classroomsOwnedByCurrentUser() {
    const { classrooms, user, } = this.props
    return classrooms.filter(c => {
      const owner = c.teachers.find(teacher => teacher.classroom_relation === 'owner')
      return owner.id === user.id
    })
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
    this.setState({ showModal: removeCoteacherModal, selectedCoteacherId: id })
  }

  closeModal() {
    this.setState({ showModal: null, selectedCoteacherId: null })
  }

  transferOwnership(id) {
    this.setState({ showModal: transferOwnershipModal, selectedCoteacherId: id })
  }

  inviteCoteachers(id=null) {
    this.setState({ showModal: inviteCoteachersModal, selectedCoteacherId: id })
  }

  actionsForTeacherRow(teacher) {
    const { isOwnedByCurrentUser, classroom, user, } = this.props
    const { classroom_relation, id, status, } = teacher
    const role = this.formatRole(classroom_relation)
    if (!classroom.visible || role !== CoteacherDisplayName) {
      return null
    } else if (isOwnedByCurrentUser) {
      return this.ownerActions(status)
    } else if (id === user.id) {
      return this.coteacherActions()
    }
  }

  renderTeacherRow(teacher) {
    const { name, classroom_relation, id, status, email } = teacher
    const role = this.formatRole(classroom_relation)
    const actions = this.actionsForTeacherRow(teacher)
    const teacherRow: { name: string, id: number, email: string, role: string, status: string, actions?: Array<any> } = {
      name,
      id,
      email,
      role,
      status,
      actions
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
    return (
      <DataTable
        headers={classroom.visible ? activeHeaders : archivedHeaders}
        rows={rows}
        showActions={classroom.visible}
      />
    )
  }

  renderRemoveCoteacherModal() {
    const { classroom, onSuccess } = this.props
    const { showModal, selectedCoteacherId } = this.state
    if (showModal === removeCoteacherModal && selectedCoteacherId) {
      const coteacher = classroom.teachers.find(t => t.id === selectedCoteacherId)
      return (
        <RemoveCoteacherModal
          classroom={classroom}
          close={this.closeModal}
          coteacher={coteacher}
          onSuccess={onSuccess}
        />
      )
    }
  }

  renderTransferOwnershipModal() {
    const { classroom, onSuccess } = this.props
    const { showModal, selectedCoteacherId } = this.state
    if (showModal === transferOwnershipModal && selectedCoteacherId) {
      const coteacher = classroom.teachers.find(t => t.id === selectedCoteacherId)
      return (
        <TransferOwnershipModal
          classroom={classroom}
          close={this.closeModal}
          coteacher={coteacher}
          onSuccess={onSuccess}
        />
      )
    }
  }

  renderInviteCoteachersModal() {
    const { classroom, onSuccess, } = this.props
    const { showModal, selectedCoteacherId } = this.state
    if (showModal === inviteCoteachersModal) {
      const coteacher = classroom.teachers.find(t => t.id === selectedCoteacherId)
      return (
        <InviteCoteachersModal
          classroom={classroom}
          classrooms={this.classroomsOwnedByCurrentUser()}
          close={this.closeModal}
          coteacher={coteacher}
          onSuccess={onSuccess}
        />
      )
    }
  }

  renderInviteCoteachersButton() {
    const { classroom } = this.props
    if (!classroom.visible) {
      return null
    } else {
      return <button className="quill-button primary outlined small" onClick={() => this.inviteCoteachers()}>Invite co-teachers</button>
    }
  }

  render() {
    return (
      <div className="teacher-section">
        {this.renderRemoveCoteacherModal()}
        {this.renderTransferOwnershipModal()}
        {this.renderInviteCoteachersModal()}
        <div className="teacher-section-header">
          <h3>Teachers</h3>
          {this.renderInviteCoteachersButton()}
        </div>
        {this.renderTeachers()}
      </div>
    )
  }
}
