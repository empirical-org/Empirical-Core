import * as React from 'react'
const spinnerSrc = 'https://assets.quill.org/images/icons/loader_still.svg';
const Spinner = () => (
  <div className="loading-spinner">
    <div className="spinner-container">
      <img alt="" className='spinner' src={spinnerSrc} />
    </div>
  </div>
)

export { Spinner }
