import * as React from 'react';

interface ProgressBarProps {
  percent: number;
  answeredQuestionCount: number;
  questionCount: number;
  label: string;
}

const ProgressBar = ({ percent, answeredQuestionCount, questionCount, label, }: ProgressBarProps) => (
  <div className="progress-bar-container">
    <progress className="progress activity-progress" max="100" value={percent} />
    <p>{answeredQuestionCount} of {questionCount} {label}</p>
  </div>)

export { ProgressBar };

