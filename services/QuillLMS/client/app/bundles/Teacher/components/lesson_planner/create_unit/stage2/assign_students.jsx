import React from 'react'
import { Snackbar, defaultSnackbarTimeout, DropdownInput } from 'quill-component-library/dist/componentLibrary'

import CreateAClassInlineForm from './create_a_class_inline_form.tsx'
import ButtonLoadingIndicator from '../../../shared/button_loading_indicator';
import ImportGoogleClassroomsModal from '../../../classrooms/import_google_classrooms_modal.tsx'
import GoogleClassroomEmailModal from '../../../classrooms/google_classroom_email_modal.tsx'
import GoogleClassroomsEmptyModal from '../../../classrooms/google_classrooms_empty_modal.tsx'
import { requestGet } from '../../../../../../modules/request';

const emptyClassSrc = `${process.env.CDN_URL}/images/illustrations/empty-class.svg`
const smallWhiteCheckSrc = `${process.env.CDN_URL}/images/shared/check-small-white.svg`
const indeterminateSrc = `${process.env.CDN_URL}/images/icons/indeterminate.svg`

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

  selectStudents(studentOptions, classroomId) {
    const studentIds = studentOptions.map(s => s.value)
    this.props.toggleStudentSelection(studentIds, classroomId)
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
        {this.renderAllClassroomsCheckbox()}
        {this.renderClassroomList()}
      </div>
    </div>)
  }

  renderAllClassroomsCheckbox() {
    const { classrooms, toggleClassroomSelection} = this.props
    if (classrooms.length <= 1) { return null }

    const selectedClassrooms = classrooms.filter((c) => {
      const { students, classroom, } = c
      const selectedStudents = students && students.length ? students.filter(s => s.isSelected) : []
      return !!(classroom.emptyClassroomSelected || selectedStudents.length)
    })

    let checkbox = <span className="quill-checkbox unselected" onClick={() => toggleClassroomSelection(null, true)}/>
    if (selectedClassrooms.length === classrooms.length) {
      checkbox = (<span className="quill-checkbox selected" onClick={() => toggleClassroomSelection(null, false)}>
        <img src={smallWhiteCheckSrc} alt="check" />
      </span>)
    } else if (selectedClassrooms.length) {
      checkbox = (<span className="quill-checkbox selected" onClick={() => toggleClassroomSelection(null, false)}>
        <img src={indeterminateSrc} alt="check"/>
      </span>)
    }
    return <div className="all-classes-checkbox">
      {checkbox}
      <span className="all-classes-text">All classes and students</span>
    </div>
  }

  renderClassroom(c) {
    const { classroom, students, } = c
    const { name, } = classroom
    return (<div className="classroom">
      <div className="checkbox-and-name-container">
        {this.renderClassroomCheckbox(classroom, students)}
        <div className="name-container">
          <span className="name-label">Class</span>
          <span className="name">{name}</span>
        </div>
      </div>
      <div className="students-container">
        {this.renderStudentSection(classroom, students)}
      </div>
    </div>)
  }

  renderClassroomCheckbox(classroom, students) {
    const { toggleClassroomSelection, } = this.props
    const { emptyClassroomSelected, } = classroom

    let checkbox = <span className="quill-checkbox unselected" onClick={() => toggleClassroomSelection(classroom)} />
    const selectedStudents = students && students.length ? students.filter(s => s.isSelected) : []

    if (emptyClassroomSelected || selectedStudents.length) {
      checkbox = (<span className="quill-checkbox selected" onClick={() => toggleClassroomSelection(classroom)} >
        <img src={smallWhiteCheckSrc} alt="check" />
      </span>)
    }

    return checkbox
  }

  renderStudentSection(classroom, students) {
    const { id, emptyClassroomSelected, } = classroom

    const options = students ? students.map((s) => {
      return { value: s.id, label: s.name, isSelected: s.isSelected, }
    }) : []

    const selectedStudents = options.filter(s => s.isSelected)

    if (!selectedStudents.length && !emptyClassroomSelected) { return null }

    if (selectedStudents.length) {
      return (<DropdownInput
        value={selectedStudents}
        isMulti
        options={options}
        optionType="student"
        handleChange={(e) => { this.selectStudents(e, id) }}
      />)
    }
    return <span className="empty-class-students">And all students who join in the future</span>
  }

  renderClassroomList() {
    const { classrooms, } = this.props
    if (classrooms && classrooms.length) {
      const classroomElements = classrooms.map(c => this.renderClassroom(c))
      return (<div className="classrooms">
        {classroomElements}
      </div>)
    } else if (this.state.showFormOrModal !== createAClassForm) {
      return (<div className="no-active-classes">
        <img src={emptyClassSrc} alt="empty class" />
        <p>Your classrooms will appear here. Add a class to get started.</p>
      </div>)
    }
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
