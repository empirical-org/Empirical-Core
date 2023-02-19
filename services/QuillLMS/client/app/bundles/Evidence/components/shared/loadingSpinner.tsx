import * as React from 'react'

const LoadingSpinner: React.SFC = () => (
  <div className="spinner-container">
    <img alt="" className='spinner' src={`${import.meta.env.VITE_PROCESS_ENV_CDN_URL}/images/shared/loader_still.svg`} />
  </div>
)

export default LoadingSpinner
