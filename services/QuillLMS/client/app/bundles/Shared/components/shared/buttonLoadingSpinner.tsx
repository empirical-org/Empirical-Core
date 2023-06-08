import * as React from 'react'

const ButtonLoadingSpinner = () => (
  <span className='button-loading-spinner-container'>
    <img alt="spinning circle to indicate loading" className='button-loading-spinner' src={`${process.env.CDN_URL}/images/shared/indeterminate_progress_spinner.png`} />
  </span>
)

export { ButtonLoadingSpinner }
