import React from 'react'

interface ProgressBarProps {
  percent: number;
  answeredQuestionCount: number;
  questionCount: number;
  thingsCompleted: string;
}

const ProgressBar = ({ percent, answeredQuestionCount, questionCount, thingsCompleted, }: ProgressBarProps) => (
  <div className="progress-bar-container">
    <progress className="progress activity-progress" max="100" value={percent} />
    <p>{answeredQuestionCount} of {questionCount} {thingsCompleted} completed</p>
  </div>)

export { ProgressBar }
