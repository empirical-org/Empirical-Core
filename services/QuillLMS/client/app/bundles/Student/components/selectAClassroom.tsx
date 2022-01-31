import * as React from 'react'

const addCircleSrc = `${process.env.CDN_URL}/images/icons/add-circle.svg`

export default class SelectAClassroom extends React.Component<any, { showJoinClassModal: boolean}> {
  constructor(props) {
    super(props)

    this.state = { showJoinClassModal: false }
  }

  componentDidMount() {
    document.title = 'Quill.org | Classes'
  }

  handleJoinClassClick = () => {
    const { isBeingPreviewed, } = this.props

    if (isBeingPreviewed) {
      this.setState({ showJoinClassModal: true })
    } else {
      window.location.href = '/add_classroom'
    }
  }

  handleCloseJoinClassModalClick = () => this.setState({ showJoinClassModal: false, })

  renderClassroomCards = () => {
    const { classrooms, onClickCard, } = this.props
    const joinAClassCard = (<button className="classroom-card join-a-class-card" onClick={this.handleJoinClassClick} type="button">
      <img alt="A plus sign inside a circle" src={addCircleSrc} />
      <h3>Join a class</h3>
    </button>)

    const classroomCards = classrooms.map(classroom => {

      const handleClick = () => { onClickCard(classroom.id) }
      return (
        <button className="classroom-card" key={classroom.id} onClick={handleClick} type="button">
          <div className="top-section">
            <p>Class</p>
            <h2>{classroom.name}</h2>
          </div>
          <div className="bottom-section">
            <p>Teacher</p>
            <h3>{classroom.teacher}</h3>
          </div>
        </button>
      )
    })

    return (
      <div className="classroom-cards">
        {joinAClassCard}
        {classroomCards}
      </div>
    )
  }

  renderJoinClassModal = () => {
    const { showJoinClassModal, } = this.state

    if (!showJoinClassModal) { return }

    return (
      <div className="modal-container student-profile-modal-container">
        <div className="modal-background" />
        <div className="student-profile-modal quill-modal modal-body">
          <div>
            <h3 className="title">Sorry, only a student can join a class.</h3>
          </div>
          <div className="student-profile-modal-text">
            <p>If you would like to add this student to another class, you can go back to your dashboard and invite them from the Classes page.</p>
          </div>
          <div className="form-buttons">
            <a className="quill-button outlined secondary medium focus-on-light" href="/teachers/unset_preview_as_student?redirect=/teachers/classrooms">Classes page</a>
            <button className="quill-button contained primary medium focus-on-light" onClick={this.handleCloseJoinClassModalClick} type="button">Continue viewing</button>
          </div>
        </div>
      </div>
    )
  }

  render() {
    return (
      <div className="container select-a-classroom-container">
        {this.renderJoinClassModal()}
        <div className="select-a-classroom">
          <h1>Classes</h1>
          {this.renderClassroomCards()}
        </div>
      </div>
    )
  }
}
