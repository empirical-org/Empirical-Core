import * as React from 'react';

interface ProgressBarProps {
  percent: number;
  answeredQuestionCount: number;
  questionCount: number;
}

const ProgressBar = ({ percent, answeredQuestionCount, questionCount, }: ProgressBarProps) => (
  <div className="progress-bar-container">
    <progress className="progress activity-progress" max="100" value={percent} />
    <p>{answeredQuestionCount} of {questionCount} edits made</p>
  </div>)

export default ProgressBar
