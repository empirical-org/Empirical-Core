import * as React from 'react';

const TimeoutModal = (props) =>
  (<div className="timeout-modal-container">
    <div className="timeout-modal-background" onClick={props.closeModal} />
    <div className="timeout-modal">
      <img className="exit" onClick={props.closeModal} src="https://assets.quill.org/images/icons/CloseIcon.svg" />
      <img className="illustration" src="https://assets.quill.org/images/illustrations/lessons-inactive-modal.svg" />
      <h1 className="timeout">Are you still using this lesson with your students?</h1>
      <p>If you are no longer collaborating on this lesson with your students, you can <span className="mark-complete">mark it as complete</span>. Once your lesson is marked complete, your student answers will be saved in the <span className="activity-analysis">Activity Analysis</span> report. If you want to resume this lesson at a later time, you can close the tab and launch it later.</p>
      <button onClick={props.closeModal}>Yes, resume lesson</button>
      <p className="complete-lesson" onClick={props.finishLesson}>No, mark lesson as complete</p>
    </div>
  </div>);

export default TimeoutModal
