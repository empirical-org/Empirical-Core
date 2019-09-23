import React from 'react'
import { Snackbar, defaultSnackbarTimeout } from 'quill-component-library/dist/componentLibrary'

import CreateAClassInlineForm from './create_a_class_inline_form.tsx'
import ButtonLoadingIndicator from '../../../shared/button_loading_indicator';
import ImportGoogleClassroomsModal from '../../../classrooms/import_google_classrooms_modal.tsx'
import GoogleClassroomEmailModal from '../../../classrooms/google_classroom_email_modal.tsx'
import GoogleClassroomsEmptyModal from '../../../classrooms/google_classrooms_empty_modal.tsx'
import Classroom from './classroom'
import { requestGet } from '../../../../../../modules/request';

const emptyClassSrc = `${process.env.CDN_URL}/images/illustrations/empty-class.svg`

export const createAClassForm = 'createAClassForm'
export const importGoogleClassroomsModal = 'importGoogleClassroomsModal'
export const googleClassroomEmailModal = 'googleClassroomEmailModal'
export const googleClassroomsEmptyModal = 'googleClassroomsEmptyModal'

export default class AssignStudents extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      showFormOrModal: false
    }

    this.getGoogleClassrooms = this.getGoogleClassrooms.bind(this)
    this.onSuccess = this.onSuccess.bind(this)
    this.clickImportGoogleClassrooms = this.clickImportGoogleClassrooms.bind(this)
    this.openFormOrModal = this.openFormOrModal.bind(this)
    this.closeFormOrModal = this.closeFormOrModal.bind(this)
    this.showSnackbar = this.showSnackbar.bind(this)
  }

  componentDidMount() {
    this.getGoogleClassrooms()
  }

  openFormOrModal(modalName) {
    this.setState({ showFormOrModal: modalName })
  }

  closeFormOrModal(callback=null) {
    this.setState({ showFormOrModal: null}, () => {
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
    this.closeFormOrModal()
  }

  renderClassroom(c) {
    const {
      toggleClassroomSelection,
      toggleStudentSelection
    } = this.props
    return <div className="classroom"></div>
  }

  classroomList() {
    const {
      classrooms,
      toggleClassroomSelection,
      toggleStudentSelection
    } = this.props
    if (classrooms && classrooms.length) {
      const classroomElements = classrooms.map(c => this.renderClassroom(c))
      return <div className="classrooms">
        {classroomElements}
      </div>
      // return this.props.classrooms.map(el => <Classroom
      //   key={el.classroom.id}
      //   classroom={el.classroom}
      //   students={el.students}
      //   allSelected={el.allSelected || el.emptyClassroomSelected}
      //   toggleClassroomSelection={this.props.toggleClassroomSelection}
      //   toggleStudentSelection={this.props.toggleStudentSelection}
      // />);
    } else if (this.state.showFormOrModal !== createAClassForm) {
      return <div className="no-active-classes">
        <img src={emptyClassSrc} alt="empty class" />
        <p>Your classrooms will appear here. Add a class to get started.</p>
      </div>
    }
  }

  clickImportGoogleClassrooms() {
    const { googleClassrooms, googleClassroomsLoading, } = this.state
    if (!this.props.user.google_id) {
      this.openFormOrModal(googleClassroomEmailModal)
    } else if (googleClassroomsLoading) {
      this.setState({ attemptedImportGoogleClassrooms: true, })
    } else if (googleClassrooms.length) {
      this.openFormOrModal(importGoogleClassroomsModal)
    } else {
      this.openFormOrModal(googleClassroomsEmptyModal)
    }
  }

  showSnackbar(snackbarCopy) {
    this.setState({ showSnackbar: true, snackbarCopy }, () => {
      setTimeout(() => this.setState({ showSnackbar: false, }), defaultSnackbarTimeout)
    })
  }

  renderCreateAClassInlineForm() {
    if (this.state.showFormOrModal === createAClassForm) {
      return (<CreateAClassInlineForm
        cancel={this.closeFormOrModal}
        onSuccess={this.onSuccess}
      />)
    }
  }

  renderImportGoogleClassroomsModal() {
    const { googleClassrooms, showFormOrModal, } = this.state
    if (showFormOrModal === importGoogleClassroomsModal) {
      return (<ImportGoogleClassroomsModal
        close={this.closeFormOrModal}
        onSuccess={this.onSuccess}
        classrooms={googleClassrooms}
        user={this.props.user}
      />)
    }
  }

  renderGoogleClassroomEmailModal() {
    const { showFormOrModal, } = this.state
    if (showFormOrModal === googleClassroomEmailModal) {
      return (<GoogleClassroomEmailModal
        close={this.closeFormOrModal}
        user={this.props.user}
      />)
    }
  }

  renderGoogleClassroomsEmptyModal() {
    const { showFormOrModal, } = this.state
    if (showFormOrModal === googleClassroomsEmptyModal) {
      return (<GoogleClassroomsEmptyModal
        close={this.closeFormOrModal}
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

  renderClassroomsSection() {
    return (<div className="assignment-section">
      <div className="assignment-section-header assign-students">
        <div className="number-and-name">
          <span className="assignment-section-number">3</span>
          <span className="assignment-section-name">Choose classes or students</span>
        </div>
        <div className="import-or-create-classroom-buttons">
          {this.renderImportGoogleClassroomsButton()}
          <button onClick={() => this.openFormOrModal(createAClassForm)} className="quill-button medium secondary outlined create-a-class-button">Create a class</button>
        </div>
      </div>
      <div className="assignment-section-body">
        {this.renderCreateAClassInlineForm()}
        {this.classroomList()}
      </div>
    </div>)
  }

  render() {
    return (<div>
      {this.renderImportGoogleClassroomsModal()}
      {this.renderGoogleClassroomEmailModal()}
      {this.renderGoogleClassroomsEmptyModal()}
      {this.renderSnackbar()}
      {this.renderClassroomsSection()}
    </div>)
  }

}
