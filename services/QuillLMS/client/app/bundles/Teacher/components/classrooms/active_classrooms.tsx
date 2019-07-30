import * as React from 'react'
import { Snackbar, defaultSnackbarTimeout } from 'quill-component-library/dist/componentLibrary'

import CreateAClassModal from './create_a_class_modal'
import RenameClassModal from './rename_classroom_modal'
import ChangeGradeModal from './change_grade_modal'
import ArchiveClassModal from './archive_classroom_modal'
import InviteStudentsModal from './invite_students_modal'
import ImportGoogleClassroomsModal from './import_google_classrooms_modal'
import Classroom from './classroom'
import ButtonLoadingIndicator from '../shared/button_loading_indicator'

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
  showImportGoogleClassroomsModal: boolean;
  showSnackbar: boolean;
  classrooms: Array<any>;
  googleClassrooms: Array<any>;
  googleClassroomsLoading?: boolean;
  attemptedImportGoogleClassrooms?: boolean;
  selectedClassroomId?: number;
  snackbarCopy?: string;
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
      showImportGoogleClassroomsModal: false,
      showSnackbar: false,
      classrooms: props.classrooms.filter(classroom => classroom.visible),
      googleClassrooms: []
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
    this.clickImportGoogleClassrooms = this.clickImportGoogleClassrooms.bind(this)
    this.closeImportGoogleClassroomsModal = this.closeInviteStudentsModal.bind(this)
    this.showSnackbar = this.showSnackbar.bind(this)
    this.onSuccess = this.onSuccess.bind(this)
    this.clickClassroomHeader = this.clickClassroomHeader.bind(this)
    this.getClassrooms = this.getClassrooms.bind(this)
  }

  componentDidMount() {
    if (this.props.user.google_id) {
      this.setState({ googleClassroomsLoading: true}, () => {
        requestGet('/teachers/classrooms/retrieve_google_classrooms', (body) => {
          const googleClassrooms = body.classrooms.filter(classroom => !classroom.alreadyImported)
          const newStateObj = { googleClassrooms, googleClassroomsLoading: false }
          if (this.state.attemptedImportGoogleClassrooms) {
            this.setState(newStateObj, this.clickImportGoogleClassrooms)
          } else {
            this.setState(newStateObj)
          }
        });
      })
    } else {
      this.setState({ googleClassroomsLoading: false })
    }
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

  clickImportGoogleClassrooms() {
    const { googleClassrooms, googleClassroomsLoading, } = this.state
    if (googleClassroomsLoading) {
      this.setState({ attemptedImportGoogleClassrooms: true })
    } else if (googleClassrooms.length) {
      this.setState({ showImportGoogleClassroomsModal: true })
    }
  }

  closeImportGoogleClassroomsModal() {
    this.setState({ showImportGoogleClassroomsModal: false })
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

  renderImportGoogleClassroomsModal() {
    const { googleClassrooms, showImportGoogleClassroomsModal } = this.state
    if (showImportGoogleClassroomsModal) {
      return <ImportGoogleClassroomsModal
        close={this.closeImportGoogleClassroomsModal}
        onSuccess={this.onSuccess}
        classrooms={googleClassrooms}
        user={this.props.user}
      />
    }
  }

  renderImportGoogleClassroomsButton() {
    const { googleClassroomsLoading, attemptedImportGoogleClassrooms } = this.state
    let buttonContent = 'Import from Google Classroom'
    if (googleClassroomsLoading && attemptedImportGoogleClassrooms) {
      buttonContent = <ButtonLoadingIndicator />
    }
    return (<button
      onClick={this.clickImportGoogleClassrooms}
      className="quill-button medium secondary outlined import-from-google-button"
    >
      {buttonContent}
    </button>)
  }

  render() {
    return <div className="active-classrooms classrooms-page">
      {this.renderCreateAClassModal()}
      {this.renderRenameClassModal()}
      {this.renderChangeGradeModal()}
      {this.renderArchiveClassModal()}
      {this.renderInviteStudentsModal()}
      {this.renderImportGoogleClassroomsModal()}
      {this.renderSnackbar()}
      <div className="header">
        <h1>Active Classes</h1>
        <div className="buttons">
          {this.renderImportGoogleClassroomsButton()}
          <button onClick={this.openCreateAClassModal} className="quill-button medium primary contained create-a-class-button">Create a class</button>
        </div>
      </div>
      {this.renderPageContent()}
    </div>
  }
}
