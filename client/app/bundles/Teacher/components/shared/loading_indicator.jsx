"use strict";
import React from 'react'

export default React.createClass({
	render: function () {
		return (
			<div className="spinner-container">
				<img className='spinner' src='/images/loader_still.svg'/>
			</div>
		);
	}
});
