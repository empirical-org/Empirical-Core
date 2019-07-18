import * as React from 'react'
import { Snackbar, defaultSnackbarTimeout } from 'quill-component-library/dist/componentLibrary'

import CreateAClassModal from './create_a_class_modal'
import Classroom from './classroom'

const emptyClassSrc = `${process.env.CDN_URL}/images/illustrations/empty-class.svg`

interface ActiveClassroomsProps {
  classrooms: Array<any>
}

interface ActiveClassroomsState {
  showCreateAClassModal: boolean;
  showSnackbar: boolean;
  selectedClassroomId?: number;
  snackbarCopy?: string;
}

export default class ActiveClassrooms extends React.Component<ActiveClassroomsProps, ActiveClassroomsState> {
  constructor(props) {
    super(props)

    this.state = {
      showCreateAClassModal: false,
      showSnackbar: false
    }

    this.openCreateAClassModal = this.openCreateAClassModal.bind(this)
    this.closeCreateAClassModal = this.closeCreateAClassModal.bind(this)
    this.showSnackbar = this.showSnackbar.bind(this)
    this.clickClassroomHeader = this.clickClassroomHeader.bind(this)
  }

  clickClassroomHeader(classroomId) {
    if (this.state.selectedClassroomId === classroomId) {
      this.setState({ selectedClassroomId: null})
    } else {
      this.setState({ selectedClassroomId: classroomId })
    }
  }

  activeClassrooms = () => this.props.classrooms.filter(classroom => classroom.visible)

  openCreateAClassModal() {
    this.setState({ showCreateAClassModal: true })
  }

  closeCreateAClassModal() {
    this.setState({ showCreateAClassModal: false })
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
    const activeClassrooms = this.activeClassrooms()
    if (activeClassrooms.length === 0) {
      return <div className="no-active-classes">
        <img src={emptyClassSrc} />
        <p>Every teacher needs a class! Please select one of the buttons on the right to get started.</p>
      </div>
    } else {
      const classrooms = activeClassrooms.map(classroom => {
        return <Classroom
          classroom={classroom}
          selected={classroom.id === this.state.selectedClassroomId}
          clickClassroomHeader={this.clickClassroomHeader}
        />
      })
      return <div className="active-classes">
        {classrooms}
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

  render() {
    return <div className="active-classrooms classrooms-page">
      {this.renderCreateAClassModal()}
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
