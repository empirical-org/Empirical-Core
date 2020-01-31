import * as React from 'react'

import ReactCSSTransitionReplace from 'react-css-transition-replace'

const loopSrc = `${process.env.QUILL_CDN_URL}/images/icons/loop.svg`
const smallCheckCircleSrc = `${process.env.QUILL_CDN_URL}/images/icons/check-circle-small.svg`

const Feedback: React.SFC = ({ lastSubmittedResponse, prompt, submittedResponses }: any) => {
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
  const feedback = madeLastAttemptAndItWasSuboptimal ? prompt.max_attempts_feedback : lastSubmittedResponse.feedback
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
        <div className={className} key={submittedResponses.length}>
          <img alt={imageAlt} src={imageSrc} />
          <p>{feedback}</p>
        </div>
      </ReactCSSTransitionReplace>
    </div>
  )
}

export default Feedback
