'use strict'

import React from 'react'
import LoadingSpinner from '../../shared/loading_indicator.jsx'
require('../../../../../assets/styles/app-variables.scss')


export default React.createClass({
	propTypes: {
		selectedButton: React.PropTypes.string,
		clickCallback: React.PropTypes.func.isRequired
	},

	handleClick: function(e) {
		this.props.clickCallback(e.target.innerHTML.toLowerCase())
	},

	buttons: function() {
		const contents = ['Students', 'Concepts', 'Questions'];
		return contents.map((buttonName)=>	<button key={buttonName} type="button" onClick={this.handleClick} className="btn btn-secondary">{buttonName}</button>)
	},

	render: function() {
		return (
			<div id='report-button-group' className="btn-group" role="group" aria-label="Basic example">
				{this.buttons()}
			</div>
		);
	}
});
