import * as React from 'react';

import Classroom from './classroom';
import UnarchiveClassroomModal from './unarchive_classroom_modal';

import { requestGet } from '../../../../modules/request/index';
import { Snackbar, defaultSnackbarTimeout } from '../../../Shared/index';
import { MY_CLASSES_FEATURED_BLOG_POST_ID } from '../../constants/featuredBlogPost';
import ArticleSpotlight from '../shared/articleSpotlight';

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
      return(
        <div className="no-archived-classes">
          <h2>No archived classes</h2>
          <p>When you archive a class, you will see it listed here.</p>
        </div>
      )
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

  render() {
    return (
      <React.Fragment>
        <div className="container gray-background-accommodate-footer archived-classrooms classrooms-page">
          {this.renderUnarchiveClassroomModal()}
          {this.renderSnackbar()}
          <div className="header">
            <h1>Archived Classes</h1>
          </div>
          {this.renderPageContent()}
        </div>
        <ArticleSpotlight blogPostId={MY_CLASSES_FEATURED_BLOG_POST_ID} />
      </React.Fragment>
    )
  }
}
