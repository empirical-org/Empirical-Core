'use strict';
import React from 'react'

export default React.createClass({
	render: function () {
		return (
			<span className='assigner-container'>
				<img className='assigner' src={`${process.env.CDN_URL}/images/shared/assigner_still.png`}/>
			</span>
		);
	}
});
