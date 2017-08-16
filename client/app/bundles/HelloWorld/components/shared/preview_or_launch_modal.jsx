import React from 'react'

export default class PreviewOrLaunchModal extends React.Component {

  constructor(props) {
    super(props)

    this.previewLesson = this.previewLesson.bind(this)
  }

  launchLessonLink() {
    const {classroomActivityID, lessonUID, lessonID, unitID} = this.props
    if (classroomActivityID && lessonUID) {
      return `/teachers/classroom_activities/${classroomActivityID}/launch_lesson/${lessonUID}`
    } else if (lessonID && unitID) {
      return `/teachers/units/${unitID}/launch_lesson/${lessonID}`
    }
  }

  previewLesson() {
    const {classroomActivityID, lessonUID, lessonID, unitID} = this.props
    // TODO get real preview link
    // const lessonUrl = `http://connect.quill.org/#/teach/class-lessons/${lessonUID}?&classroom_activity_id=${classroomActivityID}`
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
          <a href={this.launchLessonLink()} className="bg-quillgreen">Launch Lesson</a>
        </div>
      </div>
    )
  }
}
