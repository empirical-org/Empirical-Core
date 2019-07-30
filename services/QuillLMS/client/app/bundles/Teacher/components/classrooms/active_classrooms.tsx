import * as React from 'react'
import { Snackbar, defaultSnackbarTimeout } from 'quill-component-library/dist/componentLibrary'

import CreateAClassModal from './create_a_class_modal'
import RenameClassModal from './rename_classroom_modal'
import ChangeGradeModal from './change_grade_modal'
import ArchiveClassModal from './archive_classroom_modal'
import InviteStudentsModal from './invite_students_modal'
import ImportGoogleClassroomsModal from './import_google_classrooms_modal'
import ImportGoogleClassroomStudentsModal from './import_google_classroom_students_modal'
import GoogleClassroomEmailModal from './google_classroom_email_modal'
import GoogleClassroomsEmptyModal from './google_classrooms_empty_modal'
import Classroom from './classroom'
import ButtonLoadingIndicator from '../shared/button_loading_indicator'

import { requestGet } from '../../../../modules/request/index.js';

const emptyClassSrc = `${process.env.CDN_URL}/images/illustrations/empty-class.svg`

interface ActiveClassroomsProps {
  classrooms: Array<any>;
  user: any;
}

interface ActiveClassroomsState {
  showSnackbar: boolean;
  classrooms: Array<any>;
  googleClassrooms: Array<any>;
  showModal?: string;
  googleClassroomsLoading?: boolean;
  attemptedImportGoogleClassrooms?: boolean;
  selectedClassroomId?: number;
  snackbarCopy?: string;
}

const createAClassModal = 'createAClassModal'
const renameClassModal = 'showRenameClassModal'
const changeGradeModal = 'showChangeGradeModal'
const archiveClassModal = 'showArchiveClassModal'
const inviteStudentsModal = 'showInviteStudentsModal'
const importGoogleClassroomsModal = 'showImportGoogleClassroomsModal'
const importGoogleClassroomStudentsModal = 'showImportGoogleClassroomStudentsModal'
const googleClassroomEmailModal = 'showGoogleClassroomEmailModal'
const googleClassroomsEmptyModal = 'showGoogleClassroomsEmptyModal'

export default class ActiveClassrooms extends React.Component<ActiveClassroomsProps, ActiveClassroomsState> {
  constructor(props) {
    super(props)

    this.state = {
      showSnackbar: false,
      classrooms: props.classrooms.filter(classroom => classroom.visible),
      googleClassrooms: []
    }

    this.openModal = this.openModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.showSnackbar = this.showSnackbar.bind(this)
    this.onSuccess = this.onSuccess.bind(this)
    this.clickClassroomHeader = this.clickClassroomHeader.bind(this)
    this.clickImportGoogleClassrooms = this.clickImportGoogleClassrooms.bind(this)
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
    this.closeModal()
  }

  clickClassroomHeader(classroomId) {
    if (this.state.selectedClassroomId === classroomId) {
      this.setState({ selectedClassroomId: null})
    } else {
      this.setState({ selectedClassroomId: classroomId })
    }
  }

  openModal(modalName) {
    this.setState({ showModal: modalName })
  }

  closeModal(callback=null) {
    this.setState({ showModal: null}, callback)
  }

  clickImportGoogleClassrooms() {
    const { user } = this.props
    const { googleClassrooms, googleClassroomsLoading, } = this.state
    if (!user.google_id) {
      this.openModal(googleClassroomEmailModal)
    } else if (googleClassroomsLoading) {
      this.setState({ attemptedImportGoogleClassrooms: true })
    } else if (googleClassrooms.length) {
      this.openModal(importGoogleClassroomsModal)
    } else {
      this.openModal(googleClassroomsEmptyModal)
    }
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
          renameClass={() => this.openModal(renameClassModal)}
          changeGrade={() => this.openModal(changeGradeModal)}
          archiveClass={() => this.openModal(archiveClassModal)}
          inviteStudents={() => this.openModal(inviteStudentsModal)}
          importGoogleClassroomStudents={() => this.openModal(importGoogleClassroomStudentsModal)}
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
    if (this.state.showModal === createAClassModal) {
      return <CreateAClassModal
        close={() => this.closeModal(this.getClassrooms)}
        showSnackbar={this.showSnackbar}
      />
    }
  }

  renderInviteStudentsModal() {
    const { showModal, classrooms, selectedClassroomId } = this.state
    const selectedClassroom = classrooms.find(c => c.id === selectedClassroomId)
    if (showModal === inviteStudentsModal) {
      return <InviteStudentsModal
        close={() => this.closeModal(this.getClassrooms)}
        showSnackbar={this.showSnackbar}
        classroom={selectedClassroom}
      />
    }
  }

  renderRenameClassModal() {
    const { showModal, classrooms, selectedClassroomId } = this.state
    if (showModal === renameClassModal) {
      const selectedClassroom = classrooms.find(c => c.id === selectedClassroomId)
      return <RenameClassModal
        close={this.closeModal}
        onSuccess={this.onSuccess}
        classroom={selectedClassroom}
      />
    }
  }

  renderChangeGradeModal() {
    const { showModal, classrooms, selectedClassroomId } = this.state
    if (showModal === changeGradeModal) {
      const selectedClassroom = classrooms.find(c => c.id === selectedClassroomId)
      return <ChangeGradeModal
        close={this.closeModal}
        onSuccess={this.onSuccess}
        classroom={selectedClassroom}
      />
    }
  }

  renderArchiveClassModal() {
    const { showModal, classrooms, selectedClassroomId } = this.state
    if (showModal === archiveClassModal) {
      const selectedClassroom = classrooms.find(c => c.id === selectedClassroomId)
      return <ArchiveClassModal
        close={this.closeModal}
        onSuccess={this.onSuccess}
        classroom={selectedClassroom}
      />
    }
  }

  renderImportGoogleClassroomStudentsModal() {
    const { showModal, classrooms, selectedClassroomId } = this.state
    if (showModal === importGoogleClassroomStudentsModal) {
      const selectedClassroom = classrooms.find(c => c.id === selectedClassroomId)
      return <ImportGoogleClassroomStudentsModal
        close={this.closeModal}
        onSuccess={this.onSuccess}
        classroom={selectedClassroom}
      />
    }
  }

  renderImportGoogleClassroomsModal() {
    const { googleClassrooms, showModal } = this.state
    if (showModal === importGoogleClassroomsModal) {
      return <ImportGoogleClassroomsModal
        close={this.closeModal}
        onSuccess={this.onSuccess}
        classrooms={googleClassrooms}
        user={this.props.user}
      />
    }
  }

  renderGoogleClassroomEmailModal() {
    const { showModal } = this.state
    if (showModal === googleClassroomEmailModal) {
      return <GoogleClassroomEmailModal
        close={this.closeModal}
        onSuccess={this.onSuccess}
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
      {this.renderImportGoogleClassroomStudentsModal()}
      {this.renderGoogleClassroomEmailModal()}
      {this.renderSnackbar()}
      <div className="header">
        <h1>Active Classes</h1>
        <div className="buttons">
          {this.renderImportGoogleClassroomsButton()}
          <button onClick={() => this.openModal(createAClassModal)} className="quill-button medium primary contained create-a-class-button">Create a class</button>
        </div>
      </div>
      {this.renderPageContent()}
    </div>
  }
}
