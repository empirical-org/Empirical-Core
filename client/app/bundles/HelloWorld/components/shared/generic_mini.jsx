'use strict'

import React from 'react'
import createReactClass from 'create-react-class'

export default createReactClass({

	render: function() {
		return (
			<div className='generic-mini' key={this.props.title} onClick={this.changeView}>
     {this.props.children}
   </div>
		)
	}
})
