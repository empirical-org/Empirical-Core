'use strict'

import React from 'react'
import LoadingSpinner from '../../shared/loading_indicator.jsx'
require('../../../../../assets/styles/app-variables.scss')


export default React.createClass({
	propTypes: {
		clickCallback: React.PropTypes.func.isRequired
	},

	buttonBuilder: function (name) {
		return () => {
			this.props.clickCallback(name.toLowerCase())
		}
	},

	buttons: function() {
		const contents = ['Students', 'Questions', 'Recommendations'];
		return contents.map((buttonName)=>	<button key={buttonName} type="button" onClick={this.buttonBuilder(buttonName)} className="btn btn-secondary">{buttonName}</button>)
	},

	render: function() {
		return (
			<div id='report-button-group' className="btn-group" role="group" aria-label="Basic example">
				{this.buttons()}
			</div>
		);
	}
});
