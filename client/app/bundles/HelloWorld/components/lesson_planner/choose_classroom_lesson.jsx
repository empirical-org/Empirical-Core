import React from 'react'
import request from 'request'

export default class ChooseClassroomLesson extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      loading: true,
      activityName: '',
      classroomActivities: []
    }

    this.getClassroomLessonInfo()

    this.launchLesson = this.launchLesson.bind(this)
  }

  getClassroomLessonInfo() {
    request.get(`${process.env.DEFAULT_URL}/teachers/units/${this.props.params.unitId}/activity/${this.props.params.activityId}`, (error, httpStatus, body) => {
      const data = JSON.parse(body)
      this.setState({
        classroomActivities: data.classroom_activities,
        activityName: data.activity_name,
        loading: false
      })
    })
  }

  renderClasses() {
    const classrooms = this.state.classroomActivities.map((ca, i) =>
      this.renderClassroomRow(ca, i)
    )
    return <div>{classrooms}</div>
  }

  renderClassroomRow(ca, i) {
    const numberOfStudents = `${ca.number_of_assigned_students} student${ca.number_of_assigned_students === 1 ? '' : 's'}`
    const selectedClassName = ca.id === this.state.selectedClassroomActivityId ? 'selected' : null
    let completionText, completionClass
    if (ca.completed) {
      completionText = <span>Lesson Completed</span>
      completionClass = 'completed'
    } else {
      completionText = <span/>
      completionClass = 'incomplete'
    }
    return <div key={i} onClick={() => {this.setSelectedClassroomActivityId(ca.id)}} className={`classroom-row ${selectedClassName}`}>
      <div><span className={completionClass}>{ca.classroom_name}</span> ({numberOfStudents})</div>
      {completionText}
    </div>
  }

  setSelectedClassroomActivityId(id) {
    this.setState({selectedClassroomActivityId: id})
  }

  launchLesson() {
    const classroomActivityId = this.state.selectedClassroomActivityId
    const lessonId = this.props.routeParams.activityId
    request.put({
      url: `${process.env.DEFAULT_URL}/teachers/classroom_activities/${classroomActivityId}/unlock_lesson`,
      json: {authenticity_token: $('meta[name=csrf-token]').attr('content')}
    }, (error, httpStatus, body) => {
      if (body.unlocked) {
        window.location = `http://connect.quill.org/#/teach/class-lessons/${lessonId}?&classroom_activity_id=${classroomActivityId}`
      }
    })
  }

  render() {
    return(
    <div className='choose-classroom-lessons container'>
      <div className='lesson-section'>
        <p>You've selected this lesson to launch:</p>
        <div className="lesson-row">
          <p>{this.state.activityName}</p>
          <span>Undo Selection</span>
        </div>
      </div>

      <div className='class-section'>
        <h3>Now, choose a class to launch this lesson:</h3>
        {this.renderClasses()}
      </div>
      <div className="bottom-section">
        <p>*To re-do a completed lesson with your students, you can re-assign the lesson to the class and launch it. To re-assign a lesson, you can click here.</p>
        <button onClick={this.launchLesson} className="q-button bg-quillgreen text-white">Launch Lesson</button>
      </div>
    </div>)
  }
}
