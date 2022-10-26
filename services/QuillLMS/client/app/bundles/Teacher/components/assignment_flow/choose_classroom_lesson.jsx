import React from 'react';

import LoadingSpinner from '../shared/loading_indicator'
import { requestGet, } from '../../../../modules/request/index'

export default class ChooseClassroomLesson extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      activityName: '',
      classroomUnits: []
    }

    this.getClassroomLessonInfo()
  }

  getClassroomLessonInfo() {
    requestGet(`${process.env.DEFAULT_URL}/teachers/units/lesson_info_for_activity/${this.props.match.params.activityId}`, (body) => {
      const data = JSON.parse(body)
      this.setState({
        classroomUnits: data.classroom_units,
        activityName: data.activity_name[0].name,
        loading: false
      })
    })
  }

  setSelectedClassroomUnitId(id) {
    this.setState({ classroomUnitId: id })
  }

  goBack = () => {
    this.props.history.goBack()
  };

  launchLessonLink() {
    const classroomUnitId = this.state.classroomUnitId
    const lessonId = this.props.match.params.activityId
    return `${process.env.DEFAULT_URL}/teachers/classroom_units/${classroomUnitId}/launch_lesson/${lessonId}`
  }

  renderClasses() {
    const classrooms = this.state.classroomUnits.map((ca, i) =>
      this.renderClassroomRow(ca, i)
    )
    return <div>{classrooms}</div>
  }

  renderClassroomRow(cu, i) {
    const numberOfStudents = `${cu.number_of_assigned_students} student${cu.number_of_assigned_students === 1 ? '' : 's'}`
    const selectedClassName = cu.id === this.state.classroomUnitId ? 'selected' : null
    let completionText, completionClass, imgName, clickFunction
    if (cu.completed) {
      completionText = <span className="completed-text"><i className="fas fa-check-circle" /> Lesson Completed*</span>
      completionClass = 'completed'
      imgName = "radio_button_light_gray"
    } else {
      completionText = <span />
      completionClass = 'incomplete'
      imgName = selectedClassName ? "radio_button_selected" : "radio_button_empty"
      clickFunction = () => {this.setSelectedClassroomUnitId(cu.id)}
    }
    return (
      <div className={`classroom-row ${selectedClassName} ${completionClass}`} key={i} onClick={clickFunction}>
        <div>
          <img alt="" src={`${process.env.CDN_URL}/images/shared/${imgName}.svg`} />
          <span>{cu.classroom_name}</span> ({numberOfStudents})
        </div>
        {completionText}
      </div>
    )
  }

  render() {
    const buttonClass = this.state.classroomUnitId ? 'bg-quillgreen' : ''
    const text = this.state.classroomUnitId && this.state.classroomUnits.find(cu => cu.id === this.state.classroomUnitId).started === true
      ? 'Resume Lesson'
      : 'Launch Lesson'
    if (this.state.loading) {
      return <LoadingSpinner />
    } else {
      return(
        <div className='choose-classroom-lessons container'>
          <div className='lesson-section'>
            <p>You've selected this lesson to launch:</p>
            <div className="lesson-row">
              <img alt="" src={`${process.env.CDN_URL}/images/shared/icon-lesson-box.svg`} />
              <p>{this.state.activityName}</p>
              <span onClick={this.goBack}>Undo Selection</span>
            </div>
          </div>

          <div className='class-section'>
            <h3>Now, choose a class to launch this lesson:</h3>
            {this.renderClasses()}
          </div>
          <div className="bottom-section">
            {/* we will use the text below when we have a lessons page to send teachers to */}
            {/* <p>*To re-do a completed lesson with your students, you can re-assign the lesson to the class and launch it. To re-assign a lesson, you can click here.</p> */}
            <p>*To re-do a completed lesson with your students, you can re-assign the lesson to the class and launch it.</p>
            <a className={`q-button text-white ${buttonClass}`} href={this.launchLessonLink()}>{text}</a>
          </div>
        </div>
      )
    }
  }
}
