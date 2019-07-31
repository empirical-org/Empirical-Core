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
  classrooms: Array<any>;
  onSuccess: (event) => void;
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

    this.actions = this.actions.bind(this)
    this.classroomOwner = this.classroomOwner.bind(this)
    this.removeCoteacher = this.removeCoteacher.bind(this)
    this.transferOwnership = this.transferOwnership.bind(this)
    this.closeModal = this.closeModal.bind(this)
  }

  actions(status) {
    const { classrooms } = this.props
    let transferClassAction
    let inviteCoteachersAction
    if (status === 'Joined') {
      transferClassAction = {
        name: 'Transfer class',
        action: (id) => this.transferOwnership(id)
      }
    }
    if (classrooms.length > 1) {
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
    const { showModal, selectedCoteacherId } = this.state
    if (showModal && selectedCoteacherId) {
      const coteacher = classroom.teachers.find(t => t.id === selectedCoteacherId)
      return <RemoveCoteacherModal
        close={this.closeModal}
        onSuccess={onSuccess}
        coteacher={coteacher}
        classroom={classroom}
      />
    }
  }

  renderTransferOwnershipModal() {
    const { classroom, onSuccess } = this.props
    const { showModal, selectedCoteacherId } = this.state
    if (showModal && selectedCoteacherId) {
      const coteacher = classroom.teachers.find(t => t.id === selectedCoteacherId)
      return <TransferOwnershipModal
        close={this.closeModal}
        onSuccess={onSuccess}
        coteacher={coteacher}
        classroom={classroom}
      />
    }
  }

  renderInviteCoteachersModal() {
    const { classroom, classrooms, onSuccess } = this.props
    const { showModal, selectedCoteacherId } = this.state
    if (showModal === inviteCoteachersModal) {
      const coteacher = classroom.teachers.find(t => t.id === selectedCoteacherId)
      return <InviteCoteachersModal
        close={this.closeModal}
        classrooms={classrooms}
        classroom={selectedClassroom}
        onSuccess={this.onSuccess}
        coteacher={coteacher}
      />
    }
  }

  render() {
    return <div className="teacher-section">
      {this.renderRemoveCoteacherModal()}
      {this.renderTransferOwnershipModal()}
      {this.renderInviteCoteachersModal()}
      <div className="teacher-section-header">
        <h3>Teachers</h3>
        <button className="quill-button primary outlined small" onClick={() => this.inviteCoteachers()}>Invite co-teachers</button>
      </div>
      {this.renderTeachers()}
    </div>
  }
}
