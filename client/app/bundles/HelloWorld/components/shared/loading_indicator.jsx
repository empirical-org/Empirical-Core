"use strict";
import React from 'react'
import createReactClass from 'create-react-class'

export default createReactClass({
	render: function () {
		return (
			<div className="spinner-container">
				<img className='spinner' src='/images/loader_still.svg'/>
			</div>
		);
	}
});
