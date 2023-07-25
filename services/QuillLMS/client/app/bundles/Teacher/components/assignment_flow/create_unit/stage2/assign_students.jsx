import Pusher from 'pusher-js';
import React from 'react';

import ClassroomCard from './classroom_card.tsx';
import CreateAClassInlineForm from './create_a_class_inline_form.tsx';

import { requestGet } from '../../../../../../modules/request';
import { Snackbar, defaultSnackbarTimeout } from '../../../../../Shared/index';
import CleverClassroomsEmptyModal from '../../../classrooms/clever_classrooms_empty_modal.tsx';
import GoogleClassroomsEmptyModal from '../../../classrooms/google_classrooms_empty_modal.tsx';
import ImportCleverClassroomsModal from '../../../classrooms/import_clever_classrooms_modal.tsx';
import ImportGoogleClassroomsModal from '../../../classrooms/import_google_classrooms_modal.tsx';
import LinkCleverAccountModal from '../../../classrooms/link_clever_account_modal.tsx';
import LinkGoogleAccountModal from '../../../classrooms/link_google_account_modal.tsx';
import ReauthorizeCleverModal from '../../../classrooms/reauthorize_clever_modal';
import ButtonLoadingIndicator from '../../../shared/button_loading_indicator';

const cleverIconSrc = `${process.env.CDN_URL}/images/icons/clever.svg`
const googleClassroomIconSrc = `${process.env.CDN_URL}/images/icons/google-classroom.svg`
const emptyClassSrc = `${process.env.CDN_URL}/images/illustrations/empty-class.svg`
const smallWhiteCheckSrc = `${process.env.CDN_URL}/images/shared/check-small-white.svg`
const indeterminateSrc = `${process.env.CDN_URL}/images/icons/indeterminate.svg`

export const createAClassForm = 'createAClassForm'
export const importCleverClassroomsModal = 'importCleverClassroomsModal'
export const importGoogleClassroomsModal = 'importGoogleClassroomsModal'
export const linkCleverAccountModal = 'linkCleverAccountModal'
export const linkGoogleAccountModal = 'linkGoogleAccountModal'
export const reauthorizeCleverModal = 'reauthorizeCleverModal'
export const cleverClassroomsEmptyModal = 'cleverClassroomsEmptyModal'
export const googleClassroomsEmptyModal = 'googleClassroomsEmptyModal'

export default class AssignStudents extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      cleverClassrooms: [],
      googleClassrooms: [],
      showFormOrModal: false
    }
  }

  componentDidMount() {
    this.getGoogleClassrooms()
  }

  onSuccess = snackbarCopy => {
    const { fetchClassrooms } = this.props
    fetchClassrooms()
    this.getGoogleClassrooms()
    this.showSnackbar(snackbarCopy)
    this.closeFormOrModal()
  };

  importCleverClassrooms = () => {
    requestGet('/clever_integration/teachers/retrieve_classrooms', body => {
      if (body.reauthorization_required) {
        this.openFormOrModal(reauthorizeCleverModal)
      }
      else if (body.quill_retrieval_processing) {
        this.initializePusherForCleverClassrooms(body.user_id)
      } else {
        const { classrooms_data } = body
        const { classrooms } = classrooms_data
        const cleverClassrooms = classrooms.filter(classroom => !classroom.alreadyImported)

        this.setState({cleverClassrooms, attemptedImportCleverClassrooms: false})

        if (cleverClassrooms.length) {
          this.openFormOrModal(importCleverClassroomsModal)
        } else {
          this.openFormOrModal(cleverClassroomsEmptyModal)
        }
      }
    })
  }

  clickImportFromClever = () => {
    const { user } = this.props
    const { clever_id } = user

    if (!clever_id) {
      this.openFormOrModal(linkCleverAccountModal)
    } else {
      this.setState({ attemptedImportCleverClassrooms: true })
      this.importCleverClassrooms()
    }
  }

  initializePusherForCleverClassrooms(userId) {
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
    const { google_id } = user
    const { attemptedImportGoogleClassrooms } = this.state

    if (user && google_id) {
      this.setState({ googleClassroomsLoading: true}, () => {
        requestGet('/google_integration/teachers/retrieve_classrooms', (body) => {
          if (body.quill_retrieval_processing) {
            this.initializePusherForGoogleClassrooms(body.user_id)
          } else {
            const googleClassrooms = body.classrooms.filter(classroom => !classroom.alreadyImported)
            const newStateObj = { googleClassrooms, googleClassroomsLoading: false, }
            if (attemptedImportGoogleClassrooms) {
              newStateObj.attemptedImportGoogleClassrooms = false
              this.setState(newStateObj, this.clickImportGoogleClassrooms)
            } else {
              this.setState(newStateObj)
            }
          }
        });
      })
    }
  };

  initializePusherForGoogleClassrooms = (id) => {
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

  clickImportGoogleClassrooms = () => {
    const { user } = this.props
    const { google_id } = user
    const { googleClassrooms, googleClassroomsLoading, } = this.state
    if (!google_id) {
      this.openFormOrModal(linkGoogleAccountModal)
    } else if (googleClassroomsLoading) {
      this.setState({ attemptedImportGoogleClassrooms: true, })
    } else if (googleClassrooms.length) {
      this.openFormOrModal(importGoogleClassroomsModal)
    } else {
      this.openFormOrModal(googleClassroomsEmptyModal)
    }
  };

  closeFormOrModal = (callback=null) => {
    this.setState({ showFormOrModal: null}, () => {
      if (callback && typeof(callback) === 'function') {
        callback()
      }
    })
  };

  openFormOrModal = modalName => {
    this.setState({ showFormOrModal: modalName })
  };

  showSnackbar = snackbarCopy => {
    this.setState({ showSnackbar: true, snackbarCopy }, () => {
      setTimeout(() => this.setState({ showSnackbar: false, }), defaultSnackbarTimeout)
    })
  };

  renderAllClassroomsCheckbox() {
    const { classrooms, toggleClassroomSelection} = this.props
    if (classrooms.length <= 1) { return null }

    const selectedClassrooms = classrooms.filter((c) => {
      const { students, classroom, } = c
      const selectedStudents = students && students.length ? students.filter(s => s.isSelected) : []
      return !!(classroom.emptyClassroomSelected || selectedStudents.length)
    })

    let checkbox = <span className="quill-checkbox unselected" onClick={() => toggleClassroomSelection(null, true)} />
    if (selectedClassrooms.length === classrooms.length) {
      checkbox = (<span className="quill-checkbox selected" onClick={() => toggleClassroomSelection(null, false)}>
        <img alt="check" src={smallWhiteCheckSrc} />
      </span>)
    } else if (selectedClassrooms.length) {
      checkbox = (<span className="quill-checkbox selected" onClick={() => toggleClassroomSelection(null, false)}>
        <img alt="check" src={indeterminateSrc} />
      </span>)
    }
    return (
      <div className="all-classes-checkbox">
        {checkbox}
        <span className="all-classes-text">All classes and students</span>
      </div>
    )
  }

  renderClassroom(c) {
    const { toggleClassroomSelection, toggleStudentSelection, lockedClassroomIds, lockedMessage, } = this.props
    const { classroom, students, } = c
    return <ClassroomCard classroom={classroom} lockedClassroomIds={lockedClassroomIds} lockedMessage={lockedMessage} students={students} toggleClassroomSelection={toggleClassroomSelection} toggleStudentSelection={toggleStudentSelection} />
  }

  renderClassroomList() {
    const { classrooms, } = this.props
    const { showFormOrModal } = this.state

    if (classrooms && classrooms.length) {
      const classroomElements = classrooms.map(c => this.renderClassroom(c))
      return (
        <div className="classrooms">
          {classroomElements}
        </div>
      )
    } else if (showFormOrModal !== createAClassForm) {
      return (
        <div className="no-active-classes">
          <img alt="empty class" src={emptyClassSrc} />
          <p>Your classrooms will appear here. Add a class to get started.</p>
        </div>
      )
    }
  }

  renderClassroomsSection() {
    return (
      <div className="assignment-section">
        <div className="assignment-section-header assign-students">
          <div className="number-and-name">
            <span className="assignment-section-number">3</span>
            <span className="assignment-section-name">Choose classes or students</span>
          </div>
          <div className="import-or-create-classroom-buttons">
            {this.renderImportFromCleverButton()}
            {this.renderImportFromGoogleClassroomButton()}
            <button
              className="quill-button medium secondary outlined create-a-class-button"
              onClick={() => this.openFormOrModal(createAClassForm)}
              type="button"
            >
            Create a class
            </button>
          </div>
        </div>
        <div className="assignment-section-body">
          {this.renderCreateAClassInlineForm()}
          {this.renderAllClassroomsCheckbox()}
          {this.renderClassroomList()}
        </div>
      </div>
    )
  }

  renderCreateAClassInlineForm() {
    const { showFormOrModal } = this.state

    if (showFormOrModal === createAClassForm) {
      return (
        <CreateAClassInlineForm
          cancel={this.closeFormOrModal}
          onSuccess={this.onSuccess}
        />
      )
    }
  }

  renderLinkCleverAccountModal() {
    const { cleverLink, user } = this.props
    const { showFormOrModal } = this.state

    if (showFormOrModal === linkCleverAccountModal) {
      return (
        <LinkCleverAccountModal
          cleverLink={cleverLink}
          close={this.closeFormOrModal}
          user={user}
        />
      )
    }
  }

  renderLinkGoogleAccountModal() {
    const { user } = this.props
    const { showFormOrModal, } = this.state

    if (showFormOrModal === linkGoogleAccountModal) {
      return (
        <LinkGoogleAccountModal
          close={this.closeFormOrModal}
          user={user}
        />
      )
    }
  }

  renderCleverClassroomsEmptyModal() {
    const { showFormOrModal } = this.state
    if (showFormOrModal === cleverClassroomsEmptyModal) {
      return (
        <CleverClassroomsEmptyModal
          close={this.closeFormOrModal}
        />
      )
    }
  }

  renderGoogleClassroomsEmptyModal() {
    const { showFormOrModal, } = this.state
    if (showFormOrModal === googleClassroomsEmptyModal) {
      return (
        <GoogleClassroomsEmptyModal
          close={this.closeFormOrModal}
        />
      )
    }
  }

  renderImportFromCleverButton() {
    const { user } = this.props
    const { clever_id, google_id } = user
    const { attemptedImportCleverClassrooms } = this.state
    let buttonContent = 'Import from Clever'
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
    let buttonContent = ' Import from Google Classroom'
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

  renderImportGoogleClassroomsModal() {
    const { user } = this.props
    const { googleClassrooms, showFormOrModal } = this.state

    if (showFormOrModal === importGoogleClassroomsModal) {
      return (
        <ImportGoogleClassroomsModal
          classrooms={googleClassrooms}
          close={this.closeFormOrModal}
          onSuccess={this.onSuccess}
          user={user}
        />
      )
    }
  }

  renderImportCleverClassroomsModal() {
    const { user } = this.props
    const { cleverClassrooms, showFormOrModal } = this.state

    if (showFormOrModal === importCleverClassroomsModal) {
      return (
        <ImportCleverClassroomsModal
          classrooms={cleverClassrooms}
          close={() => this.closeFormOrModal(() => this.setState({attemptedImportCleverClassrooms: false}))}
          onSuccess={this.onSuccess}
          user={user}
        />
      )
    }
  }

  renderReauthorizeCleverModal() {
    const { cleverLink } = this.props
    const { showFormOrModal } = this.state

    if (showFormOrModal === reauthorizeCleverModal) {
      return (
        <ReauthorizeCleverModal
          cleverLink={cleverLink}
          close={this.closeFormOrModal}
        />
      )
    }
  }

  renderSnackbar() {
    const { showSnackbar, snackbarCopy, } = this.state
    return <Snackbar text={snackbarCopy} visible={showSnackbar} />
  }

  render() {
    return (
      <div>
        {this.renderImportCleverClassroomsModal()}
        {this.renderImportGoogleClassroomsModal()}
        {this.renderReauthorizeCleverModal()}
        {this.renderLinkCleverAccountModal()}
        {this.renderLinkGoogleAccountModal()}
        {this.renderCleverClassroomsEmptyModal()}
        {this.renderGoogleClassroomsEmptyModal()}
        {this.renderSnackbar()}
        {this.renderClassroomsSection()}
      </div>
    )
  }
}
