import * as React from 'react';

const TimeoutModal = (props) =>
  (<div className="timeout-modal-container">
    <div className="timeout-modal-background" onClick={props.closeModal} />
    <div className="timeout-modal">
      <button className="interactive-wrapper focus-on-light exit" onClick={props.closeModal} type="button"><img alt="Close icon" src="https://assets.quill.org/images/icons/CloseIcon.svg" /></button>
      <img alt="" className="illustration" src="https://assets.quill.org/images/illustrations/lessons-inactive-modal.svg" />
      <h1 className="timeout">Are you still using this lesson with your students?</h1>
      <p>If you are no longer collaborating on this lesson with your students, you can <span className="mark-complete">mark it as complete</span>. Once your lesson is marked complete, your student answers will be saved in the <span className="activity-analysis">Activity Analysis</span> report. If you want to resume this lesson at a later time, you can close the tab and launch it later.</p>
      <button onClick={props.closeModal}>Yes, resume lesson</button>
      <button className="complete-lesson interactive-wrapper focus-on-light" onClick={props.finishLesson}>No, mark lesson as complete</button>
    </div>
  </div>);

export default TimeoutModal
