import * as React from 'react'
import { stripHtml } from "string-strip-html";

import { baseSrc, } from './shared'

import { formatAnswerStringForReport, findFeedbackForReport, } from '../../../Shared/index';
import numberSuffixBuilder from '../../../Teacher/components/modules/numberSuffixBuilder';

const feedbackReviseIcon = <img alt="" src={`${baseSrc}/feedback_revise.svg`} />
const feedbackCheckIcon = <img alt="" src={`${baseSrc}/feedback_check.svg`} />
const feedbackMultipleChoiceIcon = <img alt="" src={`${baseSrc}/feedback_multiple_choice.svg`} />

const Attempt = ({ groupedAttempts, studentReachedOptimal, index, lastAttempt, attempt, }) => {
  let className = "suboptimal"
  let icon = feedbackReviseIcon

  if (lastAttempt) {
    className = studentReachedOptimal ? 'optimal' : 'final-suboptimal'
    icon = studentReachedOptimal ? feedbackCheckIcon : feedbackMultipleChoiceIcon
  }

  const attemptNumber = attempt.attempt
  const previousAnswer = groupedAttempts[index - 1] ? groupedAttempts[index - 1][0].answer : null

  const feedback = String(findFeedbackForReport(attemptNumber, groupedAttempts))

  return (
    <div className="attempt" key={attemptNumber}>
      <h3>{numberSuffixBuilder(attemptNumber)} attempt</h3>
      <p className="answer">{formatAnswerStringForReport(attempt.answer, previousAnswer, attemptNumber, true)}</p>
      <div className={`feedback ${className}`}>
        <h4>{icon} Feedback</h4>
        <p>{stripHtml(feedback).result}</p>
      </div>
    </div>
  )
}

export default Attempt
