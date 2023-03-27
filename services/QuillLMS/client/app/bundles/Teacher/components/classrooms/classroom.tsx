import * as moment from 'moment'
import * as React from 'react'

import ClassroomStudentSection from './classroom_student_section'
import ClassroomTeacherSection from './classroom_teacher_section'
import LeaveClassModal from './leave_class_modal'

import { helpIcon, Tooltip } from '../../../Shared/index'
import NumberSuffix from '../modules/numberSuffixBuilder.js'
const expandSrc = `${import.meta.env.VITE_PROCESS_ENV_CDN_URL}/images/icons/expand.svg`

export const leaveClassModal = 'leaveClassModal'

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
  importCleverClassroomStudents?: (event) => void;
  importGoogleClassroomStudents?: (event) => void;
  viewAsStudent?: (event) => void;
  onSuccess: (event) => void;
}

interface ClassroomState {
  showModal?: string;
}

export default class Classroom extends React.Component<ClassroomProps, ClassroomState> {
  constructor(props) {
    super(props)

    this.state = {
      showModal: null
    }

    this.leaveClass = this.leaveClass.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.renderLeaveClassModal = this.renderLeaveClassModal.bind(this)
  }

  leaveClass() {
    this.setState({ showModal: leaveClassModal })
  }

  closeModal() {
    this.setState({ showModal: null })
  }

  renderClassCode() {
    const { classroom } = this.props
    const { code, google_classroom_id, clever_id, } = classroom
    if (google_classroom_id) {
      return (
        <Tooltip
          tooltipText={`Class code: <b>${code}</b><br/><br/>The easiest way for your students to join your class is through Google Classroom. However, if your students are not syncing, try the class code.`}
          tooltipTriggerText={<div className="text-and-icon-wrapper"><span>Class code:&nbsp;</span><img alt={helpIcon.alt} src={helpIcon.src} /></div>}
        />
      )
    }

    if (clever_id) {
      return (
        <Tooltip
          tooltipText={`Class code: <b>${code}</b><br/><br/>The easiest way for your students to join your class is through Clever. However, if your students are not syncing, try the class code.`}
          tooltipTriggerText={<div className="text-and-icon-wrapper"><span>Class code:&nbsp;</span><img alt={helpIcon.alt} src={helpIcon.src} /></div>}
        />
      )
    }

    return `Class code: ${code}`
  }

  renderGrade() {
    const { classroom } = this.props
    if (['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'].includes(classroom.grade)) {
      return `${NumberSuffix(classroom.grade)} grade`
    } else {
      return classroom.grade && classroom.grade !== 'Other' ? classroom.grade : 'Other grade'
    }
  }

  renderClassType() {
    const { classroom } = this.props
    const { clever_id, google_classroom_id } = classroom

    if (!clever_id && !google_classroom_id) { return null }

    return (
      <React.Fragment key={`class-type-item-${classroom.id}`}>
        <span className="item">{this.renderClassTypeContent()}</span>
        <span className="bullet item">•</span>
      </React.Fragment>
    )
  }

  renderClassTypeContent() {
    const { classroom } = this.props
    const { name, synced_name } = classroom

    const text = classroom.google_classroom_id ? 'Google Classroom' : 'Clever'

    if (synced_name === null || synced_name === name) {  return text }

    return (
      <Tooltip
        tooltipText={`Source: ${synced_name}`}
        tooltipTriggerText={
          <div className="text-and-icon-wrapper">
            <span>{text}&nbsp;</span>
            <img
              alt={helpIcon.alt}
              src={helpIcon.src}
            />
          </div>
        }
      />
    )
  }

  renderArchivedDate() {
    const { classroom } = this.props
    const updatedAt = moment(classroom.updated_at).format('MMM D, YYYY')

    if (classroom.visible) { return null}

    return (
      <React.Fragment key={`archived-at-bullet-${classroom.id}`}>
        <span className="bullet item">•</span>
        <span className="item">Archived {updatedAt}</span>
      </React.Fragment>
    )
  }

  renderCoteachers() {
    const { classroom } = this.props
    const numberOfStudents = classroom.students.length
    const numberOfTeachers = classroom.teachers.length

    if (numberOfStudents <= 1) { return null }

    return (
      <React.Fragment key={`number-of-coteachers-${classroom.id}`}>
        <span className="item">
          {numberOfTeachers - 1} {numberOfTeachers === 2 ? 'co-teacher' : 'co-teachers'}
        </span>
        <span className="bullet item">•</span>
      </React.Fragment>
    )
  }

  renderClassroomData() {
    const { classroom } = this.props
    const numberOfStudents = classroom.students.length
    const createdAt = moment(classroom.created_at).format('MMM D, YYYY')

    return (
      <div className="classroom-data">
        <span className="item">{numberOfStudents} {numberOfStudents === 1 ? 'student' : 'students'}</span>
        <span className="bullet item">•</span>
        {this.renderCoteachers()}
        {this.renderClassType()}
        <span className="item">{this.renderClassCode()}</span>
        <span className="bullet item">•</span>
        <span className="item">{this.renderGrade()}</span>
        <span className="bullet item">•</span>
        <span className="item">Created {createdAt}</span>
        {this.renderArchivedDate()}
      </div>
    )
  }

  renderClassroomHeader() {
    const { classroom, clickClassroomHeader } = this.props
    return (
      <div className="classroom-card-header" onClick={() => clickClassroomHeader(classroom.id)}>
        <div className="classroom-info">
          <h2 className="classroom-name">{classroom.name}</h2>
          {this.renderClassroomData()}
        </div>
        <img alt="" className="expand-arrow" src={expandSrc} />
      </div>
    )
  }

  renderClassSettings() {
    const {
      isOwnedByCurrentUser,
      classroom,
      renameClass,
      changeGrade,
      archiveClass,
      unarchiveClass,
    } = this.props
    let coteacherNote
    let classSettingsClassName = "class-settings"
    let settings = [
      <button className="quill-button secondary outlined small" key={`rename-class-${classroom.id}`} onClick={renameClass} type="button">Rename class</button>,
      <button className="quill-button secondary outlined small" key={`change-grade-${classroom.id}`} onClick={changeGrade} type="button">Change grade</button>,
      <button className="quill-button secondary outlined small" key={`archive-class-${classroom.id}`} onClick={archiveClass} type="button">Archive</button>
    ]

    if (!isOwnedByCurrentUser) {
      const owner = classroom.teachers.find(t => t.classroom_relation === 'owner')
      coteacherNote = <p className="coteacher-note">Looking for more class settings? Ask {owner.name}, the class owner.</p>
      settings = [<button className="quill-button secondary outlined small" key={`leave-class-${classroom.id}`} onClick={this.leaveClass} type="button">Leave class</button>]
      classSettingsClassName+= ' coteacher-class-settings'
    } else if (!classroom.visible) {
      settings = [
        <button className="quill-button secondary outlined small" key={`unarchive-class-${classroom.id}`} onClick={unarchiveClass} type="button">Un-archive</button>
      ]
    }
    return (
      <div className={classSettingsClassName}>
        <h3>Class settings</h3>
        {coteacherNote}
        <div className="class-settings-buttons">
          {settings}
        </div>
      </div>
    )
  }

  renderClassroomContent() {
    const {
      user,
      classroom,
      onSuccess,
      inviteStudents,
      classrooms,
      isOwnedByCurrentUser,
      importCleverClassroomStudents,
      importGoogleClassroomStudents,
      viewAsStudent,
    } = this.props
    const sharedProps = {
      user,
      classroom,
      onSuccess,
      isOwnedByCurrentUser,
      classrooms
    }
    return (
      <div>
        {this.renderClassSettings()}
        <ClassroomStudentSection
          {...sharedProps}
          importCleverClassroomStudents={importCleverClassroomStudents}
          importGoogleClassroomStudents={importGoogleClassroomStudents}
          inviteStudents={inviteStudents}
          viewAsStudent={viewAsStudent}
        />
        <ClassroomTeacherSection
          {...sharedProps}
          leaveClass={this.leaveClass}
        />
      </div>
    )
  }

  renderLeaveClassModal() {
    const { classroom, onSuccess, } = this.props
    const { showModal } = this.state
    if (showModal === leaveClassModal) {
      return (
        <LeaveClassModal
          classroom={classroom}
          close={this.closeModal}
          onSuccess={onSuccess}
        />
      )
    }
  }

  renderClassroom() {
    const { selected, classroom, } = this.props
    return (
      <div className={`classroom ${selected ? 'open' : 'closed'}`} id={classroom.id}>
        {this.renderLeaveClassModal()}
        {this.renderClassroomHeader()}
        {selected ? this.renderClassroomContent() : null}
      </div>
    )
  }

  render() {
    return this.renderClassroom()
  }
}
