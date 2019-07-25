import * as React from 'react'
import moment from 'moment'

import { DataTable } from 'quill-component-library/dist/componentLibrary'

const expandSrc = `${process.env.CDN_URL}/images/icons/expand.svg`

import NumberSuffix from '../modules/numberSuffixBuilder.js';

const titleCase = str => str.charAt(0).toUpperCase() + str.substr(1).toLowerCase()

interface ClassroomTeacherSectionProps {
  user: any;
  classroom: any;
}

interface ClassroomTeacherSectionState {
}

export default class ClassroomTeacherSection extends React.Component<ClassroomTeacherSectionProps, ClassroomTeacherSectionState> {
  constructor(props) {
    super(props)
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

  renderTeachers() {
    const { user, classroom } = this.props

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

    const actions = [
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

    const owner = classroom.teachers.find(teacher => teacher.classroom_relation === 'owner')
    const coteachers = classroom.teachers.filter(teacher => teacher.classroom_relation === 'coteacher')
    const alphabeticalCoteachers = coteachers.sort((a, b) => {
      const aLastName = a.name.split(' ')[1] || ''
      const bLastName = b.name.split(' ')[1] || ''
      return aLastName.localeCompare(bLastName)
    })

    const teachers = [owner].concat(alphabeticalCoteachers)

    const rows = teachers.map(teacher => {
      const { name, classroom_relation, id, status, email } = teacher
      const teacherRow: { name: string, id: number, email: string, role: string, status: string, actions?: Array<any> } = {
        name,
        id,
        email,
        role: titleCase(classroom_relation),
        status: status
      }
      if (teacherRow.role === 'Co-teacher' && user.id === owner.id) {
        teacherRow.actions = actions
      }
      return teacherRow
    })
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
