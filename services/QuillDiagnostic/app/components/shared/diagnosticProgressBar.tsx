import React from 'react'

const DiagnosticProgressBar = ({ percent, answeredQuestionCount, questionCount, }) => (
  <div className="progress-bar-container">
    <progress className="progress activity-progress" max="100" value={percent} />
    <p>{answeredQuestionCount} of {questionCount} sentences completed</p>
  </div>)

export { DiagnosticProgressBar }
