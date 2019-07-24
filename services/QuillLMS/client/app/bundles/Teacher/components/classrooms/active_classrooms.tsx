import * as React from 'react'
import { Snackbar, defaultSnackbarTimeout } from 'quill-component-library/dist/componentLibrary'

import CreateAClassModal from './create_a_class_modal'
import RenameClassModal from './rename_classroom_modal'
import ChangeGradeModal from './change_grade_modal'
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
      showSnackbar: false,
      classrooms: props.classrooms.filter(classroom => classroom.visible)
    }

    this.openCreateAClassModal = this.openCreateAClassModal.bind(this)
    this.closeCreateAClassModal = this.closeCreateAClassModal.bind(this)
    this.openRenameClassModal = this.openRenameClassModal.bind(this)
    this.closeRenameClassModal = this.closeRenameClassModal.bind(this)
    this.openChangeGradeModal = this.openChangeGradeModal.bind(this)
    this.closeChangeGradeModal = this.closeChangeGradeModal.bind(this)
    this.showSnackbar = this.showSnackbar.bind(this)
    this.clickClassroomHeader = this.clickClassroomHeader.bind(this)
    this.getClassrooms = this.getClassrooms.bind(this)
  }

  getClassrooms() {
    requestGet('/teachers/classrooms/new_index', (body) => this.setState({ classrooms: body.classrooms.filter(classroom => classroom.visible) }));
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
    this.getClassrooms()
    this.setState({ showCreateAClassModal: false })
  }

  openRenameClassModal() {
    this.setState({ showRenameClassModal: true })
  }

  closeRenameClassModal() {
    this.getClassrooms()
    this.setState({ showRenameClassModal: false })
  }

  openChangeGradeModal() {
    this.setState({ showChangeGradeModal: true })
  }

  closeChangeGradeModal() {
    this.getClassrooms()
    this.setState({ showChangeGradeModal: false })
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
    if (classrooms.length === 0) {
      return <div className="no-active-classes">
        <img src={emptyClassSrc} />
        <p>Every teacher needs a class! Please select one of the buttons on the right to get started.</p>
      </div>
    } else {
      const classroomCards = classrooms.map(classroom => {
        return <Classroom
          renameClass={this.openRenameClassModal}
          changeGrade={this.openChangeGradeModal}
          classroom={classroom}
          selected={classroom.id === this.state.selectedClassroomId}
          clickClassroomHeader={this.clickClassroomHeader}
          user={user}
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

  renderRenameClassModal() {
    const { showRenameClassModal, classrooms, selectedClassroomId } = this.state
    if (showRenameClassModal) {
      const selectedClassroom = classrooms.find(c => c.id === selectedClassroomId)
      return <RenameClassModal
        close={this.closeRenameClassModal}
        showSnackbar={this.showSnackbar}
        classroom={selectedClassroom}
      />
    }
  }

  renderChangeGradeModal() {
    const { showChangeGradeModal, classrooms, selectedClassroomId } = this.state
    if (showChangeGradeModal) {
      const selectedClassroom = classrooms.find(c => c.id === selectedClassroomId)
      return <ChangeGradeModal
        close={this.closeRenameClassModal}
        showSnackbar={this.showSnackbar}
        classroom={selectedClassroom}
      />
    }
  }

  render() {
    return <div className="active-classrooms classrooms-page">
      {this.renderCreateAClassModal()}
      {this.renderRenameClassModal()}
      {this.renderChangeGradeModal()}
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
