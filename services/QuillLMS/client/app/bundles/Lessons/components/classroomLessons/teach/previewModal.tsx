import * as React from 'react';

const PreviewModal = (props) =>
  (<div>
    <div className="preview-modal-background" />
    <div className="preview-modal">
      <button className="interactive-wrapper focus-on-light exit" onClick={props.closeModal} type="button"><img alt="Close icon" src="https://assets.quill.org/images/icons/CloseIcon.svg" /></button>
      <img alt="" className="illustration" src="https://assets.quill.org/images/illustrations/preview_lesson_modal.svg" />
      <h1>You're about to preview Quill Lessons</h1>
      <p>Quill Lessons provides whole-class lessons that are led by the teacher. Select questions for your students and <span>instantly</span> see their responses.</p>
      <p>Each time you select a new question or project a student’s answer, students instantly see it on their screens.</p>
      <button onClick={props.closeModal}>Continue to Teacher View</button>
      <a onClick={props.openStudentView}>Open Student View<i className="fa fa-external-link" /></a>
    </div>
  </div>);

export default PreviewModal
