'use strict';
import React from 'react'

export default class extends React.Component {
    render() {
		return (
  <span className='assigner-container'>
    <img className='assigner' src={`${process.env.CDN_URL}/images/shared/assigner_still.png`} />
  </span>
		);
	}
}
