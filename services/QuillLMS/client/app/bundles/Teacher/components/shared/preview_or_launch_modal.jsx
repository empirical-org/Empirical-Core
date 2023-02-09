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
    const { completed, closeModal, } = this.props
    const launchLessonButton = completed ? null : <a className="bg-quillgreen" href={this.launchLessonLink()}>Launch Lesson</a>
    return (
      <div>
        <div className="preview-or-launch-modal-background" />
        <div className="preview-or-launch-modal">
          <h1>Would you like to preview this lesson?</h1>
          <button className="interactive-wrapper focus-on-light" onClick={closeModal} type="button"><img alt="close-icon" src={`${import.meta.env.VITE_PROCESS_ENV_CDN_URL}/images/icons/CloseIcon.svg`} /></button>
          <p>You can either preview this lesson or launch it. If you are ready to use this lesson with your students now, launch it.</p>
          <a className="bg-quillgreen" href={this.previewLessonLink()}>Preview Lesson</a>
          {launchLessonButton}
        </div>
      </div>
    );
  }
}
