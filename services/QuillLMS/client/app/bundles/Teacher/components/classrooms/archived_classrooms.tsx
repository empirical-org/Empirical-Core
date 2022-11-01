import * as React from 'react'

import Classroom from './classroom'
import UnarchiveClassroomModal from './unarchive_classroom_modal'

import { Snackbar, defaultSnackbarTimeout } from '../../../Shared/index'
import { requestGet } from '../../../../modules/request/index';

interface ArchivedClassroomsProps {
  classrooms: Array<any>;
  user: any;
}

interface ArchivedClassroomsState {
  showSnackbar: boolean;
  classrooms: Array<any>;
  showModal?: string;
  selectedClassroomId?: number;
  snackbarCopy?: string;
}

export const unarchiveClassroomModal = 'unarchiveClassroomModal'

export default class ArchivedClassrooms extends React.Component<ArchivedClassroomsProps, ArchivedClassroomsState> {
  constructor(props) {
    super(props)

    this.state = {
      showSnackbar: false,
      classrooms: props.classrooms.filter(classroom => !classroom.visible)
    }

    this.openModal = this.openModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.showSnackbar = this.showSnackbar.bind(this)
    this.onSuccess = this.onSuccess.bind(this)
    this.clickClassroomHeader = this.clickClassroomHeader.bind(this)
    this.getClassrooms = this.getClassrooms.bind(this)
  }

  getClassrooms() {
    requestGet('/teachers/classrooms', (body) => this.setState({ classrooms: body.classrooms.filter(classroom => !classroom.visible) }));
  }

  onSuccess(snackbarCopy) {
    this.getClassrooms()
    this.showSnackbar(snackbarCopy)
    this.closeModal()
  }

  clickClassroomHeader(classroomId) {
    const { selectedClassroomId } = this.state

    if (selectedClassroomId === classroomId) {
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

  showSnackbar(snackbarCopy) {
    this.setState({ showSnackbar: true, snackbarCopy }, () => {
      setTimeout(() => this.setState({ showSnackbar: false, }), defaultSnackbarTimeout)
    })
  }

  renderSnackbar() {
    const { showSnackbar, snackbarCopy, } = this.state
    return <Snackbar text={snackbarCopy} visible={showSnackbar} />
  }

  renderUnarchiveClassroomModal() {
    const { showModal, classrooms, selectedClassroomId } = this.state
    if (showModal === unarchiveClassroomModal) {
      const selectedClassroom = classrooms.find(c => c.id === selectedClassroomId)
      return (
        <UnarchiveClassroomModal
          classroom={selectedClassroom}
          close={this.closeModal}
          onSuccess={this.onSuccess}
        />
      )
    }
  }

  renderPageContent() {
    const { user } = this.props
    const { classrooms, selectedClassroomId } = this.state
    const ownArchivedClassrooms = classrooms.filter(c => {
      const classroomOwner = c.teachers.find(teacher => teacher.classroom_relation === 'owner')
      return !c.visible && classroomOwner.id === user.id
    })
    if (classrooms.length === 0) {
      return null
    } else {
      const classroomCards = classrooms.map(classroom => {
        const isOwnedByCurrentUser = !!ownArchivedClassrooms.find(c => c.id === classroom.id)
        return (
          <Classroom
            classroom={classroom}
            classrooms={ownArchivedClassrooms}
            clickClassroomHeader={this.clickClassroomHeader}
            isOwnedByCurrentUser={isOwnedByCurrentUser}
            key={classroom.id}
            onSuccess={this.onSuccess}
            selected={classroom.id === selectedClassroomId}
            unarchiveClass={() => this.openModal(unarchiveClassroomModal)}
            user={user}
          />
        )
      })
      return (
        <div className="archived-classes">
          {classroomCards}
        </div>
      )
    }
  }

  renderHeader() {
    const { classrooms } = this.state
    if (classrooms.length) {
      return (
        <div className="header">
          <h1>Archived Classes</h1>
        </div>
      )
    } else {
      return (
        <div className="header">
          <h1>No archived classes</h1>
          <p>When you archive a class, you will see it listed here.</p>
        </div>
      )
    }
  }

  render() {
    return (
      <div className="archived-classrooms classrooms-page">
        {this.renderUnarchiveClassroomModal()}
        {this.renderSnackbar()}
        {this.renderHeader()}
        {this.renderPageContent()}
      </div>
    )
  }
}
