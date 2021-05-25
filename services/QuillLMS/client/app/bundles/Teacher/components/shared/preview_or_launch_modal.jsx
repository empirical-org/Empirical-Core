import React from 'react';

export default class PreviewOrLaunchModal extends React.Component {

  constructor(props) {
    super(props);
  }

  launchLessonLink() {
    const { classroomUnitId, lessonUID, lessonID, unitID, } = this.props;
    if (classroomUnitId && (lessonUID || lessonID)) {
      return `/teachers/classroom_units/${classroomUnitId}/launch_lesson/${lessonUID || lessonID}`;
    } else if (lessonID) {
      return `/teachers/units/select_lesson/${lessonID}`;
    }
  }

  previewLessonLink() {
    const { lessonUID, lessonID, } = this.props;
    return `/preview_lesson/${lessonUID || lessonID}`;
  }

  render() {
    const launchLessonButton = this.props.completed === false ? <a className="bg-quillgreen" href={this.launchLessonLink()}>Launch Lesson</a> : null;
    return (
      <div>
        <div className="preview-or-launch-modal-background" />
        <div className="preview-or-launch-modal">
          <h1>Would you like to preview this lesson?</h1>
          <img alt="close-icon" onClick={this.props.closeModal} src={`${process.env.CDN_URL}/images/icons/CloseIcon.svg`} />
          <p>You can either preview this lesson or launch it. If you are ready to use this lesson with your students now, launch it.</p>
          <a className="bg-quillgreen" href={this.previewLessonLink()}>Preview Lesson</a>
          {launchLessonButton}
        </div>
      </div>
    );
  }
}
