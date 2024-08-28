import * as React from 'react'

import useFocus from '../../../Shared/hooks/useFocus'

const applaudingSrc = `${process.env.CDN_URL}/images/pages/evidence/applauding.svg`

const ThankYouSlide = ({ resultPageUrl, }) => {
  const [containerRef, setContainerFocus] = useFocus()

  React.useEffect(() => {
    setContainerFocus()
  }, [])

  const backToDashboard = () => {
    window.location.href = resultPageUrl
  }

  return (
    <div className="activity-follow-up-container thank-you-slide-container no-focus-outline" ref={containerRef} tabIndex={-1}>
      <div className="thank-you-content">
        <section>
          <p>Your feedback was sent</p>
          <h1>Thanks for sharing your feedback! </h1>
        </section>
        <img alt="Two hands clapping together" src={applaudingSrc} />
      </div>
      <div className="button-section">
        <a className='quill-button-archived large secondary outlined focus-on-dark' href={resultPageUrl} onClick={backToDashboard}>Back to my dashboard</a>
      </div>
    </div>
  )
}

export default ThankYouSlide
