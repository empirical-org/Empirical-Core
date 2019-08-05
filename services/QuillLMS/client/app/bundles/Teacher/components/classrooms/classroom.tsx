import * as React from 'react'
import * as moment from 'moment'

import ClassroomStudentSection from './classroom_student_section'
import ClassroomTeacherSection from './classroom_teacher_section'

const expandSrc = `${process.env.CDN_URL}/images/icons/expand.svg`

import NumberSuffix from '../modules/numberSuffixBuilder.js';

interface ClassroomProps {
  user: any;
  classroom: any;
  classrooms: Array<any>;
  selected: boolean;
  isOwnedByCurrentUser: boolean;
  clickClassroomHeader: (event) => void;
  renameClass?: (event) => void;
  changeGrade?: (event) => void;
  archiveClass?: (event) => void;
  unarchiveClass?: (event) => void;
  inviteStudents?: (event) => void;
  importGoogleClassroomStudents?: (event) => void;
  onSuccess: (event) => void;
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
    const archivedDate = classroom.visible ? null : [<span className="bullet">•</span>, <span>Archived {updatedAt}</span>]
    const coteachers = numberOfTeachers > 1 ? [<span>{numberOfTeachers - 1} {numberOfTeachers === 2 ? 'co-teacher' : 'co-teachers'}</span>, <span className="bullet">•</span>] : null

    return <div className="classroom-data">
      <span>{numberOfStudents} {numberOfStudents === 1 ? 'student' : 'students'}</span>
      <span className="bullet">•</span>
      {coteachers}
      <span>{this.renderClassCodeOrType()}</span>
      <span className="bullet">•</span>
      <span>{this.renderGrade()}</span>
      <span className="bullet">•</span>
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
    const {
      isOwnedByCurrentUser,
      classroom,
      renameClass,
      changeGrade,
      archiveClass,
      unarchiveClass
    } = this.props
    let coteacherNote
    let classSettingsClassName = "class-settings"
    let settings = [
      <button className="quill-button secondary outlined small" onClick={renameClass}>Rename class</button>,
      <button className="quill-button secondary outlined small" onClick={changeGrade}>Change grade</button>,
      <button className="quill-button secondary outlined small" onClick={archiveClass}>Archive</button>
    ]

    if (!isOwnedByCurrentUser) {
      const owner = classroom.teachers.find(t => t.classroom_relation === 'owner')
      coteacherNote = <p className="coteacher-note">Looking for more class settings? Ask {owner.name}, the class owner.</p>
      settings = [<button className="quill-button secondary outlined small">Leave class</button>]
      classSettingsClassName+= ' coteacher-class-settings'
    } else if (!classroom.visible) {
      settings = [
        <button className="quill-button secondary outlined small" onClick={unarchiveClass}>Un-archive</button>
      ]
    }
    return <div className={classSettingsClassName}>
      <h3>Class settings</h3>
      {coteacherNote}
      <div className="class-settings-buttons">
        {settings}
      </div>
    </div>
  }

  renderClassroomContent() {
    const {
      user,
      classroom,
      onSuccess,
      inviteStudents,
      classrooms,
      isOwnedByCurrentUser,
      importGoogleClassroomStudents,
    } = this.props
    const sharedProps = {
      user,
      classroom,
      onSuccess,
      isOwnedByCurrentUser,
      classrooms
    }
    return <div>
      {this.renderClassSettings()}
      <ClassroomStudentSection
        {...sharedProps}
        inviteStudents={inviteStudents}
        importGoogleClassroomStudents={importGoogleClassroomStudents}
      />
      <ClassroomTeacherSection
        {...sharedProps}
      />
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
