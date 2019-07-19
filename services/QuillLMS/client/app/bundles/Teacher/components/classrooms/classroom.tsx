import * as React from 'react'
import moment from 'moment'

const emptyDeskSrc = `${process.env.CDN_URL}/images/illustrations/empty-desks.svg`
const expandSrc = `${process.env.CDN_URL}/images/icons/expand.svg`

import NumberSuffix from '../modules/numberSuffixBuilder.js';

interface ClassroomProps {
  classroom: any;
  selected: boolean;
  clickClassroomHeader: (event) => void;
}

export default class Classroom extends React.Component<ClassroomProps, any> {
  constructor(props) {
    super(props)
  }

  renderClassCodeOrType() {
    const { classroom } = this.props
    if (classroom.google_id) {
      return 'Google Classroom'
    } else if (classroom.clever_id) {
      return 'Clever Classroom'
    } else {
      return `Class code: ${classroom.code}`
    }
  }

  renderGrade() {
    const { classroom } = this.props
    if (['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'].includes(classroom.grade)) {
      return `${NumberSuffix(classroom.grade)} grade`
    } else {
      return classroom.grade || 'Other'
    }
  }

  renderClassroomHeader() {
    const { classroom, clickClassroomHeader } = this.props
    const numberOfStudents = classroom.students.length
    const createdAt = moment(classroom.created_at).format('MMM D, YYYY')
    return <div className="classroom-card-header" onClick={() => clickClassroomHeader(classroom.id)}>
      <div className="classroom-info">
        <h2 className="classroom-name">{classroom.name}</h2>
        <div className="classroom-data">
          <span>{numberOfStudents} {numberOfStudents === 1 ? 'student' : 'students'}</span>
          <span>•</span>
          <span>{this.renderClassCodeOrType()}</span>
          <span>•</span>
          <span>{this.renderGrade()}</span>
          <span>•</span>
          <span>Created {createdAt}</span>
        </div>
      </div>
      <img className="expand-arrow" src={expandSrc} />
    </div>

  }

  renderClassroomContent() {

  }

  renderClassroom() {
    const { selected  } = this.props
    return <div className={`classroom ${selected ? 'open' : 'closed'}`}>
      {this.renderClassroomHeader()}
      {this.renderClassroomContent()}
    </div>
  }

  render() {
    return this.renderClassroom()
  }
}
