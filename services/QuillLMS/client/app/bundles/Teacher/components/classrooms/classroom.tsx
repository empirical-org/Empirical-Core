import * as React from 'react'
import * as moment from 'moment'

import ClassroomStudentSection from './classroom_student_section'
import ClassroomTeacherSection from './classroom_teacher_section'

const expandSrc = `${process.env.CDN_URL}/images/icons/expand.svg`

import NumberSuffix from '../modules/numberSuffixBuilder.js';

interface ClassroomProps {
  user: any;
  classroom: any;
  selected: boolean;
  clickClassroomHeader: (event) => void;
}

interface ClassroomState {
}

export default class Classroom extends React.Component<ClassroomProps, ClassroomState> {
  constructor(props) {
    super(props)
  }

  renderClassCodeOrType() {
    const { classroom } = this.props
    if (classroom.google_classroom_id) {
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

  renderClassroomData() {
    const { classroom } = this.props
    const numberOfStudents = classroom.students.length
    const numberOfTeachers = classroom.teachers.length
    const createdAt = moment(classroom.created_at).format('MMM D, YYYY')
    const updatedAt = moment(classroom.updated_at).format('MMM D, YYYY')
    const archivedDate = classroom.visible ? null : [<span>•</span>, <span>Archived {updatedAt}</span>]
    const coteachers = numberOfTeachers > 1 ? [<span>{numberOfTeachers - 1} {numberOfTeachers === 2 ? 'co-teacher' : 'co-teachers'}</span>, <span>•</span>] : null

    return <div className="classroom-data">
      <span>{numberOfStudents} {numberOfStudents === 1 ? 'student' : 'students'}</span>
      <span>•</span>
      {coteachers}
      <span>{this.renderClassCodeOrType()}</span>
      <span>•</span>
      <span>{this.renderGrade()}</span>
      <span>•</span>
      <span>Created {createdAt}</span>
      {archivedDate}
    </div>
  }

  renderClassroomHeader() {
    const { classroom, clickClassroomHeader } = this.props
    return <div className="classroom-card-header" onClick={() => clickClassroomHeader(classroom.id)}>
      <div className="classroom-info">
        <h2 className="classroom-name">{classroom.name}</h2>
        {this.renderClassroomData()}
      </div>
      <img className="expand-arrow" src={expandSrc} />
    </div>
  }

  renderClassSettings() {
    const { user, classroom } = this.props
    let coteacherNote
    let settings = [
      <button className="quill-button secondary outlined small">Rename class</button>,
      <button className="quill-button secondary outlined small">Change grade</button>,
      <button className="quill-button secondary outlined small">Archive</button>
    ]
    const teacher = classroom.teachers.find(t => t.id === user.id)
    if (teacher.classroom_relation === 'co-teacher') {
      const owner = classroom.teachers.find(t => t.classroom_relation === 'owner')
      coteacherNote = <span>Looking for more class settings? Ask {owner.name}, the class owner.</span>
      settings = [<button className="quill-button secondary outlined small">Leave class</button>]
    } else if (!classroom.visible) {
      settings = [
        <button className="quill-button secondary outlined small">Un-archive</button>
      ]
    }
    return <div className="class-settings">
      <h3>Class settings</h3>
      {coteacherNote}
      <div className="class-settings-buttons">
        {settings}
      </div>
    </div>
  }

  renderClassroomContent() {
    const { user, classroom } = this.props
    return <div>
      {this.renderClassSettings()}
      <ClassroomStudentSection user={user} classroom={classroom} />
      <ClassroomTeacherSection user={user} classroom={classroom} />
    </div>
  }

  renderClassroom() {
    const { selected  } = this.props
    return <div className={`classroom ${selected ? 'open' : 'closed'}`}>
      {this.renderClassroomHeader()}
      {selected ? this.renderClassroomContent() : null}
    </div>
  }

  render() {
    return this.renderClassroom()
  }
}
