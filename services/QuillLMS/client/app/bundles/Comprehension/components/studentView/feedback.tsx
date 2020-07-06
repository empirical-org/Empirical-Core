import * as React from 'react'

import ReactCSSTransitionReplace from 'react-css-transition-replace'

const loopSrc = `${process.env.CDN_URL}/images/icons/loop.svg`
const smallCheckCircleSrc = `${process.env.CDN_URL}/images/icons/check-circle-small.svg`

const feedbackToShow = (lastSubmittedResponse, submittedResponses, prompt, customFeedback) => {

  const madeLastAttempt = submittedResponses.length === prompt.max_attempts
  const madeLastAttemptAndItWasSuboptimal = madeLastAttempt && !lastSubmittedResponse.optimal

  if (customFeedback) { return customFeedback }

  return madeLastAttemptAndItWasSuboptimal ? prompt.max_attempts_feedback : lastSubmittedResponse.feedback
}

const feedbackForInnerHTML = (feedback) => {
  return {__html: feedback}
}

const Feedback: React.SFC = ({ lastSubmittedResponse, prompt, submittedResponses, customFeedback, customFeedbackKey }: any) => {
  let className = 'feedback'
  let imageSrc = loopSrc
  let imageAlt = 'Arrows pointing in opposite directions, making a loop'
  if (lastSubmittedResponse.optimal) {
    className += ' optimal'
    imageSrc = smallCheckCircleSrc
    imageAlt = 'Small green circle with a check in it'
  }

  const key = customFeedbackKey || submittedResponses.length
  const feedback = feedbackToShow(lastSubmittedResponse, submittedResponses, prompt, customFeedback)

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
          <p className="feedback-text" dangerouslySetInnerHTML={feedbackForInnerHTML(feedback)} />
        </div>
      </ReactCSSTransitionReplace>
    </div>
  )
}

export default Feedback
