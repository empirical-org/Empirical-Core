import * as React from 'react'
import ReactCSSTransitionReplace from 'react-css-transition-replace'

const loopSrc = `${process.env.CDN_URL}/images/icons/loop.svg`
const smallCheckCircleSrc = `${process.env.CDN_URL}/images/icons/check-circle-small.svg`
const closeIconSrc = `${process.env.CDN_URL}/images/icons/clear-enabled.svg`

const reportAProblemOptions = (optimal) => ([
  "I don't think this feedback applies to what I wrote",
  "I don't understand this feedback",
  optimal ? "I think my answer still has an error" : "I think my answer is correct"
])

const ReportAProblemOption = ({ option, handleSelectProblem, }) => {
  function handleClick() { handleSelectProblem(option) }

  return <button className="report-a-problem-option focus-on-light" onClick={handleClick} type="button">{option}</button>
}

const feedbackToShow = (lastSubmittedResponse, submittedResponses, prompt, customFeedback) => {

  const madeLastAttempt = submittedResponses.length === prompt.max_attempts
  const madeLastAttemptAndItWasSuboptimal = madeLastAttempt && !lastSubmittedResponse.optimal

  if (customFeedback) { return customFeedback }

  return madeLastAttemptAndItWasSuboptimal ? prompt.max_attempts_feedback : lastSubmittedResponse.feedback
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
  let imageAlt = 'Arrows pointing in opposite directions, making a loop'
  if (lastSubmittedResponse.optimal) {
    className += ' optimal'
    imageSrc = smallCheckCircleSrc
    imageAlt = 'Small green circle with a check in it'
  }

  const key = customFeedbackKey || submittedResponses.length
  const feedback = feedbackToShow(lastSubmittedResponse, submittedResponses, prompt, customFeedback)

  let reportAProblemSection = <button className="report-a-problem-button" onClick={toggleReportAProblemExpanded} type="button">Report a problem</button>

  if (reportAProblemExpanded) {
    const reportAProblemOptionElements = reportSubmitted ? null : <div className="options">{reportAProblemOptions(lastSubmittedResponse.optimal).map(opt => <ReportAProblemOption handleSelectProblem={handleSelectProblem} key={opt} option={opt} />)}</div>
    const label = reportSubmitted ? 'Thank you for your feedback!' : 'Report a problem'
    const text = reportSubmitted ? 'For now, please try your best to revise and improve your sentence.' : 'What did you notice?'

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

  return (
    <div className={`feedback-section ${reportAProblemExpanded ? 'expanded' : ''}`}>
      <p className="feedback-section-header">
        Feedback<span>{submittedResponses.length} of {prompt.max_attempts} attempts</span>
      </p>
      <ReactCSSTransitionReplace
        transitionEnterTimeout={1000}
        transitionLeaveTimeout={400}
        transitionName="fade"
      >
        <React.Fragment>
          <div className={className} key={key}>
            <img alt={imageAlt} src={imageSrc} />
            <p className="feedback-text" dangerouslySetInnerHTML={feedbackForInnerHTML(feedback)} role="status" />
          </div>
          {reportAProblemSection}
        </React.Fragment>
      </ReactCSSTransitionReplace>
    </div>
  )
}

export default Feedback
