import * as React from 'react'

const LoadingSpinner: React.SFC = () => (
  <div className="spinner-container">
    <img alt="" className='spinner' src={`${process.env.CDN_URL}/images/shared/loader_still.svg`} />
  </div>
)

export default LoadingSpinner
