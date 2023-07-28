import * as React from 'react'

const ButtonLoadingIndicator = () => {
  return (
    <span className='assigner-container'>
      <img alt="a circle being retraced" className='assigner' src={`${process.env.CDN_URL}/images/shared/assigner_still.png`} />
    </span>
  )
}

export default ButtonLoadingIndicator
