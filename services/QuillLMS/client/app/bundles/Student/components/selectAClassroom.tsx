import * as React from 'react'

const addCircleSrc = `${process.env.CDN_URL}/images/icons/add-circle.svg`

const MAX_CLASSROOM_NAME_LENGTH = 45
const MAX_TEACHER_NAME_LENGTH = 33

export default class SelectAClassroom extends React.Component<any, any> {
  handleJoinClassClick = () => window.location.href = '/add_classroom'

  renderClassroomCards = () => {
    const { classrooms, onClickCard, } = this.props
    const joinAClassCard = (<button className="classroom-card join-a-class-card" onClick={this.handleJoinClassClick} type="button">
      <img alt="A plus sign inside a circle" src={addCircleSrc} />
      <h3>Join a class</h3>
    </button>)

    const classroomCards = classrooms.map(classroom => {
      const displayedClassName = classroom.name.length > MAX_CLASSROOM_NAME_LENGTH ? `${classroom.name.substring(0, MAX_CLASSROOM_NAME_LENGTH)}...` : classroom.name
      const displayedTeacherName = classroom.teacher.length > MAX_TEACHER_NAME_LENGTH ? `${classroom.teacher.substring(0, MAX_TEACHER_NAME_LENGTH)}...` : classroom.teacher
      const handleClick = () => { onClickCard(classroom.id) }
      return (<button className="classroom-card" key={classroom.id} onClick={handleClick} type="button">
        <div className="top-section">
          <p>Class</p>
          <h2>{displayedClassName}</h2>
        </div>
        <div className="bottom-section">
          <p>Teacher</p>
          <h3>{displayedTeacherName}</h3>
        </div>
      </button>)
    })

    return (<div className="classroom-cards">
      {joinAClassCard}
      {classroomCards}
      {classroomCards}
    </div>)
  }

  render() {
    return (<div className="container select-a-classroom-container">
      <div className="select-a-classroom">
        <h1>Classes</h1>
        {this.renderClassroomCards()}
      </div>
    </div>)
  }
}
