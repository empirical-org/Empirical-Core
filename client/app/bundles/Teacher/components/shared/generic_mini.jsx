'use strict'

import React from 'react'

export default React.createClass({

	render: function() {
		return (
			<div className='generic-mini' key={this.props.title} onClick={this.changeView}>
     {this.props.children}
   </div>
		)
	}
})
