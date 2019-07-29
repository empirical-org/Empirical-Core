import * as React from 'react'
import { Snackbar, defaultSnackbarTimeout } from 'quill-component-library/dist/componentLibrary'

import CreateAClassModal from './create_a_class_modal'
import RenameClassModal from './rename_classroom_modal'
import ChangeGradeModal from './change_grade_modal'
import ArchiveClassModal from './archive_classroom_modal'
import InviteStudentsModal from './invite_students_modal'
import Classroom from './classroom'
import { requestGet } from '../../../../modules/request/index.js';

const emptyClassSrc = `${process.env.CDN_URL}/images/illustrations/empty-class.svg`

interface ActiveClassroomsProps {
  classrooms: Array<any>;
  user: any;
}

interface ActiveClassroomsState {
  showCreateAClassModal: boolean;
  showRenameClassModal: boolean;
  showChangeGradeModal: boolean;
  showArchiveClassModal: boolean;
  showInviteStudentsModal: boolean;
  showSnackbar: boolean;
  selectedClassroomId?: number;
  snackbarCopy?: string;
  classrooms?: Array<any>;
}

export default class ActiveClassrooms extends React.Component<ActiveClassroomsProps, ActiveClassroomsState> {
  constructor(props) {
    super(props)

    this.state = {
      showCreateAClassModal: false,
      showRenameClassModal: false,
      showChangeGradeModal: false,
      showArchiveClassModal: false,
      showInviteStudentsModal: false,
      showSnackbar: false,
      classrooms: props.classrooms.filter(classroom => classroom.visible)
    }

    this.openCreateAClassModal = this.openCreateAClassModal.bind(this)
    this.closeCreateAClassModal = this.closeCreateAClassModal.bind(this)
    this.openRenameClassModal = this.openRenameClassModal.bind(this)
    this.closeRenameClassModal = this.closeRenameClassModal.bind(this)
    this.openChangeGradeModal = this.openChangeGradeModal.bind(this)
    this.closeChangeGradeModal = this.closeChangeGradeModal.bind(this)
    this.openArchiveClassModal = this.openArchiveClassModal.bind(this)
    this.closeArchiveClassModal = this.closeArchiveClassModal.bind(this)
    this.openInviteStudentsModal = this.openInviteStudentsModal.bind(this)
    this.closeInviteStudentsModal = this.closeInviteStudentsModal.bind(this)
    this.showSnackbar = this.showSnackbar.bind(this)
    this.onSuccess = this.onSuccess.bind(this)
    this.clickClassroomHeader = this.clickClassroomHeader.bind(this)
    this.getClassrooms = this.getClassrooms.bind(this)
  }

  getClassrooms() {
    requestGet('/teachers/classrooms/new_index', (body) => this.setState({ classrooms: body.classrooms.filter(classroom => classroom.visible) }));
  }

  onSuccess(snackbarCopy) {
    this.getClassrooms()
    this.showSnackbar(snackbarCopy)
  }

  clickClassroomHeader(classroomId) {
    if (this.state.selectedClassroomId === classroomId) {
      this.setState({ selectedClassroomId: null})
    } else {
      this.setState({ selectedClassroomId: classroomId })
    }
  }

  openCreateAClassModal() {
    this.setState({ showCreateAClassModal: true })
  }

  closeCreateAClassModal() {
    this.setState({ showCreateAClassModal: false }, this.getClassrooms)
  }

  openInviteStudentsModal() {
    this.setState({ showInviteStudentsModal: true })
  }

  closeInviteStudentsModal() {
    this.setState({ showInviteStudentsModal: false }, this.getClassrooms)
  }

  openRenameClassModal() {
    this.setState({ showRenameClassModal: true })
  }

  closeRenameClassModal() {
    this.setState({ showRenameClassModal: false })
  }

  openChangeGradeModal() {
    this.setState({ showChangeGradeModal: true })
  }

  closeChangeGradeModal() {
    this.setState({ showChangeGradeModal: false })
  }

  openArchiveClassModal() {
    this.setState({ showArchiveClassModal: true })
  }

  closeArchiveClassModal() {
    this.setState({ showArchiveClassModal: false })
  }

  showSnackbar(snackbarCopy) {
    this.setState({ showSnackbar: true, snackbarCopy }, () => {
      setTimeout(() => this.setState({ showSnackbar: false, }), defaultSnackbarTimeout)
    })
  }

  renderSnackbar() {
    const { showSnackbar, snackbarCopy, } = this.state
    return <Snackbar text={snackbarCopy} visible={showSnackbar} />
  }

  renderPageContent() {
    const { user } = this.props
    const { classrooms } = this.state
    const ownActiveClassrooms = classrooms.filter(c => {
      const classroomOwner = c.teachers.find(teacher => teacher.classroom_relation === 'owner')
      return c.visible && classroomOwner.id === user.id
    })
    if (classrooms.length === 0) {
      return <div className="no-active-classes">
        <img src={emptyClassSrc} />
        <p>Every teacher needs a class! Please select one of the buttons on the right to get started.</p>
      </div>
    } else {
      const classroomCards = classrooms.map(classroom => {
        const isOwnedByCurrentUser = !!ownActiveClassrooms.find(c => c.id === classroom.id)
        return <Classroom
          renameClass={this.openRenameClassModal}
          changeGrade={this.openChangeGradeModal}
          archiveClass={this.openArchiveClassModal}
          inviteStudents={this.openInviteStudentsModal}
          classroom={classroom}
          classrooms={ownActiveClassrooms}
          selected={classroom.id === this.state.selectedClassroomId}
          clickClassroomHeader={this.clickClassroomHeader}
          user={user}
          isOwnedByCurrentUser={isOwnedByCurrentUser}
          onSuccess={this.onSuccess}
        />
      })
      return <div className="active-classes">
        {classroomCards}
      </div>
    }
  }

  renderCreateAClassModal() {
    if (this.state.showCreateAClassModal) {
      return <CreateAClassModal
        close={this.closeCreateAClassModal}
        showSnackbar={this.showSnackbar}
      />
    }
  }

  renderInviteStudentsModal() {
    const { showInviteStudentsModal, classrooms, selectedClassroomId } = this.state
    const selectedClassroom = classrooms.find(c => c.id === selectedClassroomId)
    if (showInviteStudentsModal) {
      return <InviteStudentsModal
        close={this.closeInviteStudentsModal}
        showSnackbar={this.showSnackbar}
        classroom={selectedClassroom}
      />
    }
  }

  renderRenameClassModal() {
    const { showRenameClassModal, classrooms, selectedClassroomId } = this.state
    if (showRenameClassModal) {
      const selectedClassroom = classrooms.find(c => c.id === selectedClassroomId)
      return <RenameClassModal
        close={this.closeRenameClassModal}
        onSuccess={this.onSuccess}
        classroom={selectedClassroom}
      />
    }
  }

  renderChangeGradeModal() {
    const { showChangeGradeModal, classrooms, selectedClassroomId } = this.state
    if (showChangeGradeModal) {
      const selectedClassroom = classrooms.find(c => c.id === selectedClassroomId)
      return <ChangeGradeModal
        close={this.closeChangeGradeModal}
        onSuccess={this.onSuccess}
        classroom={selectedClassroom}
      />
    }
  }

  renderArchiveClassModal() {
    const { showArchiveClassModal, classrooms, selectedClassroomId } = this.state
    if (showArchiveClassModal) {
      const selectedClassroom = classrooms.find(c => c.id === selectedClassroomId)
      return <ArchiveClassModal
        close={this.closeArchiveClassModal}
        onSuccess={this.onSuccess}
        classroom={selectedClassroom}
      />
    }
  }

  render() {
    return <div className="active-classrooms classrooms-page">
      {this.renderCreateAClassModal()}
      {this.renderRenameClassModal()}
      {this.renderChangeGradeModal()}
      {this.renderArchiveClassModal()}
      {this.renderInviteStudentsModal()}
      {this.renderSnackbar()}
      <div className="header">
        <h1>Active Classes</h1>
        <div className="buttons">
          <button className="quill-button medium secondary outlined import-from-google-button">Import from Google Classroom</button>
          <button onClick={this.openCreateAClassModal} className="quill-button medium primary contained create-a-class-button">Create a class</button>
        </div>
      </div>
      {this.renderPageContent()}
    </div>
  }
}
