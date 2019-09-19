import React from 'react'
import { Snackbar, defaultSnackbarTimeout } from 'quill-component-library/dist/componentLibrary'

import CreateAClassModal from '../../../classrooms/create_a_class_modal.tsx'
import ImportGoogleClassroomsModal from '../../../classrooms/import_google_classrooms_modal.tsx'
import GoogleClassroomEmailModal from '../../../classrooms/google_classroom_email_modal.tsx'
import GoogleClassroomsEmptyModal from '../../../classrooms/google_classrooms_empty_modal.tsx'
import Classroom from './classroom'
import { requestGet } from '../../../../../../modules/request';

const emptyClassSrc = `${process.env.CDN_URL}/images/illustrations/empty-class.svg`

export const createAClassModal = 'createAClassModal'
export const importGoogleClassroomsModal = 'importGoogleClassroomsModal'
export const googleClassroomEmailModal = 'googleClassroomEmailModal'
export const googleClassroomsEmptyModal = 'googleClassroomsEmptyModal'

export default class AssignStudents extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      showModal: false
    }

    this.getGoogleClassrooms = this.getGoogleClassrooms.bind(this)
    this.onSuccess = this.onSuccess.bind(this)
    this.clickImportGoogleClassrooms = this.clickImportGoogleClassrooms.bind(this)
    this.openModal = this.openModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.showSnackbar = this.showSnackbar.bind(this)
  }

  componentDidMount() {
    this.getGoogleClassrooms()
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

  getGoogleClassrooms() {
    if (this.props.user && this.props.user.google_id) {
      this.setState({ googleClassroomsLoading: true}, () => {
        requestGet('/teachers/classrooms/retrieve_google_classrooms', (body) => {
          const googleClassrooms = body.classrooms.filter(classroom => !classroom.alreadyImported)
          const newStateObj = { googleClassrooms, googleClassroomsLoading: false, }
          if (this.state.attemptedImportGoogleClassrooms) {
            newStateObj.attemptedImportGoogleClassrooms = false
            this.setState(newStateObj, this.clickImportGoogleClassrooms)
          } else {
            this.setState(newStateObj)
          }
        });
      })
    }
  }

  onSuccess(snackbarCopy) {
    this.props.fetchClassrooms()
    this.getGoogleClassrooms()
    this.showSnackbar(snackbarCopy)
    this.closeModal()
  }

  classroomList() {
    if (this.props.classrooms && this.props.classrooms.length) {
      const that = this;
      return this.props.classrooms.map(el => <Classroom
        key={el.classroom.id}
        classroom={el.classroom}
        students={el.students}
        allSelected={el.allSelected || el.emptyClassroomSelected}
        toggleClassroomSelection={that.props.toggleClassroomSelection}
        toggleStudentSelection={that.props.toggleStudentSelection}
      />);
    } else {
      return <div className="no-active-classes">
        <img src={emptyClassSrc} />
        <p>Your classrooms will appear here. Add a class to get started.</p>
      </div>
    }
  }

  clickImportGoogleClassrooms() {
    const { googleClassrooms, googleClassroomsLoading, } = this.state
    if (!this.props.user.google_id) {
      this.openModal(googleClassroomEmailModal)
    } else if (googleClassroomsLoading) {
      this.setState({ attemptedImportGoogleClassrooms: true, })
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

  renderCreateAClassModal() {
    if (this.state.showModal === createAClassModal) {
      return (<CreateAClassModal
        close={() => this.closeModal(this.props.fetchClassrooms)}
        showSnackbar={this.showSnackbar}
      />)
    }
  }

  renderImportGoogleClassroomsModal() {
    const { googleClassrooms, showModal, } = this.state
    if (showModal === importGoogleClassroomsModal) {
      return (<ImportGoogleClassroomsModal
        close={this.closeModal}
        onSuccess={this.onSuccess}
        classrooms={googleClassrooms}
        user={this.props.user}
      />)
    }
  }

  renderGoogleClassroomEmailModal() {
    const { showModal, } = this.state
    if (showModal === googleClassroomEmailModal) {
      return (<GoogleClassroomEmailModal
        close={this.closeModal}
        user={this.props.user}
      />)
    }
  }

  renderGoogleClassroomsEmptyModal() {
    const { showModal, } = this.state
    if (showModal === googleClassroomsEmptyModal) {
      return (<GoogleClassroomsEmptyModal
        close={this.closeModal}
      />)
    }
  }

  renderImportGoogleClassroomsButton() {
    const { googleClassroomsLoading, attemptedImportGoogleClassrooms, } = this.state
    let buttonContent = 'Import from Google Classroom'
    let buttonClassName = 'quill-button medium secondary outlined import-from-google-button'
    if (googleClassroomsLoading && attemptedImportGoogleClassrooms) {
      buttonContent = <ButtonLoadingIndicator />
      buttonClassName += ' loading'
    }
    return (<button
      onClick={this.clickImportGoogleClassrooms}
      className={buttonClassName}
    >
      {buttonContent}
    </button>)
  }

  renderSnackbar() {
    const { showSnackbar, snackbarCopy, } = this.state
    return <Snackbar text={snackbarCopy} visible={showSnackbar} />
  }

  renderAutomaticAssignNote() {
    if (!this.props.classrooms.length) { return null }

    return <div className="automatic-assign-note">
      <i className="fa fa-icon fa-lightbulb-o"/>
      <p><span className="bold">Note:</span> If you choose to assign the activity pack to the <span className="italic">entire class</span>, new students to the classroom will get assigned the activity pack automatically. But, if you only assign the activity pack to <span className="italic">certain students</span>, then the activity pack <span className="bold">will not be assigned</span> to the new students automatically.</p>
    </div>
  }

  renderClassroomsSection() {
    return (<div className="assignment-section">
      <div className="assignment-section-header assign-students">
        <div className="number-and-name">
          <span className="assignment-section-number">3</span>
          <span className="assignment-section-name">Choose classes or students</span>
        </div>
        <div className="import-or-create-classroom-buttons">
          {this.renderImportGoogleClassroomsButton()}
          <button onClick={() => this.openModal(createAClassModal)} className="quill-button medium secondary outlined create-a-class-button">Create a class</button>
        </div>
      </div>
      <div className="assignment-section-body">
        {this.renderAutomaticAssignNote()}
        {this.classroomList()}
      </div>
    </div>)
  }

  render() {
    return <div>
      {this.renderCreateAClassModal()}
      {this.renderImportGoogleClassroomsModal()}
      {this.renderGoogleClassroomEmailModal()}
      {this.renderGoogleClassroomsEmptyModal()}
      {this.renderSnackbar()}
      {this.renderClassroomsSection()}
    </div>
  }

}
