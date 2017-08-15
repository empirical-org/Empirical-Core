import React from 'react'
import request from 'request'

export default class PreviewOrLaunchModal extends React.Component {

  constructor(props) {
    super(props)

    this.launchLesson = this.launchLesson.bind(this)
    this.previewLesson = this.previewLesson.bind(this)
  }

  launchLesson() {
    const {classroomActivityID, lessonUID, lessonID, unitID} = this.props
    if (classroomActivityID && lessonUID) {
      request.put({
        url: `${process.env.DEFAULT_URL}/teachers/classroom_activities/${classroomActivityID}/unlock_lesson`,
        json: {authenticity_token: $('meta[name=csrf-token]').attr('content')}
      }, (error, httpStatus, body) => {
        if (body.unlocked) {
          const lessonUrl = `http://connect.quill.org/#/teach/class-lessons/${lessonUID}?&classroom_activity_id=${classroomActivityID}`
          if (this.props.hasViewedLessonTutorial) {
            window.location = lessonUrl
          } else {
            window.location = `${process.env.DEFAULT_URL}/tutorials/lessons?url=${encodeURIComponent(lessonUrl)}`
          }
        }
      })
    } else if (lessonID && unitID) {
      window.location = `/teachers/classrooms/activity_planner/lessons/${lessonID}/unit/${unitID}`
    }
  }

  previewLesson() {
    const {classroomActivityID, lessonUID, lessonID, unitID} = this.props
    // TODO get real preview link
    const lessonUrl = `http://connect.quill.org/#/teach/class-lessons/${lessonUID}?&classroom_activity_id=${classroomActivityID}`
    if (this.props.hasViewedLessonTutorial) {
      window.location = lessonUrl
    } else {
      window.location = `${process.env.DEFAULT_URL}/tutorials/lessons?url=${encodeURIComponent(lessonUrl)}`
    }
  }

  render() {
    const {classroomActivityID, lessonUID} = this.props
    // TODO: preview link will not work without a classroomActivityID and lessonUID,
    // so it will not work from the modal that opens from the dashboard right now.
    // we need a generic preview link.
    return (
      <div>
        <div className="preview-or-launch-modal-background"></div>
        <div className="preview-or-launch-modal">
          <h1>Would you like to preview this lesson?</h1>
          <img alt="close-icon" src="/images/close_icon.svg" onClick={this.props.closeModal}/>
          <p>You can either preview this lesson or launch it. If you are ready to use this lesson with your students now, launch it.</p>
          <a onClick={this.previewLesson} className="bg-quillgreen">Preview Lesson</a>
          <a onClick={this.launchLesson} className="bg-quillgreen">Launch Lesson</a>
        </div>
      </div>
    )
  }
}
