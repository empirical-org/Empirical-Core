import React from 'react'
import request from 'request'
import Units from './manage_units/units'
import LoadingIndicator from '../shared/loading_indicator'
import ClassroomDropdown from '../general_components/dropdown_selectors/classroom_dropdown'

export default class ClassroomLessons extends React.Component {
  constructor(props) {
    super()

    this.state = {
      lessons: [],
      classrooms: this.getClassrooms(),
      loaded: false,
      selectedClassroomId: props.routeParams.classroomId,
      hasViewedLessonTutorial: this.hasViewedLessonTutorial()
    }

    this.switchClassrooms = this.switchClassrooms.bind(this)

  }

  getClassrooms() {
    request.get(`${process.env.DEFAULT_URL}/teachers/classrooms_i_teach_with_lessons`, (error, httpStatus, body) => {
      const classrooms = JSON.parse(body).classrooms
      if (classrooms.length > 0) {
        this.setState({classrooms: classrooms, selectedClassroomId: this.props.routeParams.classroomId || classrooms[0].id}, () => this.getLessons())
      } else {
        this.setState({empty: true, loaded: true})
      }
    })
  }


  getLessons() {
    request.get({
      url: `${process.env.DEFAULT_URL}/teachers/lesson_units`,
      qs: {classroom_id: this.state.selectedClassroomId}
    }, (error, httpStatus, body) => {
      debugger;
      this.setState({lessons: JSON.parse(body).units, loaded: true})
    })
  }

  hasViewedLessonTutorial() {
    request.get(`${process.env.DEFAULT_URL}/milestones/has_viewed_lesson_tutorial`, (error, httpStatus, body) => {
      const completed = JSON.parse(body).completed
      this.setState({hasViewedLessonTutorial: completed})
    })
  }

  renderHeader() {
    return <div className="my-lessons-header">
      <h1>My Lessons</h1>
      <p>This is a list of all your assigned lessons for the selected class. You can change the selected class below.</p>
      <p><span>Note:</span> If you want to re-do a lesson with your class, re-assign the lesson then launch it.</p>
    </div>
  }

  renderEmptyState() {
    return <div className="empty-lessons manage-units">
      <div className="content">
        <h1>You have no lessons assigned!</h1>
        <p>In order to launch a lesson with your class, you need to first assign to a class and then launch.</p>
        <p>With Quill Lessons, teachers can use Quill to lead whole-class lessons and see and display student responses in real-time.</p>
        <div className="buttons">
          <a href="/teachers/classrooms/assign_activities/create-unit?tool=lessons" className="bg-quillgreen text-white">Assign Lessons</a>
          <a href="/tool/lessons" className="bg-white text-quillgreen">Learn More</a>
        </div>
      </div>
      <img src={`${process.env.CDN_URL}/assets/images/illustrations/empty_state_illustration_lessons.svg`} />
    </div>
  }

  switchClassrooms(classroom) {
    this.props.history.push(`/teachers/classrooms/activity_planner/lessons/${classroom.id}`)
    this.setState({selectedClassroomId: classroom.id}, () => this.getLessons())
  }

  render() {
    console.log('state', this.state)
    if (this.state.empty) {
      return this.renderEmptyState()
    } else if (this.state.loaded) {
      return(
        <div id="lesson_planner">
          <div className="container my-lessons manage-units">
            {this.renderHeader()}
            <ClassroomDropdown classrooms={this.state.classrooms}
                               callback={this.switchClassrooms}
                               selectedClassroom={this.state.classrooms.find((classy) => classy.id === Number(this.state.selectedClassroomId))}
            />
            <Units
              data={this.state.lessons}
              lesson={true}
              hasViewedLessonTutorial={this.state.hasViewedLessonTutorial}
            />
            </div>
          </div>)
    } else {
      return <LoadingIndicator />
    }
  }
}
