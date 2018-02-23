'use strict';
import React from 'react'
import createReactClass from 'create-react-class'

export default createReactClass({
	render: function () {
		return (
			<span className='assigner-container'>
				<img className='assigner' src={`${process.env.CDN_URL}/images/shared/assigner_still.png`}/>
			</span>
		);
	}
});
