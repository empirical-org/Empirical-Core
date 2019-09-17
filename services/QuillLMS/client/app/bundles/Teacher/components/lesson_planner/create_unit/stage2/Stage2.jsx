import React from 'react';

import Classroom from './classroom';
import ActivityDueDate from './activity_due_date';
import ButtonLoadingIndicator from '../../../shared/button_loading_indicator';
import NameTheUnit from './name_the_unit.jsx';
import { Snackbar, defaultSnackbarTimeout } from 'quill-component-library/dist/componentLibrary'

import CreateAClassModal from '../../../classrooms/create_a_class_modal.tsx'
import ImportGoogleClassroomsModal from '../../../classrooms/import_google_classrooms_modal.tsx'
import GoogleClassroomEmailModal from '../../../classrooms/google_classroom_email_modal.tsx'
import GoogleClassroomsEmptyModal from '../../../classrooms/google_classrooms_empty_modal.tsx'
import { requestGet } from '../../../../../../modules/request';

export const createAClassModal = 'createAClassModal'
export const importGoogleClassroomsModal = 'importGoogleClassroomsModal'
export const googleClassroomEmailModal = 'googleClassroomEmailModal'
export const googleClassroomsEmptyModal = 'googleClassroomsEmptyModal'

export default class Stage2 extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      classroomsAndTheirStudents: [],
      buttonDisabled: false,
      prematureAssignAttempted: false,
      loading: false,
      showModal: false
    }

    this.getGoogleClassrooms = this.getGoogleClassrooms.bind(this)
    this.onSuccess = this.onSuccess.bind(this)
    this.clickImportGoogleClassrooms = this.clickImportGoogleClassrooms.bind(this)
    this.openModal = this.openModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.showSnackbar = this.showSnackbar.bind(this)
    this.finish = this.finish.bind(this)
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

  finish() {
    if (!this.state.buttonDisabled && !this.props.errorMessage) {
      // this.setState({buttonDisabled: true});
      this.setState({ loading: true, });
      this.props.finish();
    } else {
      this.setState({ prematureAssignAttempted: true, });
    }
  }

  determineAssignButtonClass() {
    if ((!this.state.buttonDisabled) && this.props.areAnyStudentsSelected) {
      return 'button-green';
    }
    return 'button-gray';
  }

  determineErrorMessageClass() {
    // && !this.props.unitName || this.props.errorMessage
    if (this.state.prematureAssignAttempted) {
      return 'error-message visible-error-message';
    }
    return 'error-message hidden-error-message';
  }

  dueDate(activityId) {
    if (this.props.dueDates && this.props.dueDates[activityId]) {
      return this.props.dueDates[activityId];
    }
  }

  classroomList() {
    if (this.props.classrooms) {
      const that = this;
      return this.props.classrooms.map(el => <Classroom
        key={el.classroom.id}
        classroom={el.classroom}
        students={el.students}
        allSelected={el.allSelected || el.emptyClassroomSelected}
        toggleClassroomSelection={that.props.toggleClassroomSelection}
        toggleStudentSelection={that.props.toggleStudentSelection}
      />);
    }
    return [];
  }

  dueDateList() {
    const that = this;
    return this.props.selectedActivities.map(activity => (<ActivityDueDate
      activity={activity}
      key={activity.id}
      dueDate={that.dueDate()}
      toggleActivitySelection={that.props.toggleActivitySelection}
      assignActivityDueDate={that.props.assignActivityDueDate}
    />));
  }

  nameComponent() {
    const nameError = this.state.prematureContinueAttempted && this.props.errorMessage && this.props.errorMessage.includes('name') ? 'name-error' : '';
    return <NameTheUnit unitName={this.props.unitName} updateUnitName={this.props.updateUnitName} nameError={nameError} />;
  }

  assignButton() {
    return this.state.loading
      ? <button ref="button" id="assign" className={`${this.determineAssignButtonClass()} pull-right`}>Assigning... <ButtonLoadingIndicator /></button>
      : <button ref="button" id="assign" className={`${this.determineAssignButtonClass()} pull-right`} onClick={this.finish}>Assign</button>;
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

  studentSectionHeaderCopy() {
    if (this.props.classrooms.length) {
      return 'Select Students To Assign Activity Pack To:'
    } else {
      return 'Create A Class To Assign Your Activity Pack'
    }
  }

  render() {
    return (
      <div className="name-and-assign-activity-pack">
        {this.renderCreateAClassModal()}
        {this.renderImportGoogleClassroomsModal()}
        {this.renderGoogleClassroomEmailModal()}
        {this.renderGoogleClassroomsEmptyModal()}
        {this.renderSnackbar()}
        <h1>Assign</h1>
        {this.nameComponent()}
        <section className="select-students">
          <div className="select-students-header">
            <h2 className="section-header">{this.studentSectionHeaderCopy()}</h2>
            <div className="import-or-create-classroom-buttons">
              {this.renderImportGoogleClassroomsButton()}
              <button onClick={() => this.openModal(createAClassModal)} className="quill-button medium primary contained create-a-class-button">Create a class</button>
            </div>
          </div>
          {this.renderAutomaticAssignNote()}
          {this.classroomList()}
        </section>
        <section className="assign-dates">
          <h2 className="section-header">
            Optional - <span>Assign Due Dates To Your Activities:</span>
          </h2>
          <table className="table activity-table">
            <tbody>
              {this.dueDateList()}
            </tbody>
          </table>
          <div className="error-message-and-button">
            <div className={this.determineErrorMessageClass()}>{this.props.errorMessage}</div>
            {this.assignButton()}
          </div>
        </section>
      </div>
    );
  }
}
