import * as React from 'react'

const readExampleSrc = `${process.env.CDN_URL}/images/illustrations/proofreader-example-proofread.svg`
const reviewExampleSrc = `${process.env.CDN_URL}/images/illustrations/proofreader-example-review.svg`
const practiceExampleSrc = `${process.env.CDN_URL}/images/illustrations/proofreader-example-practice.svg`

const WelcomePage = ({onNextClick}) => {
  return (
    <div className="welcome-page">
      <div className="header-section">
        <h1>Welcome to Quill Proofreader!</h1>
      </div>
      <div className="steps-section">
        <div className="step">
          <div className="step-number">1</div>
          <h2>Read</h2>
          <p>Read the passage and correct the grammar and punctuation errors you find.</p>
          <img alt="Proofreader example showing a potential grammar mistake highlighted" src={readExampleSrc} />
        </div>
        <div className="step">
          <div className="step-number">2</div>
          <h2>Review</h2>
          <p>Get feedback on each correction you made.</p>
          <img alt="Proofreader example showing a correct and incorrect revision" src={reviewExampleSrc} />
        </div>
        <div className="step">
          <div className="step-number">3</div>
          <h2>Improve</h2>
          <p>Work on a follow-up activity that focuses on one of the errors from the passage.</p>
          <img alt="Follow-up example showing a correct revision" src={practiceExampleSrc} />
        </div>
      </div>
      <div id="button-container" tabIndex={-1}>
        <button className="quill-button large contained primary focus-on-light" onClick={onNextClick} type="button">Next</button>
      </div>
    </div>
  )
}

export default WelcomePage
