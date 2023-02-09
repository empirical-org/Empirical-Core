import * as React from 'react'
import Pusher from 'pusher-js';
import { SortableHandle, } from 'react-sortable-hoc';

import CreateAClassModal from './create_a_class_modal'
import RenameClassModal from './rename_classroom_modal'
import ChangeGradeModal from './change_grade_modal'
import ArchiveClassModal from './archive_classroom_modal'
import InviteStudentsModal from './invite_students_modal'
import ImportCleverClassroomsModal from './import_clever_classrooms_modal'
import ImportGoogleClassroomsModal from './import_google_classrooms_modal'
import ImportCleverClassroomStudentsModal from './import_clever_classroom_students_modal'
import ImportGoogleClassroomStudentsModal from './import_google_classroom_students_modal'
import ReauthorizeCleverModal from './reauthorize_clever_modal'
import LinkCleverAccountModal from './link_clever_account_modal'
import LinkGoogleAccountModal from './link_google_account_modal'
import CleverClassroomsEmptyModal from './clever_classrooms_empty_modal'
import GoogleClassroomsEmptyModal from './google_classrooms_empty_modal'
import Classroom from './classroom'
import CoteacherInvitation from './coteacher_invitation'

import ButtonLoadingIndicator from '../shared/button_loading_indicator'
import BulkArchiveClassesBanner from '../shared/bulk_archive_classes_banner'
import ViewAsStudentModal from '../shared/view_as_student_modal'
import { Snackbar, defaultSnackbarTimeout, SortableList } from '../../../Shared/index'
import { requestGet, requestPut } from '../../../../modules/request/index';

const bookEmptySrc = `${process.env.CDN_URL}/images/illustrations/book-empty.svg`
const cleverIconSrc = `${process.env.CDN_URL}/images/icons/clever.svg`
const googleClassroomIconSrc = `${process.env.CDN_URL}/images/icons/google-classroom.svg`
const reorderSrc = `${process.env.CDN_URL}/images/icons/reorder.svg`

interface ActiveClassroomsProps {
  classrooms: Array<any>;
  cleverLink: string;
  coteacherInvitations: Array<any>;
  user: any;
}

interface ActiveClassroomsState {
  showSnackbar: boolean;
  classrooms: Array<any>;
  coteacherInvitations: Array<any>;
  googleClassrooms: Array<any>;
  cleverClassrooms: Array<any>;
  showModal?: string;
  googleClassroomsLoading?: boolean;
  attemptedImportCleverClassrooms?: boolean;
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
export const importCleverClassroomsModal = 'importCleverClassroomsModal'
export const importCleverClassroomStudentsModal = 'importCleverClassroomStudentsModal'
export const importGoogleClassroomStudentsModal = 'importGoogleClassroomStudentsModal'
export const linkCleverAccountModal = 'linkCleverAccountModal'
export const linkGoogleAccountModal = 'linkGoogleAccountModal'
export const reauthorizeCleverModal = 'reauthorizeCleverModal'
export const cleverClassroomsEmptyModal = 'cleverClassroomsEmptyModal'
export const googleClassroomsEmptyModal = 'googleClassroomsEmptyModal'
export const viewAsStudentModal = 'viewAsStudentModal'

export default class ActiveClassrooms extends React.Component<ActiveClassroomsProps, ActiveClassroomsState> {
  constructor(props) {
    super(props)

    this.state = {
      showSnackbar: false,
      classrooms: props.classrooms.filter(classroom => classroom.visible),
      coteacherInvitations: props.coteacherInvitations,
      cleverClassrooms: [],
      googleClassrooms: []
    }
  }

  componentDidMount() {
    this.getGoogleClassrooms()
    this.setStateBasedOnParams()
  }

  setStateBasedOnParams = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const modal = urlParams.get('modal')
    const classroom = urlParams.get('classroom')

    let showModal
    let selectedClassroomId = Number(classroom) || null
    if (modal === 'create-a-class') {
      showModal = createAClassModal
    } else if (modal === 'google-classroom') {
      this.clickImportGoogleClassrooms()
    } else if (modal === 'invite-students') {
      showModal = inviteStudentsModal
    } else if (modal === 'view-as-student') {
      showModal = viewAsStudentModal
    }

    if (showModal || selectedClassroomId) {
      this.setState({ showModal, selectedClassroomId })
    }
  }

  importCleverClassrooms = () => {
    requestGet('/clever_integration/teachers/retrieve_classrooms', body => {
      if (body.reauthorization_required) {
        this.openModal(reauthorizeCleverModal)
      }
      else if (body.quill_retrieval_processing) {
        this.initializePusherForCleverClassrooms(body.user_id)
      } else {
        const { classrooms_data, existing_clever_ids } = body
        const { classrooms } = classrooms_data
        const cleverClassrooms = classrooms.filter(classroom => !existing_clever_ids.includes(classroom.clever_id))

        this.setState({cleverClassrooms, attemptedImportCleverClassrooms: false})

        if (cleverClassrooms.length) {
          this.openModal(importCleverClassroomsModal)
        } else {
          this.openModal(cleverClassroomsEmptyModal)
        }
      }
    })
  }

  clickImportFromClever = () => {
    const { user } = this.props
    const { clever_id } = user

    if (!clever_id) {
      this.openModal(linkCleverAccountModal)
    } else {
      this.setState({ attemptedImportCleverClassrooms: true })
      this.importCleverClassrooms()
    }
  }

  initializePusherForCleverClassrooms(userId: String) {
    if (process.env.RAILS_ENV === 'development') { Pusher.logToConsole = true }

    const pusher = new Pusher(process.env.PUSHER_KEY, { encrypted: true, });
    const channelName = String(userId)
    const channel = pusher.subscribe(channelName);
    const that = this

    channel.bind('clever-classrooms-retrieved', () => {
      that.importCleverClassrooms()
      pusher.unsubscribe(channelName)
    })
  }

  getGoogleClassrooms = () => {
    const { user } = this.props
    const { clever_id, google_id } = user
    const { attemptedImportGoogleClassrooms } = this.state

    if (!clever_id && google_id) {
      this.setState({ googleClassroomsLoading: true}, () => {
        requestGet('/teachers/classrooms/retrieve_google_classrooms', (body) => {
          if (body.quill_retrieval_processing) {
            this.initializePusherForGoogleClassrooms(body.id)
          } else {
            const googleClassrooms = body.classrooms.filter(classroom => !classroom.alreadyImported)
            const newStateObj: any = { googleClassrooms, googleClassroomsLoading: false }
            if (attemptedImportGoogleClassrooms) {
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
    if (process.env.RAILS_ENV === 'development') { Pusher.logToConsole = true }

    const pusher = new Pusher(process.env.PUSHER_KEY, { encrypted: true, })
    const channelName = String(id)
    const channel = pusher.subscribe(channelName);
    const that = this

    channel.bind('google-classrooms-retrieved', () => {
      that.getGoogleClassrooms()
      pusher.unsubscribe(channelName)
    })
  }

  clickImportCleverClassroomStudents = () => {
    requestGet('/clever_integration/teachers/retrieve_classrooms', body => {
      if (body.reauthorization_required) {
        this.openModal(reauthorizeCleverModal)
      } else {
        this.openModal(importCleverClassroomStudentsModal)
      }
    })
  }

  getClassroomsAndCoteacherInvitations = () => {
    requestGet('/teachers/classrooms', (body) => this.setState({
      classrooms: body.classrooms.filter(classroom => classroom.visible),
      coteacherInvitations: body.coteacher_invitations
    }))
  }

  onSuccess = (snackbarCopy) => {
    this.getClassroomsAndCoteacherInvitations()
    this.getGoogleClassrooms()
    this.showSnackbar(snackbarCopy)
    this.closeModal()
  }

  clickClassroomHeader = (classroomId) => {
    const { selectedClassroomId } = this.state

    if (selectedClassroomId === classroomId) {
      this.setState({ selectedClassroomId: null})
    } else {
      this.setState({ selectedClassroomId: classroomId })
    }
  }

  openModal = (modalName: string) => {
    this.setState({ showModal: modalName })
  }

  closeModal = (callback=null) => {
    this.setState({ showModal: null}, () => {
      if (callback && typeof(callback) === 'function') {
        callback()
      }
    })
  }

  clickImportGoogleClassrooms = () => {
    const { user } = this.props
    const { googleClassrooms, googleClassroomsLoading, } = this.state
    if (!user.google_id) {
      this.openModal(linkGoogleAccountModal)
    } else if (googleClassroomsLoading) {
      this.setState({ attemptedImportGoogleClassrooms: true })
    } else if (googleClassrooms.length) {
      this.openModal(importGoogleClassroomsModal)
    } else {
      this.openModal(googleClassroomsEmptyModal)
    }
  }

  showSnackbar = (snackbarCopy) => {
    this.setState({ showSnackbar: true, snackbarCopy }, () => {
      setTimeout(() => this.setState({ showSnackbar: false, }), defaultSnackbarTimeout)
    })
  }

  viewAsStudent = (id=null) => {
    if (id) {
      window.location.href = `/teachers/preview_as_student/${id}`
    } else {
      this.openModal(viewAsStudentModal)
    }
  }

  renderSnackbar() {
    const { showSnackbar, snackbarCopy, } = this.state
    return <Snackbar text={snackbarCopy} visible={showSnackbar} />
  }

  sortClassrooms = (sortedClassroomObjects) => {
    const newlySortedClassrooms = sortedClassroomObjects.map((classroomObject, i) => {
      const { props } = classroomObject;
      const { children } = props;
      let classroom = children[1].props.classroom
      classroom.order = i
      return classroom;
    });
    requestPut('/classrooms_teachers/update_order', { updated_classrooms: JSON.stringify(newlySortedClassrooms) }, body => {
      const { classrooms } = body;
      if(classrooms) {
        this.setState({ classrooms: newlySortedClassrooms });
      }
    })
  }

  getClassroomCardsWithHandle(classroomCards) {
    // using a div as the outer element instead of a button here because something about default button behavior overrides the keypress handling by sortablehandle
    const DragHandle = SortableHandle(() => <div className="focus-on-light" role="button" tabIndex={0}><img alt="Reorder icon" className="reorder-icon" src={reorderSrc} /></div>);
    const handle = <span className='reorder-classroom-item'><DragHandle /></span>

    return classroomCards.map(card => {
      return (
        <React.Fragment key={`classroom-card-item-${card.key}`}>
          {handle}
          {card}
        </React.Fragment>
      )
    })
  }

  renderClassroomRows(ownActiveClassrooms) {
    const classroomCards = this.renderClassroomCards(ownActiveClassrooms)
    const rows = this.getClassroomCardsWithHandle(classroomCards)

    return (
      <SortableList
        axis="y"
        data={rows}
        helperClass="sortable-classroom"
        sortCallback={this.sortClassrooms}
        useDragHandle={true}
      />
    )
  }

  renderClassroomCards(ownActiveClassrooms) {
    const { user } = this.props
    const { classrooms, selectedClassroomId } = this.state

    return classrooms.map(classroom => {
      const isOwnedByCurrentUser = !!ownActiveClassrooms.find(c => c.id === classroom.id)

      return (
        <Classroom
          archiveClass={() => this.openModal(archiveClassModal)}
          changeGrade={() => this.openModal(changeGradeModal)}
          classroom={classroom}
          classrooms={ownActiveClassrooms}
          clickClassroomHeader={this.clickClassroomHeader}
          importCleverClassroomStudents={this.clickImportCleverClassroomStudents}
          importGoogleClassroomStudents={() => this.openModal(importGoogleClassroomStudentsModal)}
          inviteStudents={() => this.openModal(inviteStudentsModal)}
          isOwnedByCurrentUser={isOwnedByCurrentUser}
          key={classroom.id}
          onSuccess={this.onSuccess}
          renameClass={() => this.openModal(renameClassModal)}
          selected={classroom.id === selectedClassroomId}
          user={user}
          viewAsStudent={this.viewAsStudent}
        />
      )
    });
  }

  getOwnActiveClassrooms(classrooms) {
    const { user } = this.props
    return classrooms.filter(c => {
      const classroomOwner = c.teachers.find(teacher => teacher.classroom_relation === 'owner')
      return c.visible && classroomOwner.id === user.id
    })
  }

  renderPageContent() {
    const { classrooms, coteacherInvitations } = this.state
    const ownActiveClassrooms = this.getOwnActiveClassrooms(classrooms)
    if (classrooms.length === 0 && coteacherInvitations.length === 0) {

      return (
        <div className="no-active-classes">
          <img alt="Gray book, open and blank" src={bookEmptySrc} />
          <h2>Add your first class</h2>
          <p>All teachers need a class! Choose to create or import your classes. </p>
        </div>
      )
    } else {
      const coteacherInvitationCards = coteacherInvitations.map(coteacherInvitation => {
        return (
          <CoteacherInvitation
            coteacherInvitation={coteacherInvitation}
            getClassroomsAndCoteacherInvitations={this.getClassroomsAndCoteacherInvitations}
            key={coteacherInvitation.id}
            showSnackbar={this.showSnackbar}
          />
        )
      })
      const classroomCards = this.renderClassroomRows(ownActiveClassrooms);
      return (
        <div className="active-classes">
          {coteacherInvitationCards}
          {classroomCards}
        </div>
      )
    }
  }

  renderCreateAClassModal() {
    const { showModal } = this.state
    if (showModal === createAClassModal) {
      return (
        <CreateAClassModal
          close={() => this.closeModal(this.getClassroomsAndCoteacherInvitations)}
          showSnackbar={this.showSnackbar}
        />
      )
    }
  }

  renderInviteStudentsModal() {
    const { showModal, classrooms, selectedClassroomId } = this.state
    const selectedClassroom = classrooms.find(c => c.id === selectedClassroomId)
    if (showModal === inviteStudentsModal && selectedClassroom) {
      return (
        <InviteStudentsModal
          classroom={selectedClassroom}
          close={() => this.closeModal(this.getClassroomsAndCoteacherInvitations)}
          showSnackbar={this.showSnackbar}
        />
      )
    }
  }

  renderRenameClassModal() {
    const { showModal, classrooms, selectedClassroomId } = this.state
    const selectedClassroom = classrooms.find(c => c.id === selectedClassroomId)
    if (showModal === renameClassModal && selectedClassroom) {
      return (
        <RenameClassModal
          classroom={selectedClassroom}
          close={this.closeModal}
          onSuccess={this.onSuccess}
        />
      )
    }
  }

  renderChangeGradeModal() {
    const { showModal, classrooms, selectedClassroomId } = this.state
    const selectedClassroom = classrooms.find(c => c.id === selectedClassroomId)
    if (showModal === changeGradeModal && selectedClassroom) {
      return (
        <ChangeGradeModal
          classroom={selectedClassroom}
          close={this.closeModal}
          onSuccess={this.onSuccess}
        />
      )
    }
  }

  renderArchiveClassModal() {
    const { showModal, classrooms, selectedClassroomId } = this.state
    const selectedClassroom = classrooms.find(c => c.id === selectedClassroomId)
    if (showModal === archiveClassModal && selectedClassroom) {
      return (
        <ArchiveClassModal
          classroom={selectedClassroom}
          close={this.closeModal}
          onSuccess={this.onSuccess}
        />
      )
    }
  }

  renderImportCleverClassroomStudentsModal() {
    const { showModal, classrooms, selectedClassroomId } = this.state
    const selectedClassroom = classrooms.find(c => c.id === selectedClassroomId)

    if (showModal === importCleverClassroomStudentsModal && selectedClassroom) {
      return (
        <ImportCleverClassroomStudentsModal
          classroom={selectedClassroom}
          close={this.closeModal}
          onSuccess={this.onSuccess}
        />
      )
    }
  }

  renderImportGoogleClassroomStudentsModal() {
    const { showModal, classrooms, selectedClassroomId } = this.state
    const selectedClassroom = classrooms.find(c => c.id === selectedClassroomId)
    if (showModal === importGoogleClassroomStudentsModal && selectedClassroom) {
      return (
        <ImportGoogleClassroomStudentsModal
          classroom={selectedClassroom}
          close={this.closeModal}
          onSuccess={this.onSuccess}
        />
      )
    }
  }

  renderImportCleverClassroomsModal() {
    const { user } = this.props
    const { cleverClassrooms, showModal } = this.state

    if (showModal === importCleverClassroomsModal) {
      return (
        <ImportCleverClassroomsModal
          classrooms={cleverClassrooms}
          close={this.closeImportCleverClassroomsModal}
          onSuccess={this.onSuccess}
          user={user}
        />
      )
    }
  }

  closeImportCleverClassroomsModal = () => { this.closeModal(this.resetAttemptedImportCleverClassrooms) }
  resetAttemptedImportCleverClassrooms = () => { this.setState({attemptedImportCleverClassrooms: false}) }

  renderImportGoogleClassroomsModal() {
    const { user } = this.props
    const { googleClassrooms, showModal } = this.state
    if (showModal === importGoogleClassroomsModal) {
      return (
        <ImportGoogleClassroomsModal
          classrooms={googleClassrooms}
          close={this.closeModal}
          onSuccess={this.onSuccess}
          user={user}
        />
      )
    }
  }

  renderLinkCleverAccountModal() {
    const { cleverLink, user } = this.props
    const { showModal } = this.state
    if (showModal === linkCleverAccountModal) {
      return (
        <LinkCleverAccountModal
          cleverLink={cleverLink}
          close={this.closeModal}
          user={user}
        />
      )
    }
  }

  renderLinkGoogleAccountModal() {
    const { user } = this.props
    const { showModal } = this.state
    if (showModal === linkGoogleAccountModal) {
      return (
        <LinkGoogleAccountModal
          close={this.closeModal}
          user={user}
        />
      )
    }
  }

  renderCleverClassroomsEmptyModal() {
    const { showModal } = this.state
    if (showModal === cleverClassroomsEmptyModal) {
      return (
        <CleverClassroomsEmptyModal
          close={this.closeModal}
        />
      )
    }
  }

  renderGoogleClassroomsEmptyModal() {
    const { showModal } = this.state
    if (showModal === googleClassroomsEmptyModal) {
      return (
        <GoogleClassroomsEmptyModal
          close={this.closeModal}
        />
      )
    }
  }

  renderReauthorizeCleverModal() {
    const { cleverLink } = this.props
    const { showModal } = this.state
    if (showModal === reauthorizeCleverModal) {
      return (
        <ReauthorizeCleverModal
          cleverLink={cleverLink}
          close={this.closeModal}
        />
      )
    }
  }

  renderCreateAClassButton() {
    return (
      <button
        className="quill-button medium primary contained create-a-class-button"
        onClick={() => this.openModal(createAClassModal)}
        type="button"
      >
        Create a class
      </button>
    )
  }

  renderImportFromCleverButton() {
    const { user } = this.props
    const { clever_id, google_id } = user
    const { attemptedImportCleverClassrooms } = this.state
    let buttonContent: string|JSX.Element = 'Import from Clever'
    let buttonClassName = "interactive-wrapper import-from-clever-button"

    if (!clever_id && google_id) { return null }

    if (attemptedImportCleverClassrooms) {
      buttonContent = <React.Fragment>Import from Clever<ButtonLoadingIndicator /></React.Fragment>
      buttonClassName += ' loading'
    }

    return (
      <button className={buttonClassName} onClick={this.clickImportFromClever} type="button">
        <img alt="Clever Icon" className='import-from-clever-button-icon' src={cleverIconSrc} />
        {buttonContent}
      </button>
    )
  }

  renderImportFromGoogleClassroomButton() {
    const { user } = this.props
    const { clever_id, google_id } = user

    const { googleClassroomsLoading, attemptedImportGoogleClassrooms } = this.state
    let buttonContent: string|JSX.Element = ' Import from Google Classroom'
    let buttonClassName = "interactive-wrapper import-from-google-button"

    if (!google_id && clever_id) { return null }

    if (googleClassroomsLoading && attemptedImportGoogleClassrooms) {
      buttonContent = <React.Fragment>Import from Google Classroom<ButtonLoadingIndicator /></React.Fragment>
      buttonClassName += ' loading'
    }

    return (
      <button className={buttonClassName} onClick={this.clickImportGoogleClassrooms} type="button">
        <img alt="Google Classroom Icon" className='import-from-google-button-icon' src={googleClassroomIconSrc} />
        {buttonContent}
      </button>
    )
  }

  renderViewAsStudentModal = () => {
    const { selectedClassroomId, classrooms, } = this.state
    const { showModal, } = this.state
    if (showModal === viewAsStudentModal) {
      return (
        <ViewAsStudentModal
          classrooms={classrooms}
          close={this.closeModal}
          defaultClassroomId={selectedClassroomId}
          handleViewClick={this.viewAsStudent}
        />
      )
    }
  }

  renderHeader() {
    return (
      <div className="header">
        <h1>Active Classes</h1>
        <div className="buttons">
          {this.renderImportFromCleverButton()}
          {this.renderImportFromGoogleClassroomButton()}
          {this.renderCreateAClassButton()}
        </div>
      </div>
    )
  }

  renderBulkArchiveClassesBanner() {
    const { user, } = this.props
    const { classrooms, } = this.state
    const ownedClassrooms = classrooms.filter(c => {
      const classroomOwner = c.teachers.find(t => t.classroom_relation === 'owner')
      return classroomOwner && classroomOwner.id === user.id
    })

    return (
      <BulkArchiveClassesBanner
        classes={ownedClassrooms}
        onSuccess={this.onSuccess}
        userId={user.id}
      />
    )
  }

  render() {
    return (
      <div className="active-classrooms classrooms-page">
        {this.renderCreateAClassModal()}
        {this.renderRenameClassModal()}
        {this.renderChangeGradeModal()}
        {this.renderArchiveClassModal()}
        {this.renderInviteStudentsModal()}
        {this.renderImportCleverClassroomsModal()}
        {this.renderImportGoogleClassroomsModal()}
        {this.renderImportCleverClassroomStudentsModal()}
        {this.renderImportGoogleClassroomStudentsModal()}
        {this.renderReauthorizeCleverModal()}
        {this.renderLinkCleverAccountModal()}
        {this.renderLinkGoogleAccountModal()}
        {this.renderCleverClassroomsEmptyModal()}
        {this.renderGoogleClassroomsEmptyModal()}
        {this.renderViewAsStudentModal()}
        {this.renderSnackbar()}
        {this.renderBulkArchiveClassesBanner()}
        {this.renderHeader()}
        {this.renderPageContent()}
      </div>
    )
  }
}
