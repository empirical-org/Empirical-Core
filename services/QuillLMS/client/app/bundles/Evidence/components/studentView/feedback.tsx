import * as React from 'react'
import ReactCSSTransitionReplace from 'react-css-transition-replace'
import stripHtml from "string-strip-html";

import { GRAMMAR, SPELLING, RULES_BASED_3, } from '../../../../constants/evidence'

const loopSrc = `${process.env.CDN_URL}/images/icons/loop.svg`
const smallCheckCircleSrc = `${process.env.CDN_URL}/images/icons/check-circle-small.svg`
const closeIconSrc = `${process.env.CDN_URL}/images/icons/clear-enabled.svg`
const informationSrc = `${process.env.CDN_URL}/images/pages/evidence/icons-information-small.svg`

const reportAProblemOptions = (optimal) => ([
  "I don't think this feedback applies to what I wrote",
  "I don't understand this feedback",
  optimal ? "I think my answer still has an error" : "I think my answer is correct"
])

const ReportAProblemOption = ({ option, handleSelectProblem, }) => {
  function handleClick() { handleSelectProblem(option) }

  return <button className="report-a-problem-option focus-on-light" onClick={handleClick} type="button">{option}</button>
}

const madeLastAttemptAndItWasSuboptimal = (submittedResponses, prompt, lastSubmittedResponse) => {
  const madeLastAttempt = submittedResponses.length === prompt.max_attempts
  return madeLastAttempt && !lastSubmittedResponse.optimal
}

const feedbackToShow = (lastSubmittedResponse, submittedResponses, prompt, customFeedback) => {

  if (customFeedback) { return customFeedback }

  if (!madeLastAttemptAndItWasSuboptimal(submittedResponses, prompt, lastSubmittedResponse)) { return lastSubmittedResponse.feedback }

  if ([GRAMMAR, SPELLING, RULES_BASED_3].includes(lastSubmittedResponse.feedback_type)) {
    return `<p>You completed four revisions! ${stripHtml(prompt.optimal_label_feedback || '')}</p><br/><p>However, our feedback bot detected additional spelling or grammar changes you could make to improve your sentence.</p><br/><p>Read your response one more time, and think about what changes you could make. Then move on to the next prompt.</p>`
  }

  return prompt.max_attempts_feedback
}

const feedbackForInnerHTML = (feedback) => {
  return {__html: feedback}
}

const Feedback: React.SFC = ({ lastSubmittedResponse, prompt, submittedResponses, customFeedback, customFeedbackKey, reportAProblem, }: any) => {
  const [reportAProblemExpanded, setReportAProblemExpanded] = React.useState(false)
  const [reportSubmitted, setReportSubmitted] = React.useState(false)

  React.useEffect(() => {
    setReportAProblemExpanded(false)
    setReportSubmitted(false)
  }, [lastSubmittedResponse])

  React.useEffect(() => {
    if (reportAProblemExpanded) {
      const el = document.getElementsByClassName("report-a-problem-section")[0]
      el.scrollIntoView(false)
    }
  }, [reportAProblemExpanded])

  function toggleReportAProblemExpanded() { setReportAProblemExpanded(!reportAProblemExpanded) }

  function handleSelectProblem(report) {
    const { entry, } = lastSubmittedResponse
    const { text, } = prompt
    const entryWithoutStem = entry.replace(text, '').trim()
    const callback = () => setReportSubmitted(true)

    reportAProblem({ report, callback, entry: entryWithoutStem, })
  }

  let className = 'feedback'
  let imageSrc = loopSrc
  let imageAlt = 'Revise icon'
  if (lastSubmittedResponse.optimal) {
    className += ' optimal'
    imageSrc = smallCheckCircleSrc
    imageAlt = 'Check icon'
  }

  const key = customFeedbackKey || submittedResponses.length
  const feedback = feedbackToShow(lastSubmittedResponse, submittedResponses, prompt, customFeedback)

  const reportAProblemButton = <button className="report-a-problem-button interactive-wrapper" onClick={toggleReportAProblemExpanded} type="button">Report a problem</button>
  let reportAProblemSection = <span />
  if (reportAProblemExpanded) {
    const reportAProblemOptionElements = reportSubmitted ? null : <div className="options">{reportAProblemOptions(lastSubmittedResponse.optimal).map(opt => <ReportAProblemOption handleSelectProblem={handleSelectProblem} key={opt} option={opt} />)}</div>
    const label = reportSubmitted ? 'Thank you for your feedback!' : 'What did you notice?'
    const text = reportSubmitted ? 'For now, please try your best to revise and improve your sentence.' : ''

    reportAProblemSection = (<section className="report-a-problem-section">
      <div className="report-a-problem-section-header">
        <span className="label">{label}</span>
        <button className="interactive-wrapper focus-on-light" onClick={toggleReportAProblemExpanded} type="button">
          <img alt="Close" src={closeIconSrc} />
          <span>Close</span>
        </button>
      </div>
      <span className="text">{text}</span>
      {reportAProblemOptionElements}
    </section>)
  }

  let headsUpSection

  if (madeLastAttemptAndItWasSuboptimal(submittedResponses, prompt, lastSubmittedResponse)) {
    headsUpSection = (
      <div className="heads-up">
        <div className="label-section">
          <img alt="Information icon" src={informationSrc} />
          <p>Heads up</p>
        </div>
        <p>Our feedback bot is not perfect, and it sometimes might be wrong. If you think the feedback is inaccurate, please click on the “Report a problem” button above.</p>
        <br />
        <p>This activity is just for practice, and it is not graded. By practicing and revising on Quill, you are strengthening your writing skills.</p>
      </div>
    )
  }

  return (
    <div className={`feedback-section ${reportAProblemExpanded ? 'expanded' : ''}`}>
      <ReactCSSTransitionReplace
        transitionEnterTimeout={1000}
        transitionLeaveTimeout={400}
        transitionName="fade"
      >
        <React.Fragment>
          <div className={className} key={key}>
            <div className="label-section">
              <img alt={imageAlt} src={imageSrc} />
              <p>Feedback</p>
            </div>
            <p className="feedback-text" dangerouslySetInnerHTML={feedbackForInnerHTML(feedback)} role="status" />
            <div className="report-a-problem-button-container">{reportAProblemButton}</div>
          </div>
          {reportAProblemSection}
        </React.Fragment>
      </ReactCSSTransitionReplace>
      {headsUpSection}
    </div>
  )
}

export default Feedback
