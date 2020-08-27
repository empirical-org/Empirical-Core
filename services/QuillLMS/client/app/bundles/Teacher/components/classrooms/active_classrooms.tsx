import * as React from 'react'
import Pusher from 'pusher-js';
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
import CoteacherInvitation from './coteacher_invitation'
import ButtonLoadingIndicator from '../shared/button_loading_indicator'
import BulkArchiveClassesBanner from '../shared/bulk_archive_classes_banner'

import { requestGet } from '../../../../modules/request/index.js';

const emptyClassSrc = `${process.env.CDN_URL}/images/illustrations/empty-class.svg`

interface ActiveClassroomsProps {
  classrooms: Array<any>;
  coteacherInvitations: Array<any>
  user: any;
}

interface ActiveClassroomsState {
  showSnackbar: boolean;
  classrooms: Array<any>;
  coteacherInvitations: Array<any>;
  googleClassrooms: Array<any>;
  showModal?: string;
  googleClassroomsLoading?: boolean;
  attemptedImportGoogleClassrooms?: boolean;
  selectedClassroomId?: number|string;
  snackbarCopy?: string;
}

export const createAClassModal = 'createAClassModal'
export const renameClassModal = 'renameClassModal'
export const changeGradeModal = 'changeGradeModal'
export const archiveClassModal = 'archiveClassModal'
export const inviteStudentsModal = 'inviteStudentsModal'
export const importGoogleClassroomsModal = 'importGoogleClassroomsModal'
export const importGoogleClassroomStudentsModal = 'importGoogleClassroomStudentsModal'
export const googleClassroomEmailModal = 'googleClassroomEmailModal'
export const googleClassroomsEmptyModal = 'googleClassroomsEmptyModal'

export default class ActiveClassrooms extends React.Component<ActiveClassroomsProps, ActiveClassroomsState> {
  constructor(props) {
    super(props)

    this.state = {
      showSnackbar: false,
      classrooms: props.classrooms.filter(classroom => classroom.visible),
      coteacherInvitations: props.coteacherInvitations,
      googleClassrooms: []
    }

    this.openModal = this.openModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.showSnackbar = this.showSnackbar.bind(this)
    this.onSuccess = this.onSuccess.bind(this)
    this.clickClassroomHeader = this.clickClassroomHeader.bind(this)
    this.clickImportGoogleClassrooms = this.clickImportGoogleClassrooms.bind(this)
    this.getClassroomsAndCoteacherInvitations = this.getClassroomsAndCoteacherInvitations.bind(this)
    this.getGoogleClassrooms = this.getGoogleClassrooms.bind(this)
    this.setStateBasedOnParams = this.setStateBasedOnParams.bind(this)
  }

  componentDidMount() {
    this.getGoogleClassrooms()
    this.setStateBasedOnParams()
  }

  setStateBasedOnParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const modal = urlParams.get('modal')
    const classroom = urlParams.get('classroom')

    let showModal
    let selectedClassroomId = Number(classroom)
    if (modal === 'create-a-class') {
      showModal = createAClassModal
    } else if (modal === 'google-classroom') {
      this.clickImportGoogleClassrooms()
    } else if (modal === 'invite-students') {
      showModal = inviteStudentsModal
    }

    if (showModal || selectedClassroomId) {
      this.setState({ showModal, selectedClassroomId })
    }

  }

  getGoogleClassrooms() {
    if (this.props.user.google_id) {
      this.setState({ googleClassroomsLoading: true}, () => {
        requestGet('/teachers/classrooms/retrieve_google_classrooms', (body) => {
          if (body.quill_retrieval_processing) {
            this.initializePusherForGoogleClassrooms(body.id)
          } else {
            const googleClassrooms = body.classrooms.filter(classroom => !classroom.alreadyImported)
            const newStateObj: any = { googleClassrooms, googleClassroomsLoading: false }
            if (this.state.attemptedImportGoogleClassrooms) {
              newStateObj.attemptedImportGoogleClassrooms = false
              this.setState(newStateObj, this.clickImportGoogleClassrooms)
            } else {
              this.setState(newStateObj)
            }
          };
        })
      })
    }
  }

  initializePusherForGoogleClassrooms(id) {
    if (process.env.RAILS_ENV === 'development') {
      Pusher.logToConsole = true;
    }
    const pusher = new Pusher(process.env.PUSHER_KEY, { encrypted: true, });
    const channelName = String(id)
    const channel = pusher.subscribe(channelName);
    const that = this;
    channel.bind('google-classrooms-retrieved', () => {
      that.getGoogleClassrooms()
      pusher.unsubscribe(channelName)
    });
  }

  getClassroomsAndCoteacherInvitations() {
    requestGet('/teachers/classrooms', (body) => this.setState({ classrooms: body.classrooms.filter(classroom => classroom.visible), coteacherInvitations: body.coteacher_invitations }));
  }

  onSuccess(snackbarCopy) {
    this.getClassroomsAndCoteacherInvitations()
    this.getGoogleClassrooms()
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
    this.setState({ showModal: null}, () => {
      if (callback && typeof(callback) === 'function') {
        callback()
      }
    })
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
    const { classrooms, coteacherInvitations } = this.state
    const ownActiveClassrooms = classrooms.filter(c => {
      const classroomOwner = c.teachers.find(teacher => teacher.classroom_relation === 'owner')
      return c.visible && classroomOwner.id === user.id
    })
    if (classrooms.length === 0 && coteacherInvitations.length === 0) {
      return (<div className="no-active-classes">
        <img src={emptyClassSrc} />
        <p>Every teacher needs a class! Please select one of the buttons on the right to get started.</p>
      </div>)
    } else {
      const coteacherInvitationCards = coteacherInvitations.map(coteacherInvitation => {
        return (<CoteacherInvitation
          coteacherInvitation={coteacherInvitation}
          getClassroomsAndCoteacherInvitations={this.getClassroomsAndCoteacherInvitations}
          key={coteacherInvitation.id}
          showSnackbar={this.showSnackbar}
        />)
      })
      const classroomCards = classrooms.map(classroom => {
        const isOwnedByCurrentUser = !!ownActiveClassrooms.find(c => c.id === classroom.id)
        return (<Classroom
          archiveClass={() => this.openModal(archiveClassModal)}
          changeGrade={() => this.openModal(changeGradeModal)}
          classroom={classroom}
          classrooms={ownActiveClassrooms}
          clickClassroomHeader={this.clickClassroomHeader}
          importGoogleClassroomStudents={() => this.openModal(importGoogleClassroomStudentsModal)}
          inviteStudents={() => this.openModal(inviteStudentsModal)}
          isOwnedByCurrentUser={isOwnedByCurrentUser}
          key={classroom.id}
          onSuccess={this.onSuccess}
          renameClass={() => this.openModal(renameClassModal)}
          selected={classroom.id === this.state.selectedClassroomId}
          user={user}
        />)
      })
      return (<div className="active-classes">
        {coteacherInvitationCards}
        {classroomCards}
      </div>)
    }
  }

  renderCreateAClassModal() {
    if (this.state.showModal === createAClassModal) {
      return (<CreateAClassModal
        close={() => this.closeModal(this.getClassroomsAndCoteacherInvitations)}
        showSnackbar={this.showSnackbar}
      />)
    }
  }

  renderInviteStudentsModal() {
    const { showModal, classrooms, selectedClassroomId } = this.state
    const selectedClassroom = classrooms.find(c => c.id === selectedClassroomId)
    if (showModal === inviteStudentsModal && selectedClassroom) {
      return (<InviteStudentsModal
        classroom={selectedClassroom}
        close={() => this.closeModal(this.getClassroomsAndCoteacherInvitations)}
        showSnackbar={this.showSnackbar}
      />)
    }
  }

  renderRenameClassModal() {
    const { showModal, classrooms, selectedClassroomId } = this.state
    const selectedClassroom = classrooms.find(c => c.id === selectedClassroomId)
    if (showModal === renameClassModal && selectedClassroom) {
      return (<RenameClassModal
        classroom={selectedClassroom}
        close={this.closeModal}
        onSuccess={this.onSuccess}
      />)
    }
  }

  renderChangeGradeModal() {
    const { showModal, classrooms, selectedClassroomId } = this.state
    const selectedClassroom = classrooms.find(c => c.id === selectedClassroomId)
    if (showModal === changeGradeModal && selectedClassroom) {
      return (<ChangeGradeModal
        classroom={selectedClassroom}
        close={this.closeModal}
        onSuccess={this.onSuccess}
      />)
    }
  }

  renderArchiveClassModal() {
    const { showModal, classrooms, selectedClassroomId } = this.state
    const selectedClassroom = classrooms.find(c => c.id === selectedClassroomId)
    if (showModal === archiveClassModal && selectedClassroom) {
      return (<ArchiveClassModal
        classroom={selectedClassroom}
        close={this.closeModal}
        onSuccess={this.onSuccess}
      />)
    }
  }

  renderImportGoogleClassroomStudentsModal() {
    const { user, } = this.props
    const { showModal, classrooms, selectedClassroomId } = this.state
    const selectedClassroom = classrooms.find(c => c.id === selectedClassroomId)
    if (showModal === importGoogleClassroomStudentsModal && selectedClassroom) {
      return (<ImportGoogleClassroomStudentsModal
        classroom={selectedClassroom}
        close={this.closeModal}
        onSuccess={this.onSuccess}
      />)
    }
  }

  renderImportGoogleClassroomsModal() {
    const { googleClassrooms, showModal } = this.state
    if (showModal === importGoogleClassroomsModal) {
      return (<ImportGoogleClassroomsModal
        classrooms={googleClassrooms}
        close={this.closeModal}
        onSuccess={this.onSuccess}
        user={this.props.user}
      />)
    }
  }

  renderGoogleClassroomEmailModal() {
    const { showModal } = this.state
    if (showModal === googleClassroomEmailModal) {
      return (<GoogleClassroomEmailModal
        close={this.closeModal}
        user={this.props.user}
      />)
    }
  }

  renderGoogleClassroomsEmptyModal() {
    const { showModal } = this.state
    if (showModal === googleClassroomsEmptyModal) {
      return (<GoogleClassroomsEmptyModal
        close={this.closeModal}
      />)
    }
  }

  renderImportGoogleClassroomsButton() {
    const { googleClassroomsLoading, attemptedImportGoogleClassrooms } = this.state
    let buttonContent: string|JSX.Element = 'Import from Google Classroom'
    let buttonClassName = "quill-button medium secondary outlined import-from-google-button"
    if (googleClassroomsLoading && attemptedImportGoogleClassrooms) {
      buttonContent = <ButtonLoadingIndicator />
      buttonClassName += ' loading'
    }
    return (<button
      className={buttonClassName}
      onClick={this.clickImportGoogleClassrooms}
    >
      {buttonContent}
    </button>)
  }

  render() {
    const { user, } = this.props
    const { classrooms, } = this.state
    const ownedClassrooms = classrooms.filter(c => {
      const classroomOwner = c.teachers.find(t => t.classroom_relation === 'owner')
      return classroomOwner && classroomOwner.id === user.id
    })
    return (<div className="active-classrooms classrooms-page">
      {this.renderCreateAClassModal()}
      {this.renderRenameClassModal()}
      {this.renderChangeGradeModal()}
      {this.renderArchiveClassModal()}
      {this.renderInviteStudentsModal()}
      {this.renderImportGoogleClassroomsModal()}
      {this.renderImportGoogleClassroomStudentsModal()}
      {this.renderGoogleClassroomEmailModal()}
      {this.renderGoogleClassroomsEmptyModal()}
      {this.renderSnackbar()}
      <div className="header">
        <h1>Active Classes</h1>
        <div className="buttons">
          {this.renderImportGoogleClassroomsButton()}
          <button className="quill-button medium primary contained create-a-class-button" onClick={() => this.openModal(createAClassModal)}>Create a class</button>
        </div>
      </div>
      <BulkArchiveClassesBanner classes={ownedClassrooms} onSuccess={this.onSuccess} userId={user.id} />
      {this.renderPageContent()}
    </div>)
  }
}
