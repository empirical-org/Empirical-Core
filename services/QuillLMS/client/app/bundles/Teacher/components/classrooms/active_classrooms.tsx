import * as React from 'react'

import CreateAClassModal from './create_a_class_modal'

const emptyClassSrc = `${process.env.CDN_URL}/images/Illustrations/empty-class.svg`

interface ActiveClassroomsProps {
  classrooms: Array<any>
}

interface ActiveClassroomsState {
  showCreateAClassModal: boolean;
}

export default class ActiveClassrooms extends React.Component<ActiveClassroomsProps, ActiveClassroomsState> {
  constructor(props) {
    super(props)

    this.state = {
      showCreateAClassModal: false
    }

    this.openCreateAClassModal = this.openCreateAClassModal.bind(this)
    this.closeCreateAClassModal = this.closeCreateAClassModal.bind(this)
  }

  openCreateAClassModal() {
    this.setState({ showCreateAClassModal: true })
  }

  closeCreateAClassModal() {
    this.setState({ showCreateAClassModal: false })
  }

  renderPageContent() {
    if (this.props.classrooms.length === 0) {
      return <div className="no-active-classes">
        <img src={emptyClassSrc} />
        <p>Every teacher needs a class! Please select one of the buttons on the right to get started.</p>
      </div>
    }
  }

  renderCreateAClassModal() {
    if (this.state.showCreateAClassModal) {
      return <CreateAClassModal
        close={this.closeCreateAClassModal}
      />
    }
  }

  render() {
    return <div className="active-classrooms classrooms-page">
      {this.renderCreateAClassModal()}
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
