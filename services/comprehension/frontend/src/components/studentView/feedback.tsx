import * as React from 'react'

import ReactCSSTransitionReplace from 'react-css-transition-replace'

const loopSrc = `${process.env.QUILL_CDN_URL}/images/icons/loop.svg`
const smallCheckCircleSrc = `${process.env.QUILL_CDN_URL}/images/icons/check-circle-small.svg`

export const TOO_SHORT_FEEDBACK = "Whoops, it looks like you submitted your response before it was ready! Re-read what you wrote and finish the sentence provided."
export const TOO_LONG_FEEDBACK = "Revise your work so it is shorter and more concise."

const Feedback: React.SFC = ({ lastSubmittedResponse, prompt, submittedResponses, tooShort, tooLong }: any) => {
  let className = 'feedback'
  let imageSrc = loopSrc
  let imageAlt = 'Arrows pointing in opposite directions, making a loop'
  if (lastSubmittedResponse.optimal) {
    className += ' optimal'
    imageSrc = smallCheckCircleSrc
    imageAlt = 'Small green circle with a check in it'
  }
  const madeLastAttempt = submittedResponses.length === prompt.max_attempts
  const madeLastAttemptAndItWasSuboptimal = madeLastAttempt && !lastSubmittedResponse.optimal

  let feedback = ''
  let key = submittedResponses.length
  if (tooShort) {
    feedback = TOO_SHORT_FEEDBACK
    key = 'too-short'
  } else if (tooLong) {
    feedback = TOO_LONG_FEEDBACK
    key = 'too-long'
  } else if (madeLastAttemptAndItWasSuboptimal) {
    feedback = prompt.max_attempts_feedback
  } else {
    feedback = lastSubmittedResponse.feedback
  }

  return (
    <div className="feedback-section">
      <p className="feedback-section-header">
        Feedback<span>{submittedResponses.length} of {prompt.max_attempts} attempts</span>
      </p>
      <ReactCSSTransitionReplace
        transitionAppear={true}
        transitionAppearTimeout={400}
        transitionEnterTimeout={1000}
        transitionLeaveTimeout={400}
        transitionName="fade"
      >
        <div className={className} key={key}>
          <img alt={imageAlt} src={imageSrc} />
          <p className="feedback-text">{feedback}</p>
        </div>
      </ReactCSSTransitionReplace>
    </div>
  )
}

export default Feedback
