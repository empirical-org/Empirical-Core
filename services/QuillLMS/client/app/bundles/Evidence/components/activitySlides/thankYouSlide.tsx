import * as React from 'react'

const applaudingSrc = `${process.env.CDN_URL}/images/pages/evidence/applauding.svg`

const ThankYouSlide = () => {
  return (<div className="activity-follow-up-container thank-you-slide-container">
    <div className="thank-you-content">
      <section>
        <p>Your feedback was sent</p>
        <h1>Thanks for sharing your feedback! </h1>
      </section>
      <img alt="Two hands clapping together" src={applaudingSrc} />
    </div>
    <div className="button-section">
      <a className='quill-button large secondary outlined focus-on-dark' href={process.env.DEFAULT_URL}>Back to my dashboard</a>
    </div>
  </div>)
}

export default ThankYouSlide
