import * as React from 'react'

const LoadingSpinner: React.SFC = () => {
  return (
    <div className="spinner-container">
      <img className='spinner' src="https://assets.quill.org/images/shared/loader_still.svg"/>
    </div>
  );

}

export default LoadingSpinner
