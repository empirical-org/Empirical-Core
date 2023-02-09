'use strict';
import React from 'react';

export default class ButtonLoadingIndicator extends React.Component {
  render() {
    return (
      <span className='assigner-container'>
        <img alt="a circle being retraced" className='assigner' src={`${import.meta.env.VITE_PROCESS_ENV_CDN_URL}/images/shared/assigner_still.png`} />
      </span>
    )
  }
}
