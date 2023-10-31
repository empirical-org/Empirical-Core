import * as React from 'react'

const imgBaseSrc = `${process.env.CDN_URL}/images/shared`
const defaultLoadingSpinnerImgSrc = `${imgBaseSrc}/indeterminate_progress_spinner.png`
const darkLoadingSpinnerImgSrc = `${imgBaseSrc}/indeterminate_spinner_dark.svg`
const lightLoadingSpinnerImgSrc = `${imgBaseSrc}/indeterminate_spinner_light.svg`

const ButtonIndeterminateSpinner = ({ imgSrc }) => (
  <span className='button-loading-spinner-container'>
    <img alt="spinning circle to indicate loading" className='button-loading-spinner' src={imgSrc} />
  </span>
)

const ButtonLoadingSpinner = () => (<ButtonIndeterminateSpinner imgSrc={defaultLoadingSpinnerImgSrc} />)
const DarkButtonLoadingSpinner = () => (<ButtonIndeterminateSpinner imgSrc={darkLoadingSpinnerImgSrc} />)
const LightButtonLoadingSpinner = () => (<ButtonIndeterminateSpinner imgSrc={lightLoadingSpinnerImgSrc} />)

export { ButtonLoadingSpinner, DarkButtonLoadingSpinner, LightButtonLoadingSpinner }
