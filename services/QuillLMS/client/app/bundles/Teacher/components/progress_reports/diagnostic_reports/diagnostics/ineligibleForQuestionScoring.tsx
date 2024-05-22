import * as React from 'react'

import { timeRewindIllustration, } from './shared'

const IneligibleForQuestionScoring = ({ pageName, }) => {
  return (
    <section className="results-empty-state">
      {timeRewindIllustration}
      <h2>The {pageName} is not available for diagnostics completed before August 2023.</h2>
      <p>Due to a change in our system, we cannot show the {pageName} for this diagnostic report. However, you can still:</p>
      <ol>
        <li>View the <b>Practice Recommendations</b> to see each recommended practice activity.</li>
        <li>View the <b>Student Responses</b> page to see each student’s score on the diagnostic.</li>
        <li> View the <b>Question Analysis</b> page to see how the class performed on each question.</li>
      </ol>
      <p>If you have questions, please reach out to support@quill.org.</p>
    </section>
  )
}

export default IneligibleForQuestionScoring
