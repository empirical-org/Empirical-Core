import * as React from 'react'

import { DataTable } from 'quill-component-library/dist/componentLibrary'

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
  isOwnedByCurrentUser: boolean;
}

interface ClassroomTeacherSectionState {
}

export default class ClassroomTeacherSection extends React.Component<ClassroomTeacherSectionProps, ClassroomTeacherSectionState> {
  constructor(props) {
    super(props)

    this.actions = this.actions.bind(this)
    this.classroomOwner = this.classroomOwner.bind(this)
  }

  actions() {
    return [
      {
        name: 'Invite to another class',
        action: (id) => console.log('Invite to another class', id)
      },
      {
        name: 'Transfer class',
        action: (id) => console.log('Transfer class', id)
      },
      {
        name: 'Remove from class',
        action: (id) => console.log('Remove from class', id)
      }
    ]
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

  renderTeacherSection() {
    return <div className="teacher-section">
      <div className="teacher-section-header">
        <h3>Teachers</h3>
        <button className="quill-button primary outlined small">Invite co-teachers</button>
      </div>
      {this.renderTeachers()}
    </div>
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
      actions: currentUserIsOwnerAndRowIsCoteacher ? this.actions() : null
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

  render() {
    return this.renderTeacherSection()
  }
}
