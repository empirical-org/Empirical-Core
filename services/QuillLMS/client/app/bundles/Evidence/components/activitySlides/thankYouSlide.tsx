import * as React from 'react'

import useFocus from '../../../Shared/hooks/useFocus'

const applaudingSrc = `${import.meta.env.VITE_PROCESS_ENV_CDN_URL}/images/pages/evidence/applauding.svg`

const ThankYouSlide = () => {
  const [containerRef, setContainerFocus] = useFocus()

  React.useEffect(() => {
    setContainerFocus()
  }, [])

  const backToDashboard = () => {
    window.location.href = import.meta.env.DEFAULT_URL
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
        <a className='quill-button large secondary outlined focus-on-dark' href={import.meta.env.DEFAULT_URL} onClick={backToDashboard}>Back to my dashboard</a>
      </div>
    </div>
  )
}

export default ThankYouSlide
